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
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e1e9e2] bg-white px-4 py-3 shadow-sm">
                    <p className="flex items-center gap-2 text-sm text-[#69766d]">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-[#e5efe7] text-[#07833f]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="size-4"
                                aria-hidden="true"
                            >
                                <path d="m3 16 4 4 4-4" />
                                <path d="M7 20V4" />
                                <path d="m21 8-4-4-4 4" />
                                <path d="M17 4v16" />
                            </svg>
                        </span>
                        <span className="font-medium text-[#34443a]">সাজান:</span>
                    </p>
                    <div className="relative">
                        <select
                            aria-label="পণ্য সাজান"
                            value={sortOrder}
                            onChange={(event) => setSortOrder(event.target.value)}
                            className="min-h-10 cursor-pointer appearance-none rounded-xl border border-[#d7e0d8] bg-[#f8fbf8] py-2 pl-4 pr-10 text-sm font-semibold text-[#34443a] outline-none transition-all duration-200 hover:border-[#07833f]/40 focus:border-[#07833f] focus:bg-white focus:ring-4 focus:ring-[#07833f]/10"
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
                            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#07833f]"
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedProducts.map((product) => (
                        <ProductCard key={product.slug} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center rounded-3xl border border-dashed border-[#cfe0d3] bg-gradient-to-b from-white to-[#f5faf6] px-6 py-12 text-center shadow-sm">
                    <span className="flex size-16 items-center justify-center rounded-2xl bg-[#e5efe7] text-[#07833f]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="size-8"
                            aria-hidden="true"
                        >
                            <path d="m7.5 4.27 9 5.15" />
                            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                            <path d="m3.3 7 8.7 5 8.7-5" />
                            <path d="M12 22V12" />
                        </svg>
                    </span>
                    <p className="mt-5 text-base font-medium text-[#34443a]">
                        এই বিভাগে এখনো পণ্য যোগ করা হয়নি।
                    </p>
                    <Link
                        href="/"
                        className="group mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#07833f] to-[#0a9a4c] px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#07833f]/30 transition-all duration-200 hover:shadow-md hover:shadow-[#07833f]/40 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07833f]/50 focus-visible:ring-offset-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                            aria-hidden="true"
                        >
                            <path d="M19 12H5" />
                            <path d="m12 19-7-7 7-7" />
                        </svg>
                        হোম পেজে ফিরে যান
                    </Link>
                </div>
            )}
        </>
    );
}