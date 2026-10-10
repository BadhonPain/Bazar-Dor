import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-full bg-[#f0f5f0] px-4 py-5 sm:px-6 sm:py-8">
      <section
        aria-labelledby="hero-heading"
        className="mx-auto grid max-w-6xl items-center gap-6 rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] px-5 py-7 sm:px-8 md:grid-cols-[minmax(0,1fr)_280px] md:gap-10 md:px-10 md:py-9"
      >
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex rounded-full bg-[#e6f3e9] px-3 py-1 text-sm font-medium text-[#07833f]">
            প্রতিদিনের বাজারদর, এক জায়গায়
          </p>
          <h1
            id="hero-heading"
            className="text-3xl leading-tight font-bold tracking-tight text-[#1d2b22] sm:text-4xl lg:text-[2.75rem]"
          >
            আজকের বাজারের দাম এক নজরে
          </h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-[#69766d] sm:text-lg">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
            বিস্তারিত সহজে, প্রতিদিন এক নজরে।
          </p>
          <Link
            href="#সব-পণ্য"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#07833f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#066d35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#07833f] sm:text-base"
          >
            সব পণ্য দেখুন
          </Link>
        </div>

        <div className="flex items-center justify-center md:justify-end">
          <Image
            src="/bazar-hero.png"
            alt="তাজা সবজি ও ফলের বাজারের ঝুড়ি"
            width={300}
            height={250}
            priority
            sizes="(max-width: 767px) 220px, 280px"
            className="h-auto w-52 sm:w-60 md:w-70"
          />
        </div>
      </section>
    </div>
  );
}
