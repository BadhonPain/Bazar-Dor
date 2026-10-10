import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-full items-center justify-center bg-[#f0f5f0] px-4 py-16">
            <section
                aria-labelledby="not-found-heading"
                className="w-full max-w-lg rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-8 text-center shadow-sm"
            >
                <p className="text-5xl font-bold text-[#07833f]">৪০৪</p>
                <h1 id="not-found-heading" className="mt-3 text-2xl font-bold text-[#1d2b22]">
                    পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
                </h1>
                <p className="mt-2 text-[#69766d]">
                    পণ্যটি হয়তো সরানো হয়েছে, অথবা ঠিকানাটি সঠিক নয়।
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#07833f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#066d35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#07833f]"
                >
                    হোম পেজে ফিরে যান
                </Link>
            </section>
        </div>
    );
}
