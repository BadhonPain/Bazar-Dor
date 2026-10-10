import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
    return (
        <Suspense fallback={<ProfileLoading />}>
            <ProfileContent />
        </Suspense>
    );
}

async function ProfileContent() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        redirect("/sign-in?reason=auth-required&callbackURL=%2Fprofile");
    }

    const { user } = session;
    const initial = user.name?.trim().charAt(0) || "অ";

    return (
        <div className="min-h-full bg-[#f0f5f0] px-4 py-8 sm:px-6 sm:py-12">
            <section
                aria-labelledby="profile-heading"
                className="mx-auto max-w-2xl rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-6 shadow-sm sm:p-8"
            >
                <p className="text-sm font-medium text-[#07833f]">আমার অ্যাকাউন্ট</p>
                <h1 id="profile-heading" className="mt-1 text-2xl font-bold text-[#1d2b22]">
                    আমার প্রোফাইল
                </h1>

                <div className="mt-7 flex flex-col items-center gap-5 border-b border-[#e7ece7] pb-7 sm:flex-row">
                    {user.image ? (
                        <Image
                            src={user.image}
                            alt={`${user.name || "ব্যবহারকারী"}-এর প্রোফাইল ছবি`}
                            width={96}
                            height={96}
                            unoptimized
                            className="size-24 rounded-full border border-[#e1e9e2] object-cover"
                        />
                    ) : (
                        <span
                            aria-hidden="true"
                            className="flex size-24 items-center justify-center rounded-full bg-[#e5efe7] text-3xl font-semibold text-[#07833f]"
                        >
                            {initial}
                        </span>
                    )}
                    <div className="text-center sm:text-left">
                        <h2 className="text-xl font-semibold text-[#26352b]">
                            {user.name || "নাম যোগ করুন"}
                        </h2>
                        <p className="mt-1 text-sm text-[#69766d]">{user.email}</p>
                    </div>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Link
                        href="/"
                        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#d7e0d8] bg-white px-5 py-2.5 text-sm font-semibold text-[#34443a] transition hover:bg-[#f5f8f5]"
                    >
                        হোম পেজে ফিরুন
                    </Link>
                    <Link
                        href="/profile/update"
                        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#07833f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#066d35]"
                    >
                        প্রোফাইল আপডেট করুন
                    </Link>
                </div>
            </section>
        </div>
    );
}

function ProfileLoading() {
    return (
        <div
            aria-label="প্রোফাইল লোড হচ্ছে"
            aria-busy="true"
            className="min-h-full bg-[#f0f5f0] px-4 py-8 sm:px-6 sm:py-12"
        >
            <div className="mx-auto max-w-2xl animate-pulse rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-6 sm:p-8">
                <div className="h-7 w-40 rounded bg-[#edf2ee]" />
                <div className="mt-7 flex items-center gap-5 border-b border-[#e7ece7] pb-7">
                    <div className="size-24 rounded-full bg-[#edf2ee]" />
                    <div className="space-y-3">
                        <div className="h-5 w-40 rounded bg-[#edf2ee]" />
                        <div className="h-4 w-52 rounded bg-[#edf2ee]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
