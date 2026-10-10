import Link from "next/link";
import { connection } from "next/server";
import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/products";

const priceFormatter = new Intl.NumberFormat("bn-BD");

function ProductGrid({ products, emptyMessage }) {
    if (products.length === 0) {
        return <p className="rounded-xl border border-[#e1e9e2] bg-[#fbfdfb] px-4 py-6 text-sm text-[#69766d]">{emptyMessage}</p>;
    }

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
            ))}
        </div>
    );
}

function ChangeSection({ id, title, direction, products }) {
    const isRising = direction === "up";

    return (
        <section aria-labelledby={`${id}-heading`}>
            <h2
                id={`${id}-heading`}
                className="mb-4 flex items-center gap-2 text-xl font-bold text-[#26352b]"
            >
                <span className={isRising ? "text-[#d54242]" : "text-[#16834a]"} aria-hidden="true">
                    {isRising ? "▲" : "▼"}
                </span>
                {title}
            </h2>
            <ProductGrid
                products={products}
                emptyMessage="এই মুহূর্তে দামের পরিবর্তনের তথ্য নেই।"
            />
        </section>
    );
}

function ProductsError() {
    return (
        <div
            role="alert"
            className="rounded-xl border border-[#f0d3d0] bg-[#fff8f7] p-5 text-[#7a332d]"
        >
            <h2 className="font-semibold">পণ্যের তথ্য লোড করা যায়নি</h2>
            <p className="mt-1 text-sm">
                বাজারদরের সার্ভারে সাময়িক সমস্যা হচ্ছে। কিছুক্ষণ পর আবার চেষ্টা করুন।
            </p>
            <Link
                href="/"
                className="mt-3 inline-flex rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#7a332d] ring-1 ring-inset ring-[#e8c9c5] hover:bg-[#fff0ee]"
            >
                আবার চেষ্টা করুন
            </Link>
        </div>
    );
}

export default async function ProductSections() {
    await connection();

    let products;

    try {
        products = await getProducts();
    } catch (error) {
        console.error("Unable to render home page product sections", error);
        return <ProductsError />;
    }

    const risers = products
        .filter((product) => product.change.dir === "up")
        .sort((first, second) => second.change.pct - first.change.pct)
        .slice(0, 6);
    const fallers = products
        .filter((product) => product.change.dir === "down")
        .sort((first, second) => first.change.pct - second.change.pct)
        .slice(0, 6);

    return (
        <div className="mx-auto mt-8 max-w-6xl space-y-8 sm:mt-10 sm:space-y-10">
            <ChangeSection
                id="price-risers"
                title="আজ দাম বেড়েছে"
                direction="up"
                products={risers}
            />

            <ChangeSection
                id="price-fallers"
                title="আজ দাম কমেছে"
                direction="down"
                products={fallers}
            />

            <section id="সব-পণ্য" aria-labelledby="all-products-heading" className="scroll-mt-6">
                <div className="mb-4">
                    <h2
                        id="all-products-heading"
                        className="text-xl font-bold text-[#26352b]"
                    >
                        সব পণ্য
                    </h2>
                    <p className="mt-1 text-sm text-[#77817a]">
                        আজকের বাজারে {priceFormatter.format(products.length)}টি পণ্যের দাম দেখুন
                    </p>
                </div>
                <ProductGrid products={products} emptyMessage="এখনো কোনো পণ্যের তথ্য পাওয়া যায়নি।" />
            </section>
        </div>
    );
}
