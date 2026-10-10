"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/app/components/ProductCard";

const sortOptions = [
    { value: "default", label: "ডিফল্ট" },
    { value: "ascending", label: "দাম: কম থেকে বেশি" },
    { value: "descending", label: "দাম: বেশি থেকে কম" },
];

export default function CategoryProductList({ products }) {
    const [sortOrder, setSortOrder] = useState("default");
    const sortedProducts = useMemo(() => {
        if (sortOrder === "default") {
            return products;
        }

        return [...products].sort((first, second) =>
            sortOrder === "ascending"
                ? first.today - second.today
                : second.today - first.today,
        );
    }, [products, sortOrder]);

    return (
        <>
            {products.length > 0 && (
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-[#69766d]">
                        সাজান:
                    </p>
                    <div className="relative">
                        <select
                            aria-label="পণ্য সাজান"
                            value={sortOrder}
                            onChange={(event) => setSortOrder(event.target.value)}
                            className="min-h-10 appearance-none rounded-lg border border-[#d7e0d8] bg-white py-2 pl-3 pr-9 text-sm font-medium text-[#34443a] outline-none transition focus:border-[#07833f] focus:ring-2 focus:ring-[#07833f]/15"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#69766d]"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.22 7.47a.75.75 0 0 1 1.06 0L10 11.19l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.53a.75.75 0 0 1 0-1.06Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>
            )}

            {sortedProducts.length ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedProducts.map((product) => (
                        <ProductCard key={product.slug} product={product} />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-[#e1e9e2] bg-[#fbfdfb] px-4 py-8 text-center">
                    <p className="text-[#69766d]">এই বিভাগে এখনো পণ্য যোগ করা হয়নি।</p>
                    <Link
                        href="/"
                        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#07833f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#066d35]"
                    >
                        হোম পেজে ফিরে যান
                    </Link>
                </div>
            )}
        </>
    );
}
