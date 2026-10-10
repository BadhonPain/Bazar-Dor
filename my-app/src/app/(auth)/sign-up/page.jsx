"use client";

import { Eye, EyeSlash } from "@gravity-ui/icons";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { signIn, signUp } from "@/lib/auth-client";

export default function SignUpPage() {
    const router = useRouter();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [socialProvider, setSocialProvider] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const setError = (message) => {
        setErrorMessage(message);
        toast.error(message);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const password = String(formData.get("password") || "");

        try {
            const result = await signUp.email({
                name,
                email,
                password,
                callbackURL: "/",
            });

            if (result.error) {
                setError(
                    result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি। তথ্যগুলো যাচাই করে আবার চেষ্টা করুন।",
                );
                return;
            }

            setSuccessMessage("অ্যাকাউন্ট তৈরি হয়েছে। সাইন ইন পেজে নেওয়া হচ্ছে…");
            window.setTimeout(() => router.replace("/sign-in?notice=registered"), 900);
        } catch (error) {
            console.error("Unable to create account", error);
            setError("অ্যাকাউন্ট তৈরি করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSocialSignIn = async (provider) => {
        setErrorMessage("");
        setSuccessMessage("");
        setSocialProvider(provider);

        try {
            const result = await signIn.social({
                provider,
                callbackURL: "/",
            });

            if (result.error) {
                setError(
                    result.error.message || `${provider} দিয়ে অ্যাকাউন্ট তৈরি করা যায়নি।`,
                );
                setSocialProvider("");
            }
        } catch (error) {
            console.error(`Unable to create an account with ${provider}`, error);
            setError(`${provider} দিয়ে অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।`);
            setSocialProvider("");
        }
    };

    const isBusy = isSubmitting || Boolean(socialProvider);

    return (
        <div className="flex min-h-full items-center justify-center bg-[#f0f5f0] px-4 py-10 sm:px-6">
            <section
                aria-labelledby="sign-up-heading"
                className="w-full max-w-md rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-6 shadow-sm sm:p-8"
            >
                <div className="mb-7 text-center">
                    <span
                        aria-hidden="true"
                        className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#e6f3e9] text-2xl"
                    >
                        🛒
                    </span>
                    <h1 id="sign-up-heading" className="text-2xl font-bold text-[#1d2b22]">
                        নতুন অ্যাকাউন্ট তৈরি করুন
                    </h1>
                    <p className="mt-2 text-sm text-[#69766d]">
                        প্রতিদিনের বাজারদর জানুন সম্পূর্ণ বিনামূল্যে !!
                    </p>
                </div>

                {errorMessage && (
                    <p
                        role="alert"
                        className="mb-5 rounded-lg border border-[#f0d3d0] bg-[#fff8f7] px-3 py-2.5 text-sm text-[#a3342c]"
                    >
                        {errorMessage}
                    </p>
                )}

                {successMessage && (
                    <p
                        role="status"
                        className="mb-5 rounded-lg border border-[#cde5d1] bg-[#eff8f0] px-3 py-2.5 text-sm text-[#176b36]"
                    >
                        {successMessage}
                    </p>
                )}

                <form
                    className="space-y-4"
                    onSubmit={onSubmit}
                    onChange={() => {
                        setErrorMessage("");
                        setSuccessMessage("");
                    }}
                >
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1.5 block text-sm font-medium text-[#34443a]"
                        >
                            নাম
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            placeholder="আপনার নাম লিখুন"
                            minLength={3}
                            maxLength={100}
                            required
                            disabled={isBusy}
                            className="min-h-11 w-full rounded-lg border border-[#d7e0d8] bg-white px-3 py-2 text-base text-[#26352b] outline-none transition placeholder:text-[#9aa49c] focus:border-[#07833f] focus:ring-2 focus:ring-[#07833f]/15 disabled:cursor-not-allowed disabled:bg-[#f3f6f3]"
                        />
                        <p className="mt-1 text-xs text-[#8a958d]">কমপক্ষে ৩ অক্ষর লিখুন</p>
                    </div>

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
                                autoComplete="new-password"
                                placeholder="একটি পাসওয়ার্ড তৈরি করুন"
                                minLength={8}
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
                        <p className="mt-1 text-xs text-[#8a958d]">
                            কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড দিন
                        </p>
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
                        {isSubmitting ? "অ্যাকাউন্ট তৈরি হচ্ছে…" : "অ্যাকাউন্ট তৈরি করুন"}
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
                    আগে থেকেই অ্যাকাউন্ট আছে?{" "}
                    <Link
                        href="/sign-in"
                        className="font-semibold text-[#07833f] underline-offset-4 hover:underline"
                    >
                        সাইন ইন করুন
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
