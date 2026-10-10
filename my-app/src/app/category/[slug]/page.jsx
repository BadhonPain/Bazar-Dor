import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { categories } from "@/lib/categories";
import { getProducts } from "@/lib/products";
import CategoryProductList from "./CategoryProductList";

function CategoryLoadError() {
    return (
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <section
                role="alert"
                className="rounded-3xl border border-[#f0d3d0] bg-[#fff8f7] p-6 text-[#7a332d] shadow-sm sm:p-8"
            >
                <span className="flex size-11 items-center justify-center rounded-xl bg-[#fde8e5] text-[#a3342c]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-5"
                        aria-hidden="true"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4" />
                        <path d="M12 16h.01" />
                    </svg>
                </span>
                <h1 className="mt-4 text-xl font-bold">পণ্যের তথ্য লোড করা যায়নি</h1>
                <p className="mt-2 text-sm">
                    বাজারদরের সার্ভারে সাময়িক সমস্যা হচ্ছে। কিছুক্ষণ পর আবার চেষ্টা করুন।
                </p>
                <Link
                    href="/"
                    className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold ring-1 ring-inset ring-[#e8c9c5] transition-all duration-200 hover:bg-[#fff0ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a3342c]/40"
                >
                    হোম পেজে ফিরে যান
                </Link>
            </section>
        </div>
    );
}

export default async function CategoryPage({ params }) {
    const { slug } = await params;
    const category = categories.find((item) => item.slug === slug);

    if (!category) {
        notFound();
    }

    await connection();

    let products;

    try {
        products = await getProducts();
    } catch (error) {
        console.error(`Unable to load products for category "${slug}"`, error);
        return <CategoryLoadError />;
    }

    const categoryProducts = products.filter((product) => product.category === slug);

    return (
        <div className="min-h-full bg-gradient-to-b from-[#e6f0e8] to-[#f0f5f0] px-4 py-6 sm:px-6 sm:py-10">
            <section
                aria-labelledby="category-heading"
                className="mx-auto max-w-6xl"
            >
                <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#07833f] via-[#0a9a4c] to-[#066d35] px-6 py-7 shadow-[0_10px_40px_-12px_rgba(7,131,63,0.4)] sm:px-8 sm:py-9">
                    <div className="absolute -right-10 -top-12 size-44 rounded-full bg-white/10" />
                    <div className="absolute -bottom-20 left-1/3 size-48 rounded-full bg-white/5" />

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <span
                                aria-hidden="true"
                                className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-4xl backdrop-blur-sm ring-1 ring-inset ring-white/25 sm:size-20 sm:text-5xl"
                            >
                                {category.icon}
                            </span>
                            <div>
                                <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium tracking-wide text-white backdrop-blur-sm">
                                    পণ্য বিভাগ
                                </p>
                                <h1
                                    id="category-heading"
                                    className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl"
                                >
                                    {category.label}
                                </h1>
                            </div>
                        </div>

                        <p className="max-w-xs text-sm leading-relaxed text-white/85 sm:text-right">
                            {categoryProducts.length
                                ? `এই বিভাগে ${new Intl.NumberFormat("bn-BD").format(categoryProducts.length)}টি পণ্যের আজকের বাজারদর`
                                : "এই বিভাগে এখনো কোনো পণ্যের তথ্য পাওয়া যায়নি।"}
                        </p>
                    </div>
                </div>

                <CategoryProductList products={categoryProducts} />
            </section>
        </div>
    );
}