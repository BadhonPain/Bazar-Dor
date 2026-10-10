import Link from "next/link";
import { notFound } from "next/navigation";
import { categories } from "@/lib/categories";
import { getProducts } from "@/lib/products";
import CategoryProductList from "./CategoryProductList";

function CategoryLoadError() {
    return (
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <section
                role="alert"
                className="rounded-2xl border border-[#f0d3d0] bg-[#fff8f7] p-6 text-[#7a332d]"
            >
                <h1 className="text-xl font-bold">পণ্যের তথ্য লোড করা যায়নি</h1>
                <p className="mt-2 text-sm">
                    বাজারদরের সার্ভারে সাময়িক সমস্যা হচ্ছে। কিছুক্ষণ পর আবার চেষ্টা করুন।
                </p>
                <Link
                    href="/"
                    className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-[#e8c9c5] hover:bg-[#fff0ee]"
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

    let products;

    try {
        products = await getProducts();
    } catch (error) {
        console.error(`Unable to load products for category "${slug}"`, error);
        return <CategoryLoadError />;
    }

    const categoryProducts = products.filter((product) => product.category === slug);

    return (
        <div className="min-h-full bg-[#f0f5f0] px-4 py-6 sm:px-6 sm:py-8">
            <section
                aria-labelledby="category-heading"
                className="mx-auto max-w-6xl"
            >
                <div className="mb-5">
                    <p className="text-sm font-medium text-[#07833f]">পণ্য বিভাগ</p>
                    <h1
                        id="category-heading"
                        className="mt-1 flex items-center gap-2 text-2xl font-bold text-[#1d2b22] sm:text-3xl"
                    >
                        <span aria-hidden="true">{category.icon}</span>
                        {category.label}
                    </h1>
                    <p className="mt-2 text-sm text-[#69766d]">
                        {categoryProducts.length
                            ? `এই বিভাগে ${new Intl.NumberFormat("bn-BD").format(categoryProducts.length)}টি পণ্যের আজকের বাজারদর`
                            : "এই বিভাগে এখনো কোনো পণ্যের তথ্য পাওয়া যায়নি।"}
                    </p>
                </div>

                <CategoryProductList products={categoryProducts} />
            </section>
        </div>
    );
}
