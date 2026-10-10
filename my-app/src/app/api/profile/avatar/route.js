import { createHash, randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const MAX_UPLOAD_SIZE = 4 * 1024 * 1024;

function getImageType(bytes) {
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
        return "image/jpeg";
    }

    if (
        bytes.length >= 8 &&
        bytes[0] === 0x89 &&
        bytes.toString("ascii", 1, 4) === "PNG" &&
        bytes[4] === 0x0d &&
        bytes[5] === 0x0a &&
        bytes[6] === 0x1a &&
        bytes[7] === 0x0a
    ) {
        return "image/png";
    }

    if (
        bytes.length >= 12 &&
        bytes.toString("ascii", 0, 4) === "RIFF" &&
        bytes.toString("ascii", 8, 12) === "WEBP"
    ) {
        return "image/webp";
    }

    return null;
}

function jsonError(message, status) {
    return NextResponse.json({ error: message }, { status });
}

export async function POST(request) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        return jsonError("প্রোফাইল ছবি আপলোড করতে সাইন ইন করুন।", 401);
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        console.error("Cloudinary avatar upload is not configured.");
        return jsonError("ছবি আপলোড সুবিধাটি এখনো কনফিগার করা হয়নি।", 503);
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(cloudName)) {
        console.error("Cloudinary cloud name has an invalid format.");
        return jsonError("ছবি আপলোড সেবা সঠিকভাবে কনফিগার করা হয়নি।", 503);
    }

    let formData;
    try {
        formData = await request.formData();
    } catch (error) {
        console.error("Unable to read the avatar upload form data.", error);
        return jsonError("ছবিটি পড়া যায়নি। আবার চেষ্টা করুন।", 400);
    }

    const file = formData.get("file");
    if (!file || typeof file.arrayBuffer !== "function" || typeof file.size !== "number") {
        return jsonError("আপলোড করার জন্য একটি ছবি নির্বাচন করুন।", 400);
    }

    if (file.size === 0 || file.size > MAX_UPLOAD_SIZE) {
        return jsonError("ছবির আকার ৪ মেগাবাইটের মধ্যে হতে হবে।", 413);
    }

    const imageBytes = Buffer.from(await file.arrayBuffer());
    const detectedType = getImageType(imageBytes);

    if (!detectedType || detectedType !== file.type) {
        return jsonError("শুধু সঠিক JPEG, PNG অথবা WebP ছবি আপলোড করা যাবে।", 415);
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = `user-${randomUUID()}`;
    const folder = "bazardor/profiles";
    const signaturePayload = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = createHash("sha1").update(signaturePayload).digest("hex");
    const uploadData = new FormData();
    uploadData.set("file", new Blob([imageBytes], { type: detectedType }), file.name);
    uploadData.set("api_key", apiKey);
    uploadData.set("timestamp", String(timestamp));
    uploadData.set("folder", folder);
    uploadData.set("public_id", publicId);
    uploadData.set("signature", signature);

    let cloudinaryResponse;
    try {
        cloudinaryResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: "POST",
                body: uploadData,
                signal: AbortSignal.timeout(20000),
            },
        );
    } catch (error) {
        console.error("Cloudinary avatar upload request failed.", error);
        return jsonError("ছবি আপলোড করা যায়নি। পরে আবার চেষ্টা করুন।", 502);
    }

    let uploadResult;
    try {
        uploadResult = await cloudinaryResponse.json();
    } catch (error) {
        console.error("Cloudinary returned an unreadable avatar upload response.", error);
        return jsonError("ছবি আপলোড সেবার উত্তর বোঝা যায়নি।", 502);
    }

    if (
        !cloudinaryResponse.ok ||
        typeof uploadResult.secure_url !== "string" ||
        !uploadResult.secure_url.startsWith("https://")
    ) {
        console.error("Cloudinary rejected an avatar upload.", {
            status: cloudinaryResponse.status,
            error: uploadResult.error?.message,
        });
        return jsonError("ছবি আপলোড করা যায়নি। পরে আবার চেষ্টা করুন।", 502);
    }

    return NextResponse.json({ image: uploadResult.secure_url });
}
