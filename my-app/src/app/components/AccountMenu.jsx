"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { signOut, useSession } from "@/lib/auth-client";

const AccountMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [signOutError, setSignOutError] = useState("");
    const [signOutMessage, setSignOutMessage] = useState("");
    const [isSigningOut, setIsSigningOut] = useState(false);
    const { data: session, isPending } = useSession();

    const handleSignOut = async () => {
        setSignOutError("");
        setIsSigningOut(true);

        try {
            const result = await signOut();

            if (result?.error) {
                const message = result.error.message || "সাইন আউট করা যায়নি। আবার চেষ্টা করুন।";
                setSignOutError(message);
                toast.error(message);
                return;
            }

            setSignOutMessage("সফলভাবে সাইন আউট হয়েছে।");
            toast.success("সফলভাবে সাইন আউট হয়েছে।");
            setIsMenuOpen(false);
        } catch (error) {
            console.error("Unable to sign out", error);
            const message = "সাইন আউট করা যায়নি। আবার চেষ্টা করুন।";
            setSignOutError(message);
            toast.error(message);
        } finally {
            setIsSigningOut(false);
        }
    };

    if (isPending) {
        return (
            <span
                aria-label="অ্যাকাউন্ট লোড হচ্ছে"
                className="size-9 animate-pulse rounded-full bg-[#edf2ee]"
            />
        );
    }

    if (!session?.user) {
        return (
            <>
                <div className="flex items-center gap-2">
                    <Link
                        href="/sign-in"
                        className="rounded-lg px-3 py-2 text-sm font-medium text-[#34443a] transition hover:bg-[#edf4ef]"
                    >
                        সাইন ইন
                    </Link>
                    <Link
                        href="/sign-up"
                        className="rounded-lg bg-[#07833f] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#066d35] sm:px-4"
                    >
                        সাইন আপ
                    </Link>
                </div>
                {signOutMessage && (
                    <span role="status" className="sr-only">
                        {signOutMessage}
                    </span>
                )}
            </>
        );
    }

    const userName = session.user.name || "আমার অ্যাকাউন্ট";
    const initial = userName.trim().charAt(0) || "অ";

    return (
        <div className="relative">
            <button
                type="button"
                aria-expanded={isMenuOpen}
                aria-controls="account-menu"
                onClick={() => {
                    setSignOutError("");
                    setIsMenuOpen((open) => !open);
                }}
                className="flex max-w-[180px] items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[#26352b] transition hover:bg-[#edf4ef] sm:px-3"
            >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e5efe7] text-sm font-semibold text-[#07833f]">
                    {initial}
                </span>
                <span className="max-w-[105px] truncate">{userName}</span>
                <svg
                    aria-hidden="true"
                    className={`size-4 shrink-0 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.22 7.47a.75.75 0 0 1 1.06 0L10 11.19l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.53a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
            {isMenuOpen && (
                <div
                    id="account-menu"
                    className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-[#e1e8e2] bg-white p-2 shadow-lg"
                >
                    <div className="border-b border-[#edf1ed] px-3 py-2">
                        <p className="truncate text-sm font-semibold text-[#26352b]">{userName}</p>
                        {session.user.email && (
                            <p className="truncate text-xs text-[#77817a]">{session.user.email}</p>
                        )}
                    </div>
                    <Link
                        href="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="mt-1 block rounded-lg px-3 py-2 text-sm text-[#34443a] hover:bg-[#f1f6f2]"
                    >
                        আমার প্রোফাইল
                    </Link>
                    {signOutError && (
                        <p role="alert" className="px-3 py-2 text-sm text-red-700">
                            {signOutError}
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSigningOut ? "সাইন আউট হচ্ছে…" : "সাইন আউট"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AccountMenu;
