"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/lib/categories";

const unitLabels = {
    kg: "কেজি",
    liter: "লিটার",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
    pc: "পিস",
};

const priceFormatter = new Intl.NumberFormat("bn-BD");
const percentageFormatter = new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
});

function TickerItem({ product }) {
    const direction = product.change?.dir;
    const isUp = direction === "up";
    const isDown = direction === "down";
    const arrow = isUp ? "▲" : isDown ? "▼" : "—";
    const trendClass = isUp
        ? "text-[#d54242]"
        : isDown
          ? "text-[#16834a]"
          : "text-[#69746c]";
    const unit = unitLabels[product.unit] || product.unit;
    const percentage = Number.isFinite(product.change?.pct)
        ? percentageFormatter.format(Math.abs(product.change.pct))
        : "০";

    return (
        <li className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm text-[#34443a]">
            <span aria-hidden="true">{product.image || "🛒"}</span>
            <span className="font-medium">{product.nameBn}</span>
            <span className="text-[#718077]">
                {priceFormatter.format(product.today)} টাকা/{unit}
            </span>
            <span className={`font-semibold ${trendClass}`}>
                {arrow} {percentage}%
            </span>
        </li>
    );
}

const NavBarPage = () => {
    const pathname = usePathname();
    const [tickerItems, setTickerItems] = useState([]);
    const [tickerState, setTickerState] = useState("loading");

    useEffect(() => {
        const controller = new AbortController();

        const loadTickerItems = async () => {
            try {
                const response = await fetch("/api/products", {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Market data request failed: ${response.status}`);
                }

                const products = await response.json();
                if (!Array.isArray(products)) {
                    throw new Error("Market data response was not a product list");
                }

                const visibleProducts = products
                    .filter(
                        (product) =>
                            product &&
                            typeof product.nameBn === "string" &&
                            Number.isFinite(product.today),
                    )
                    .slice(0, 8);

                setTickerItems(visibleProducts);
                setTickerState(visibleProducts.length ? "ready" : "empty");
            } catch (error) {
                if (error.name === "AbortError") {
                    return;
                }

                console.error("Unable to load the market price ticker", error);
                setTickerState("error");
            }
        };

        loadTickerItems();
        return () => controller.abort();
    }, []);

    return (
        <nav aria-label="পণ্য বিভাগ" className="bg-[#fbfdfb]">
            <div className="border-b border-[#e3e9e4]">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <ul className="flex min-h-11 items-center gap-1 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {categories.map((category) => {
                            const isActive = pathname === `/category/${category.slug}`;

                            return (
                                <li key={category.slug} className="shrink-0">
                                    <Link
                                        href={`/category/${category.slug}`}
                                        aria-current={isActive ? "page" : undefined}
                                        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                                            isActive
                                                ? "bg-[#07833f] text-white"
                                                : "text-[#34443a] hover:bg-[#edf4ef]"
                                        }`}
                                    >
                                        <span aria-hidden="true">{category.icon}</span>
                                        {category.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <div
                aria-label="আজকের বাজারদর"
                aria-live={tickerState === "ready" ? "off" : "polite"}
                className="overflow-hidden border-b border-[#e3e9e4] bg-white"
            >
                {tickerState === "loading" && (
                    <p className="mx-auto max-w-6xl px-4 py-2 text-sm text-[#77817a] sm:px-6">
                        আজকের বাজারদর লোড হচ্ছে…
                    </p>
                )}
                {tickerState === "error" && (
                    <p className="mx-auto max-w-6xl px-4 py-2 text-sm text-[#77817a] sm:px-6">
                        আজকের বাজারদর এখন পাওয়া যাচ্ছে না।
                    </p>
                )}
                {tickerState === "empty" && (
                    <p className="mx-auto max-w-6xl px-4 py-2 text-sm text-[#77817a] sm:px-6">
                        আজকের বাজারদরের তথ্য নেই।
                    </p>
                )}
                {tickerState === "ready" && (
                    <div className="market-ticker-viewport py-2.5">
                        <div className="market-ticker-track">
                            {[0, 1].map((copy) => (
                                <ul
                                    key={copy}
                                    aria-hidden={copy === 1 ? "true" : undefined}
                                    className="market-ticker-group"
                                >
                                    {tickerItems.map((product) => (
                                        <TickerItem
                                            key={`${copy}-${product.slug || product.id || product.nameBn}`}
                                            product={product}
                                        />
                                    ))}
                                </ul>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBarPage;
