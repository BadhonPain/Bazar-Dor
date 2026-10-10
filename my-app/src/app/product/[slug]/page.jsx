import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
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

export default async function ProductDetailPage({ params }) {
    const { slug } = await params;
    await connection();

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

    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });

    if (!session?.user) {
        const callbackURL = `/product/${encodeURIComponent(slug)}`;
        redirect(
            `/sign-in?reason=auth-required&callbackURL=${encodeURIComponent(callbackURL)}`,
        );
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
            ? "bg-[#fff0f0] text-[#d54242] ring-[#f6cfcf]"
            : product.change.dir === "down"
              ? "bg-[#eaf6ed] text-[#16834a] ring-[#c6e5cf]"
              : "bg-[#eef2ef] text-[#66736a] ring-[#dbe2dc]";
    const changeArrow =
        product.change.dir === "up" ? "▲" : product.change.dir === "down" ? "▼" : "—";

    return (
        <div className="min-h-full bg-gradient-to-b from-[#e6f0e8] to-[#f0f5f0] px-4 py-6 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-6xl">
                <nav aria-label="Breadcrumb" className="mb-5 text-sm text-[#69766d]">
                    <ol className="flex flex-wrap items-center gap-2">
                        <li>
                            <Link
                                href="/"
                                className="rounded-md transition-colors duration-200 hover:text-[#07833f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07833f]/40"
                            >
                                হোম
                            </Link>
                        </li>
                        <li aria-hidden="true" className="text-[#aab4ac]">/</li>
                        <li className="text-[#69766d]">{product.categoryNameBn}</li>
                        <li aria-hidden="true" className="text-[#aab4ac]">/</li>
                        <li aria-current="page" className="font-semibold text-[#26352b]">
                            {product.nameBn}
                        </li>
                    </ol>
                </nav>

                <section
                    aria-labelledby="product-heading"
                    className="relative overflow-hidden rounded-3xl border border-[#e1e9e2] bg-white shadow-[0_10px_40px_-12px_rgba(7,131,63,0.18)]"
                >
                    <div className="relative h-24 bg-gradient-to-br from-[#07833f] via-[#0a9a4c] to-[#066d35] sm:h-28">
                        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10" />
                        <div className="absolute -bottom-16 left-10 size-40 rounded-full bg-white/5" />
                        <p className="absolute left-5 top-4 rounded-full bg-white/15 px-3 py-1 text-xs font-medium tracking-wide text-white backdrop-blur-sm sm:left-7">
                            {product.categoryIcon} {product.categoryNameBn}
                        </p>
                    </div>

                    <div className="relative flex flex-col gap-5 px-5 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-7 sm:pb-7">
                        <div className="-mt-10 flex min-w-0 flex-col items-start gap-4 sm:-mt-12 sm:flex-row sm:items-end">
                            <span
                                aria-hidden="true"
                                className="flex size-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-[#f0f5f0] to-[#dcebdf] text-5xl shadow-md sm:size-24"
                            >
                                {product.image}
                            </span>
                            <div className="min-w-0 pb-1">
                                <h1
                                    id="product-heading"
                                    className="text-2xl font-bold tracking-tight text-[#1d2b22] sm:text-3xl"
                                >
                                    {product.nameBn}
                                </h1>
                                <p className="mt-1 text-sm text-[#69766d]">
                                    {product.categoryNameBn} · প্রতি {unit}
                                </p>
                                <p className="mt-1 text-xs text-[#77817a]">
                                    বাজারভিত্তিক আজকের দরের সারাংশ
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center justify-between gap-4 rounded-2xl border border-[#e1e9e2] bg-gradient-to-br from-[#f8fbf8] to-[#eef5ef] px-5 py-4 sm:min-w-44 sm:flex-col sm:items-start sm:gap-1.5">
                            <span className="text-xs font-medium text-[#69766d]">আজকের দাম</span>
                            <span className="text-2xl font-bold tracking-tight text-[#1d2b22]">
                                {priceFormatter.format(product.today)}
                                <span className="ml-1 text-sm font-medium text-[#536157]">
                                    টাকা / {unit}
                                </span>
                            </span>
                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${changeStyle}`}
                            >
                                {changeArrow} {priceFormatter.format(Math.abs(product.change.pct))}%
                            </span>
                        </div>
                    </div>
                </section>

                <section
                    aria-labelledby="price-summary-heading"
                    className="mt-6 rounded-3xl border border-[#e1e9e2] bg-white p-5 shadow-sm sm:p-7"
                >
                    <h2
                        id="price-summary-heading"
                        className="mb-5 flex items-center gap-2.5 text-lg font-bold text-[#26352b]"
                    >
                        <span className="h-5 w-1 rounded-full bg-[#07833f]" aria-hidden="true" />
                        দামের সারসংক্ষেপ
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <PriceSummary
                            label="সর্বনিম্ন দাম"
                            value={marketSummary.minimum}
                            unit={unit}
                            note="বাজারগুলোর মধ্যে সর্বনিম্ন"
                            tone="down"
                        />
                        <PriceSummary
                            label="সর্বোচ্চ দাম"
                            value={marketSummary.maximum}
                            unit={unit}
                            note="বাজারগুলোর মধ্যে সর্বোচ্চ"
                            tone="up"
                        />
                        <PriceSummary
                            label="গড় দাম"
                            value={marketSummary.average}
                            unit={unit}
                            note="সব বাজারের গড় দর"
                            tone="avg"
                        />
                    </div>
                    <p className="mt-4 text-xs text-[#77817a]">
                        গড় দাম প্রতিটি বাজারের সর্বনিম্ন ও সর্বোচ্চ দামের মধ্যবিন্দুর গড়।
                    </p>
                </section>

                <section
                    aria-labelledby="market-prices-heading"
                    className="mt-6 rounded-3xl border border-[#e1e9e2] bg-white p-5 shadow-sm sm:p-7"
                >
                    <div className="mb-5">
                        <h2
                            id="market-prices-heading"
                            className="flex items-center gap-2.5 text-lg font-bold text-[#26352b]"
                        >
                            <span className="h-5 w-1 rounded-full bg-[#07833f]" aria-hidden="true" />
                            বাজারভিত্তিক আজকের দাম
                        </h2>
                        <p className="mt-1.5 text-sm text-[#77817a]">
                            {priceFormatter.format(product.markets.length)}টি বাজারের দামের তুলনা · প্রতি {unit}
                        </p>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-[#e1e9e2]">
                        <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                            <thead className="bg-gradient-to-r from-[#eef5ef] to-[#e6f0e8] text-[#3f4f44]">
                                <tr>
                                    <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide">বাজার</th>
                                    <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide">বিভাগ</th>
                                    <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide">সর্বনিম্ন</th>
                                    <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide">সর্বোচ্চ</th>
                                    <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide">গড়</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e7ece7] bg-white">
                                {product.markets.map((market) => (
                                    <tr
                                        key={`${market.division}-${market.market}`}
                                        className="text-[#34443a] transition-colors duration-150 even:bg-[#fafcfa] hover:bg-[#f0f7f1]"
                                    >
                                        <th scope="row" className="px-5 py-3.5 font-semibold text-[#26352b]">
                                            {market.market}
                                        </th>
                                        <td className="px-5 py-3.5">
                                            <span className="inline-flex rounded-full bg-[#eef5ef] px-2.5 py-0.5 text-xs font-medium text-[#536157]">
                                                {market.division}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right tabular-nums">
                                            {priceFormatter.format(market.min)} টাকা
                                        </td>
                                        <td className="px-5 py-3.5 text-right tabular-nums">
                                            {priceFormatter.format(market.max)} টাকা
                                        </td>
                                        <td className="px-5 py-3.5 text-right font-bold tabular-nums text-[#07833f]">
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

const summaryTones = {
    down: {
        card: "border-[#c6e5cf] bg-gradient-to-br from-[#f3fbf5] to-white",
        icon: "bg-[#e1f3e6] text-[#16834a]",
        value: "text-[#16834a]",
        path: "m6 9 6 6 6-6",
    },
    up: {
        card: "border-[#f6cfcf] bg-gradient-to-br from-[#fff7f7] to-white",
        icon: "bg-[#fde8e8] text-[#d54242]",
        value: "text-[#d54242]",
        path: "m18 15-6-6-6 6",
    },
    avg: {
        card: "border-[#e1e9e2] bg-gradient-to-br from-[#f8fbf8] to-white",
        icon: "bg-[#e5efe7] text-[#07833f]",
        value: "text-[#07833f]",
        path: "M5 12h14",
    },
};

function PriceSummary({ label, value, unit, note, tone = "avg" }) {
    const style = summaryTones[tone];

    return (
        <div
            className={`rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${style.card}`}
        >
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#69766d]">{label}</p>
                <span
                    className={`flex size-8 items-center justify-center rounded-lg ${style.icon}`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-4"
                        aria-hidden="true"
                    >
                        <path d={style.path} />
                    </svg>
                </span>
            </div>
            <p className={`mt-3 text-2xl font-bold tracking-tight ${style.value}`}>
                {priceFormatter.format(value)}{" "}
                <span className="text-sm font-medium text-[#536157]">টাকা / {unit}</span>
            </p>
            <p className="mt-1.5 text-xs text-[#77817a]">{note}</p>
        </div>
    );
}