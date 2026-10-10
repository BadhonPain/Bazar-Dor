import { connection } from "next/server";
import { getProducts } from "@/lib/products";

export async function GET() {
    await connection();

    try {
        return Response.json(await getProducts());
    } catch (error) {
        console.error("Unable to serve market product data", error);
        return Response.json(
            { error: "পণ্যের তথ্য এখন পাওয়া যাচ্ছে না।" },
            { status: 503, headers: { "Cache-Control": "no-store" } },
        );
    }
}
