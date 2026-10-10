"use client";

import { Eye, EyeSlash } from "@gravity-ui/icons";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";

export default function SignInPage() {
    return (
        <Suspense fallback={<div className="min-h-full bg-[#f0f5f0]" />}>
            <SignInForm />
        </Suspense>
    );
}

function SignInForm() {
    const searchParams = useSearchParams();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [socialProvider, setSocialProvider] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const requestedCallback = searchParams.get("callbackURL");
    const callbackURL =
        requestedCallback?.startsWith("/") &&
        !requestedCallback.startsWith("//") &&
        !requestedCallback.includes("\\")
            ? requestedCallback
            : "/";
    const requiresSignIn = searchParams.get("reason") === "auth-required";

    const onSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") || "").trim();
        const password = String(formData.get("password") || "");

        try {
            const result = await signIn.email({
                email,
                password,
                rememberMe: true,
                callbackURL,
            });

            if (result.error) {
                setErrorMessage(
                    result.error.message || "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।",
                );
            }
        } catch (error) {
            console.error("Unable to sign in", error);
            setErrorMessage("সাইন ইন করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSocialSignIn = async (provider) => {
        setErrorMessage("");
        setSocialProvider(provider);

        try {
            const result = await signIn.social({
                provider,
                callbackURL,
            });

            if (result.error) {
                setErrorMessage(
                    result.error.message || `${provider} দিয়ে সাইন ইন শুরু করা যায়নি।`,
                );
                setSocialProvider("");
            }
        } catch (error) {
            console.error(`Unable to sign in with ${provider}`, error);
            setErrorMessage(`${provider} দিয়ে সাইন ইন করা যায়নি। আবার চেষ্টা করুন।`);
            setSocialProvider("");
        }
    };

    const isBusy = isSubmitting || Boolean(socialProvider);

    return (
        <div className="flex min-h-full items-center justify-center bg-[#f0f5f0] px-4 py-10 sm:px-6">
            <section
                aria-labelledby="sign-in-heading"
                className="w-full max-w-md rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-6 shadow-sm sm:p-8"
            >
                <div className="mb-7 text-center">
                    <span
                        aria-hidden="true"
                        className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#e6f3e9] text-2xl"
                    >
                        🛒
                    </span>
                    <h1 id="sign-in-heading" className="text-2xl font-bold text-[#1d2b22]">
                        স্বাগতম
                    </h1>
                    <p className="mt-2 text-sm text-[#69766d]">
                        বাজার দর অ্যাকাউন্টে সাইন ইন করুন
                    </p>
                </div>

                {requiresSignIn && (
                    <p className="mb-5 rounded-lg border border-[#e8d9ad] bg-[#fff9e9] px-3 py-2.5 text-sm text-[#705a20]">
                        পণ্যের বিস্তারিত দেখতে আগে আপনার অ্যাকাউন্টে সাইন ইন করুন।
                    </p>
                )}

                {errorMessage && (
                    <p
                        role="alert"
                        className="mb-5 rounded-lg border border-[#f0d3d0] bg-[#fff8f7] px-3 py-2.5 text-sm text-[#a3342c]"
                    >
                        {errorMessage}
                    </p>
                )}

                <form className="space-y-4" onSubmit={onSubmit} onChange={() => setErrorMessage("")}>
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1.5 block text-sm font-medium text-[#34443a]"
                        >
                            ইমেইল
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            autoCapitalize="none"
                            placeholder="আপনার ইমেইল লিখুন"
                            required
                            disabled={isBusy}
                            className="min-h-11 w-full rounded-lg border border-[#d7e0d8] bg-white px-3 py-2 text-base text-[#26352b] outline-none transition placeholder:text-[#9aa49c] focus:border-[#07833f] focus:ring-2 focus:ring-[#07833f]/15 disabled:cursor-not-allowed disabled:bg-[#f3f6f3]"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1.5 block text-sm font-medium text-[#34443a]"
                        >
                            পাসওয়ার্ড
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={isPasswordVisible ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="আপনার পাসওয়ার্ড লিখুন"
                                required
                                disabled={isBusy}
                                className="min-h-11 w-full rounded-lg border border-[#d7e0d8] bg-white px-3 py-2 pe-12 text-base text-[#26352b] outline-none transition placeholder:text-[#9aa49c] focus:border-[#07833f] focus:ring-2 focus:ring-[#07833f]/15 disabled:cursor-not-allowed disabled:bg-[#f3f6f3]"
                            />
                            <button
                                type="button"
                                aria-label={isPasswordVisible ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
                                aria-pressed={isPasswordVisible}
                                disabled={isBusy}
                                onClick={() => setIsPasswordVisible((visible) => !visible)}
                                className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-[#69766d] hover:text-[#26352b] disabled:cursor-not-allowed"
                            >
                                {isPasswordVisible ? (
                                    <EyeSlash aria-hidden="true" className="size-4" />
                                ) : (
                                    <Eye aria-hidden="true" className="size-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isBusy}
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#07833f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#066d35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#07833f] disabled:cursor-not-allowed disabled:opacity-65"
                    >
                        {isSubmitting && (
                            <span
                                aria-hidden="true"
                                className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                            />
                        )}
                        {isSubmitting ? "সাইন ইন হচ্ছে…" : "সাইন ইন"}
                    </button>
                </form>

                <div className="my-5 flex items-center gap-3 text-xs text-[#8a958d]">
                    <span className="h-px flex-1 bg-[#e5ebe5]" />
                    অথবা
                    <span className="h-px flex-1 bg-[#e5ebe5]" />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={() => handleSocialSignIn("google")}
                        disabled={isBusy}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#d7e0d8] bg-white px-3 py-2 text-sm font-medium text-[#34443a] transition hover:bg-[#f5f8f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#07833f] disabled:cursor-not-allowed disabled:opacity-65"
                    >
                        <Icon aria-hidden="true" icon="devicon:google" className="size-4" />
                        {socialProvider === "google" ? "সংযোগ হচ্ছে…" : "Google"}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSocialSignIn("github")}
                        disabled={isBusy}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#d7e0d8] bg-white px-3 py-2 text-sm font-medium text-[#34443a] transition hover:bg-[#f5f8f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#07833f] disabled:cursor-not-allowed disabled:opacity-65"
                    >
                        <Icon aria-hidden="true" icon="mdi:github" className="size-4" />
                        {socialProvider === "github" ? "সংযোগ হচ্ছে…" : "GitHub"}
                    </button>
                </div>

                <p className="mt-6 text-center text-sm text-[#69766d]">
                    নতুন এখানে?{" "}
                    <Link
                        href="/sign-up"
                        className="font-semibold text-[#07833f] underline-offset-4 hover:underline"
                    >
                        অ্যাকাউন্ট তৈরি করুন
                    </Link>
                </p>
                <p className="mt-4 text-center text-sm">
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2 rounded-full border border-[#07833f]/20 bg-[#07833f]/5 px-4 py-2 font-medium text-[#07833f] transition-all duration-200 hover:border-[#07833f] hover:bg-[#07833f] hover:text-white hover:shadow-md"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
                        >
                            <path d="M19 12H5" />
                            <path d="m12 19-7-7 7-7" />
                        </svg>
                        হোম পেজে ফিরে যান
                    </Link>
                </p>
            </section>
        </div>
    );
}
