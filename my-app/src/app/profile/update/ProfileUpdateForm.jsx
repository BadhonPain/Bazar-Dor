"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { updateUser } from "@/lib/auth-client";

const MAX_UPLOAD_SIZE = 4 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ProfileUpdateForm({ user }) {
    const router = useRouter();
    const [name, setName] = useState(user.name || "");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user.image || "");
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(
        () => () => {
            if (previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        },
        [previewUrl],
    );

    const onImageSelected = (event) => {
        const file = event.currentTarget.files?.[0];
        event.currentTarget.value = "";
        setErrorMessage("");

        if (!file) {
            return;
        }

        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            const message = "শুধু JPEG, PNG অথবা WebP ছবি নির্বাচন করুন।";
            setErrorMessage(message);
            toast.error(message);
            return;
        }

        if (file.size === 0 || file.size > MAX_UPLOAD_SIZE) {
            const message = "ছবির আকার ৪ মেগাবাইটের মধ্যে হতে হবে।";
            setErrorMessage(message);
            toast.error(message);
            return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        const trimmedName = name.trim();

        if (trimmedName.length < 2 || trimmedName.length > 100) {
            const message = "নাম ২ থেকে ১০০ অক্ষরের মধ্যে লিখুন।";
            setErrorMessage(message);
            toast.error(message);
            return;
        }

        setErrorMessage("");
        setIsSaving(true);

        try {
            let image = user.image || undefined;

            if (selectedFile) {
                const formData = new FormData();
                formData.set("file", selectedFile);

                const uploadResponse = await fetch("/api/profile/avatar", {
                    method: "POST",
                    body: formData,
                });
                const uploadResult = await uploadResponse.json();

                if (!uploadResponse.ok || typeof uploadResult.image !== "string") {
                    throw new Error(uploadResult.error || "প্রোফাইল ছবি আপলোড করা যায়নি।");
                }

                image = uploadResult.image;
            }

            const result = await updateUser({
                name: trimmedName,
                ...(image ? { image } : {}),
            });

            if (result.error) {
                throw new Error(result.error.message || "প্রোফাইল আপডেট করা যায়নি।");
            }

            toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে।");
            router.replace("/profile");
            router.refresh();
        } catch (error) {
            console.error("Unable to update profile", error);
            const message =
                error instanceof Error
                    ? error.message
                    : "প্রোফাইল আপডেট করা যায়নি। আবার চেষ্টা করুন।";
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-full bg-[#f0f5f0] px-4 py-8 sm:px-6 sm:py-12">
            <section
                aria-labelledby="update-profile-heading"
                className="mx-auto max-w-2xl rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-6 shadow-sm sm:p-8"
            >
                <p className="text-sm font-medium text-[#07833f]">আমার অ্যাকাউন্ট</p>
                <h1
                    id="update-profile-heading"
                    className="mt-1 text-2xl font-bold text-[#1d2b22]"
                >
                    প্রোফাইল তথ্য আপডেট
                </h1>
                <p className="mt-2 text-sm text-[#69766d]">
                    আপনার নাম এবং প্রোফাইল ছবি পরিবর্তন করুন।
                </p>

                {errorMessage && (
                    <p
                        role="alert"
                        className="mt-5 rounded-lg border border-[#f0d3d0] bg-[#fff8f7] px-3 py-2.5 text-sm text-[#a3342c]"
                    >
                        {errorMessage}
                    </p>
                )}

                <form className="mt-6 space-y-6" onSubmit={onSubmit}>
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                        {previewUrl ? (
                            <Image
                                src={previewUrl}
                                alt="প্রোফাইল ছবির প্রিভিউ"
                                width={96}
                                height={96}
                                unoptimized
                                className="size-24 rounded-full border border-[#e1e9e2] object-cover"
                            />
                        ) : (
                            <span
                                aria-hidden="true"
                                className="flex size-24 items-center justify-center rounded-full bg-[#e5efe7] text-3xl font-semibold text-[#07833f]"
                            >
                                {name.trim().charAt(0) || "অ"}
                            </span>
                        )}
                        <div className="text-center sm:text-left">
                            <label
                                htmlFor="profile-image"
                                className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg border border-[#d7e0d8] bg-white px-4 py-2 text-sm font-semibold text-[#34443a] transition hover:bg-[#f5f8f5]"
                            >
                                ছবি নির্বাচন করুন
                            </label>
                            <input
                                id="profile-image"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={onImageSelected}
                                disabled={isSaving}
                                className="sr-only"
                            />
                            <p className="mt-2 text-xs text-[#77817a]">
                                JPEG, PNG বা WebP · সর্বোচ্চ ৪ MB
                            </p>
                            {selectedFile && (
                                <p className="mt-1 max-w-64 truncate text-xs text-[#07833f]">
                                    {selectedFile.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="profile-name"
                            className="mb-1.5 block text-sm font-medium text-[#34443a]"
                        >
                            নাম
                        </label>
                        <input
                            id="profile-name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(event) => {
                                setName(event.target.value);
                                setErrorMessage("");
                            }}
                            minLength={2}
                            maxLength={100}
                            required
                            disabled={isSaving}
                            className="min-h-11 w-full rounded-lg border border-[#d7e0d8] bg-white px-3 py-2 text-base text-[#26352b] outline-none transition focus:border-[#07833f] focus:ring-2 focus:ring-[#07833f]/15 disabled:cursor-not-allowed disabled:bg-[#f3f6f3]"
                        />
                    </div>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/profile"
                            aria-disabled={isSaving}
                            className={`inline-flex min-h-11 items-center justify-center rounded-lg border border-[#d7e0d8] bg-white px-5 py-2.5 text-sm font-semibold text-[#34443a] transition hover:bg-[#f5f8f5] ${
                                isSaving ? "pointer-events-none opacity-60" : ""
                            }`}
                        >
                            বাতিল
                        </Link>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#07833f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#066d35] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSaving && (
                                <span
                                    aria-hidden="true"
                                    className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                                />
                            )}
                            {isSaving ? "আপডেট হচ্ছে…" : "তথ্য আপডেট করুন"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
