import Link from "next/link";

const priceFormatter = new Intl.NumberFormat("bn-BD");
const percentageFormatter = new Intl.NumberFormat("bn-BD", {
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

const changeStyles = {
    up: {
        arrow: "▲",
        className: "bg-[#fff0f0] text-[#d54242]",
    },
    down: {
        arrow: "▼",
        className: "bg-[#eaf6ed] text-[#16834a]",
    },
    flat: {
        arrow: "—",
        className: "bg-[#eef2ef] text-[#66736a]",
    },
};

export default function ProductCard({ product }) {
    const change = changeStyles[product.change.dir];
    const unit = unitLabels[product.unit] || product.unit;
    const percentage = percentageFormatter.format(Math.abs(product.change.pct));

    return (
        <Link
            href={`/product/${product.slug}`}
            aria-label={`${product.nameBn}, আজকের দাম ${priceFormatter.format(product.today)} টাকা`}
            className="group flex min-h-28 flex-col justify-between rounded-xl border border-[#e1e9e2] bg-[#fbfdfb] p-3 transition hover:-translate-y-0.5 hover:border-[#afd2b8] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#07833f] sm:p-4"
        >
            <div className="flex min-w-0 items-center gap-3">
                <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f0] text-2xl"
                >
                    {product.image}
                </span>
                <span className="min-w-0">
                    <span className="block truncate text-base font-semibold text-[#26352b] group-hover:text-[#07833f]">
                        {product.nameBn}
                    </span>
                    <span className="block text-sm text-[#77817a]">প্রতি {unit}</span>
                </span>
            </div>

            <div className="mt-3 flex items-end justify-between gap-2">
                <span>
                    <span className="block text-xs text-[#77817a]">আজকের দাম</span>
                    <span className="text-base font-bold text-[#26352b]">
                        {priceFormatter.format(product.today)} টাকা
                    </span>
                </span>
                <span
                    className={`mb-0.5 inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${change.className}`}
                    aria-label={`দামের পরিবর্তন ${percentage}%`}
                >
                    <span aria-hidden="true">{change.arrow}</span>
                    {percentage}%
                </span>
            </div>
        </Link>
    );
}
