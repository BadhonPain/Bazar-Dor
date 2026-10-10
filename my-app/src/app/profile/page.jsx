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
    const joinedAt = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("bn-BD", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : null;

    return (
        <div className="min-h-full bg-gradient-to-b from-[#e6f0e8] to-[#f0f5f0] px-4 py-8 sm:px-6 sm:py-14">
            <section
                aria-labelledby="profile-heading"
                className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#e1e9e2] bg-white shadow-[0_10px_40px_-12px_rgba(7,131,63,0.18)]"
            >
                <div className="relative h-32 bg-gradient-to-br from-[#07833f] via-[#0a9a4c] to-[#066d35] sm:h-40">
                    <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10" />
                    <div className="absolute -bottom-16 left-10 size-40 rounded-full bg-white/5" />
                    <p className="absolute left-6 top-5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium tracking-wide text-white backdrop-blur-sm sm:left-8">
                        আমার অ্যাকাউন্ট
                    </p>
                </div>

                <div className="px-6 pb-8 sm:px-8">
                    <div className="relative -mt-12 flex flex-col items-center gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:gap-5">
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt={`${user.name || "ব্যবহারকারী"}-এর প্রোফাইল ছবি`}
                                width={112}
                                height={112}
                                unoptimized
                                className="size-24 rounded-full border-4 border-white object-cover shadow-md sm:size-28"
                            />
                        ) : (
                            <span
                                aria-hidden="true"
                                className="flex size-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[#e5efe7] to-[#cfe3d3] text-4xl font-semibold text-[#07833f] shadow-md sm:size-28"
                            >
                                {initial}
                            </span>
                        )}
                        <div className="pb-1 text-center sm:text-left">
                            <h1
                                id="profile-heading"
                                className="text-2xl font-bold tracking-tight text-[#1d2b22]"
                            >
                                {user.name || "নাম যোগ করুন"}
                            </h1>
                            <p className="mt-0.5 text-sm text-[#69766d]">আমার প্রোফাইল</p>
                        </div>
                    </div>

                    <dl className="mt-8 grid gap-3 sm:grid-cols-2">
                        <div className="flex items-start gap-3 rounded-2xl border border-[#e7ece7] bg-[#f8fbf8] p-4">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e5efe7] text-[#07833f]">
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
                                    <rect width="20" height="16" x="2" y="4" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                            </span>
                            <div className="min-w-0">
                                <dt className="text-xs font-medium text-[#69766d]">ইমেইল</dt>
                                <dd className="mt-0.5 truncate text-sm font-semibold text-[#26352b]">
                                    {user.email}
                                </dd>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-2xl border border-[#e7ece7] bg-[#f8fbf8] p-4">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e5efe7] text-[#07833f]">
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
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <div className="min-w-0">
                                <dt className="text-xs font-medium text-[#69766d]">নাম</dt>
                                <dd className="mt-0.5 truncate text-sm font-semibold text-[#26352b]">
                                    {user.name || "নাম যোগ করুন"}
                                </dd>
                            </div>
                        </div>

                        {joinedAt && (
                            <div className="flex items-start gap-3 rounded-2xl border border-[#e7ece7] bg-[#f8fbf8] p-4 sm:col-span-2">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e5efe7] text-[#07833f]">
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
                                        <path d="M8 2v4" />
                                        <path d="M16 2v4" />
                                        <rect width="18" height="18" x="3" y="4" rx="2" />
                                        <path d="M3 10h18" />
                                    </svg>
                                </span>
                                <div className="min-w-0">
                                    <dt className="text-xs font-medium text-[#69766d]">
                                        যোগদানের তারিখ
                                    </dt>
                                    <dd className="mt-0.5 text-sm font-semibold text-[#26352b]">
                                        {joinedAt}
                                    </dd>
                                </div>
                            </div>
                        )}
                    </dl>

                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#e7ece7] pt-6 sm:flex-row sm:justify-end">
                        <Link
                            href="/"
                            className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#d7e0d8] bg-white px-5 py-2.5 text-sm font-semibold text-[#34443a] transition-all duration-200 hover:border-[#07833f]/40 hover:bg-[#f5f8f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07833f]/40"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                                aria-hidden="true"
                            >
                                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <path d="M9 22V12h6v10" />
                            </svg>
                            হোম পেজে ফিরুন
                        </Link>
                        <Link
                            href="/profile/update"
                            className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#07833f] to-[#0a9a4c] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#07833f]/30 transition-all duration-200 hover:shadow-md hover:shadow-[#07833f]/40 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07833f]/50 focus-visible:ring-offset-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="size-4 transition-transform duration-200 group-hover:rotate-12"
                                aria-hidden="true"
                            >
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>
                            প্রোফাইল আপডেট করুন
                        </Link>
                    </div>
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
            className="min-h-full bg-gradient-to-b from-[#e6f0e8] to-[#f0f5f0] px-4 py-8 sm:px-6 sm:py-14"
        >
            <div className="mx-auto max-w-2xl animate-pulse overflow-hidden rounded-3xl border border-[#e1e9e2] bg-white">
                <div className="h-32 bg-[#e5efe7] sm:h-40" />
                <div className="px-6 pb-8 sm:px-8">
                    <div className="-mt-12 flex flex-col items-center gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:gap-5">
                        <div className="size-24 rounded-full border-4 border-white bg-[#edf2ee] sm:size-28" />
                        <div className="space-y-3 pb-1">
                            <div className="h-6 w-44 rounded bg-[#edf2ee]" />
                            <div className="h-4 w-24 rounded bg-[#edf2ee]" />
                        </div>
                    </div>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        <div className="h-[74px] rounded-2xl bg-[#f3f7f4]" />
                        <div className="h-[74px] rounded-2xl bg-[#f3f7f4]" />
                    </div>
                    <div className="mt-8 flex justify-end gap-3 border-t border-[#e7ece7] pt-6">
                        <div className="h-11 w-32 rounded-xl bg-[#edf2ee]" />
                        <div className="h-11 w-40 rounded-xl bg-[#edf2ee]" />
                    </div>
                </div>
            </div>
        </div>
    );
}