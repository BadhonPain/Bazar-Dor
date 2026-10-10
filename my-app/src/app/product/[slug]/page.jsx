import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProducts } from "@/lib/products";

const priceFormatter = new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
});

const unitLabels = {
    kg: "কেজি",
    liter: "লিটার",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
    pc: "পিস",
};

function getMarketSummary(markets) {
    if (
        !Array.isArray(markets) ||
        markets.length === 0 ||
        markets.some(
            (market) =>
                !market ||
                typeof market.market !== "string" ||
                typeof market.division !== "string" ||
                !Number.isFinite(market.min) ||
                !Number.isFinite(market.max),
        )
    ) {
        throw new TypeError("Product market data is missing or invalid.");
    }

    const minimum = Math.min(...markets.map((market) => market.min));
    const maximum = Math.max(...markets.map((market) => market.max));
    const average =
        markets.reduce((sum, market) => sum + (market.min + market.max) / 2, 0) /
        markets.length;

    return { minimum, maximum, average };
}

function ProductLoadError() {
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

export default async function ProductDetailPage({ params }) {
    const { slug } = await params;
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });

    if (!session?.user) {
        const callbackURL = `/product/${encodeURIComponent(slug)}`;
        redirect(`/sign-in?reason=auth-required&callbackURL=${encodeURIComponent(callbackURL)}`);
    }

    let products;

    try {
        products = await getProducts();
    } catch (error) {
        console.error(`Unable to load product detail for slug "${slug}"`, error);
        return <ProductLoadError />;
    }

    const product = products.find((item) => item.slug === slug);

    if (!product) {
        notFound();
    }

    let marketSummary;

    try {
        marketSummary = getMarketSummary(product.markets);
    } catch (error) {
        console.error(`Invalid market data for product "${slug}"`, error);
        return <ProductLoadError />;
    }

    const unit = unitLabels[product.unit] || product.unit;
    const changeStyle =
        product.change.dir === "up"
            ? "bg-[#fff0f0] text-[#d54242]"
            : product.change.dir === "down"
              ? "bg-[#eaf6ed] text-[#16834a]"
              : "bg-[#eef2ef] text-[#66736a]";
    const changeArrow =
        product.change.dir === "up" ? "▲" : product.change.dir === "down" ? "▼" : "—";

    return (
        <div className="min-h-full bg-[#f0f5f0] px-4 py-6 sm:px-6 sm:py-8">
            <div className="mx-auto max-w-6xl">
                <nav aria-label="Breadcrumb" className="mb-5 text-sm text-[#69766d]">
                    <ol className="flex flex-wrap items-center gap-2">
                        <li>
                            <Link href="/" className="hover:text-[#07833f]">
                                হোম
                            </Link>
                        </li>
                        <li aria-hidden="true">/</li>
                        <li className="text-[#69766d]">
                            {product.categoryNameBn}
                        </li>
                        <li aria-hidden="true">/</li>
                        <li aria-current="page" className="font-medium text-[#26352b]">
                            {product.nameBn}
                        </li>
                    </ol>
                </nav>

                <section
                    aria-labelledby="product-heading"
                    className="flex flex-col gap-5 rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7"
                >
                    <div className="flex min-w-0 items-center gap-4">
                        <span
                            aria-hidden="true"
                            className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f0] text-4xl"
                        >
                            {product.image}
                        </span>
                        <div className="min-w-0">
                            <h1
                                id="product-heading"
                                className="text-2xl font-bold text-[#1d2b22] sm:text-3xl"
                            >
                                {product.nameBn}
                            </h1>
                            <p className="mt-1 text-sm text-[#69766d]">
                                {product.categoryNameBn} · প্রতি {unit}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-[#e6f3e9] px-2.5 py-1 text-xs font-medium text-[#07833f]">
                                    {product.categoryIcon} {product.categoryNameBn}
                                </span>
                                <span className="text-xs text-[#69766d]">
                                    বাজারভিত্তিক আজকের দরের সারাংশ
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-4 rounded-xl bg-[#f0f5f0] px-4 py-3 sm:min-w-36 sm:flex-col sm:items-start sm:gap-1">
                        <span className="text-xs text-[#69766d]">আজকের দাম</span>
                        <span className="text-xl font-bold text-[#26352b]">
                            {priceFormatter.format(product.today)}
                        </span>
                        <span className="text-sm text-[#69766d]">টাকা / {unit}</span>
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${changeStyle}`}>
                            {changeArrow} {priceFormatter.format(Math.abs(product.change.pct))}%
                        </span>
                    </div>
                </section>

                <section
                    aria-labelledby="price-summary-heading"
                    className="mt-5 rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-5 sm:p-6"
                >
                    <h2
                        id="price-summary-heading"
                        className="mb-4 text-lg font-bold text-[#26352b]"
                    >
                        দামের সারসংক্ষেপ
                    </h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <PriceSummary
                            label="সর্বনিম্ন দাম"
                            value={marketSummary.minimum}
                            unit={unit}
                            note="বাজারগুলোর মধ্যে সর্বনিম্ন"
                        />
                        <PriceSummary
                            label="সর্বোচ্চ দাম"
                            value={marketSummary.maximum}
                            unit={unit}
                            note="বাজারগুলোর মধ্যে সর্বোচ্চ"
                        />
                        <PriceSummary
                            label="গড় দাম"
                            value={marketSummary.average}
                            unit={unit}
                            note="সব বাজারের গড় দর"
                        />
                    </div>
                    <p className="mt-3 text-xs text-[#77817a]">
                        গড় দাম প্রতিটি বাজারের সর্বনিম্ন ও সর্বোচ্চ দামের মধ্যবিন্দুর গড়।
                    </p>
                </section>

                <section
                    aria-labelledby="market-prices-heading"
                    className="mt-5 rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-5 sm:p-6"
                >
                    <div className="mb-4">
                        <h2
                            id="market-prices-heading"
                            className="text-lg font-bold text-[#26352b]"
                        >
                            বাজারভিত্তিক আজকের দাম
                        </h2>
                        <p className="mt-1 text-sm text-[#77817a]">
                            {priceFormatter.format(product.markets.length)}টি বাজারের দামের তুলনা · প্রতি {unit}
                        </p>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-[#e1e9e2]">
                        <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                            <thead className="bg-[#f0f5f0] text-[#536157]">
                                <tr>
                                    <th scope="col" className="px-4 py-3 font-semibold">বাজার</th>
                                    <th scope="col" className="px-4 py-3 font-semibold">বিভাগ</th>
                                    <th scope="col" className="px-4 py-3 text-right font-semibold">সর্বনিম্ন</th>
                                    <th scope="col" className="px-4 py-3 text-right font-semibold">সর্বোচ্চ</th>
                                    <th scope="col" className="px-4 py-3 text-right font-semibold">গড়</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e7ece7]">
                                {product.markets.map((market) => (
                                    <tr key={`${market.division}-${market.market}`} className="text-[#34443a]">
                                        <th scope="row" className="px-4 py-3 font-medium">
                                            {market.market}
                                        </th>
                                        <td className="px-4 py-3 text-[#69766d]">
                                            {market.division}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {priceFormatter.format(market.min)} টাকা
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {priceFormatter.format(market.max)} টাকা
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold">
                                            {priceFormatter.format((market.min + market.max) / 2)} টাকা
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}

function PriceSummary({ label, value, unit, note }) {
    return (
        <div className="rounded-xl border border-[#e1e9e2] bg-white p-4">
            <p className="text-sm text-[#69766d]">{label}</p>
            <p className="mt-1 text-xl font-bold text-[#07833f]">
                {priceFormatter.format(value)}{" "}
                <span className="text-sm font-medium text-[#536157]">টাকা / {unit}</span>
            </p>
            <p className="mt-1 text-xs text-[#77817a]">{note}</p>
        </div>
    );
}
