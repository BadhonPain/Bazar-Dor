"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { updateUser } from "@/lib/auth-client";

const MAX_UPLOAD_SIZE = 4 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ProfileUpdateForm({ user }) {
    const router = useRouter();
    const [name, setName] = useState(user.name || "");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user.image || "");
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(
        () => () => {
            if (previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        },
        [previewUrl],
    );

    const onImageSelected = (event) => {
        const file = event.currentTarget.files?.[0];
        event.currentTarget.value = "";
        setErrorMessage("");

        if (!file) {
            return;
        }

        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            const message = "শুধু JPEG, PNG অথবা WebP ছবি নির্বাচন করুন।";
            setErrorMessage(message);
            toast.error(message);
            return;
        }

        if (file.size === 0 || file.size > MAX_UPLOAD_SIZE) {
            const message = "ছবির আকার ৪ মেগাবাইটের মধ্যে হতে হবে।";
            setErrorMessage(message);
            toast.error(message);
            return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        const trimmedName = name.trim();

        if (trimmedName.length < 2 || trimmedName.length > 100) {
            const message = "নাম ২ থেকে ১০০ অক্ষরের মধ্যে লিখুন।";
            setErrorMessage(message);
            toast.error(message);
            return;
        }

        setErrorMessage("");
        setIsSaving(true);

        try {
            let image = user.image || undefined;

            if (selectedFile) {
                const formData = new FormData();
                formData.set("file", selectedFile);

                const uploadResponse = await fetch("/api/profile/avatar", {
                    method: "POST",
                    body: formData,
                });
                const uploadResult = await uploadResponse.json();

                if (!uploadResponse.ok || typeof uploadResult.image !== "string") {
                    throw new Error(uploadResult.error || "প্রোফাইল ছবি আপলোড করা যায়নি।");
                }

                image = uploadResult.image;
            }

            const result = await updateUser({
                name: trimmedName,
                ...(image ? { image } : {}),
            });

            if (result.error) {
                throw new Error(result.error.message || "প্রোফাইল আপডেট করা যায়নি।");
            }

            toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে।");
            router.replace("/profile");
            router.refresh();
        } catch (error) {
            console.error("Unable to update profile", error);
            const message =
                error instanceof Error
                    ? error.message
                    : "প্রোফাইল আপডেট করা যায়নি। আবার চেষ্টা করুন।";
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-full bg-gradient-to-b from-[#e6f0e8] to-[#f0f5f0] px-4 py-8 sm:px-6 sm:py-14">
            <section
                aria-labelledby="update-profile-heading"
                className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#e1e9e2] bg-white shadow-[0_10px_40px_-12px_rgba(7,131,63,0.18)]"
            >
                <div className="relative h-28 bg-gradient-to-br from-[#07833f] via-[#0a9a4c] to-[#066d35] sm:h-32">
                    <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10" />
                    <div className="absolute -bottom-16 left-10 size-40 rounded-full bg-white/5" />
                    <p className="absolute left-6 top-5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium tracking-wide text-white backdrop-blur-sm sm:left-8">
                        আমার অ্যাকাউন্ট
                    </p>
                </div>

                <div className="px-6 pb-8 sm:px-8">
                    <div className="relative -mt-12 flex flex-col items-center gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:gap-5">
                        {previewUrl ? (
                            <Image
                                src={previewUrl}
                                alt="প্রোফাইল ছবির প্রিভিউ"
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
                                {name.trim().charAt(0) || "অ"}
                            </span>
                        )}
                        <div className="pb-1 text-center sm:text-left">
                            <label
                                htmlFor="profile-image"
                                className={`inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#d7e0d8] bg-white px-4 py-2 text-sm font-semibold text-[#34443a] transition-all duration-200 hover:border-[#07833f]/40 hover:bg-[#f5f8f5] focus-within:ring-2 focus-within:ring-[#07833f]/40 ${isSaving ? "pointer-events-none opacity-60" : ""
                                    }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="size-4 text-[#07833f]"
                                    aria-hidden="true"
                                >
                                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z" />
                                    <circle cx="12" cy="13" r="3" />
                                </svg>
                                ছবি নির্বাচন করুন
                            </label>
                            <input
                                id="profile-image"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={onImageSelected}
                                disabled={isSaving}
                                className="sr-only"
                            />
                            <p className="mt-2 text-xs text-[#77817a]">
                                JPEG, PNG বা WebP · সর্বোচ্চ ৪ MB
                            </p>
                            {selectedFile && (
                                <p className="mt-1 max-w-64 truncate text-xs font-medium text-[#07833f]">
                                    {selectedFile.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-7 text-center sm:text-left">
                        <h1
                            id="update-profile-heading"
                            className="text-2xl font-bold tracking-tight text-[#1d2b22]"
                        >
                            প্রোফাইল তথ্য আপডেট
                        </h1>
                        <p className="mt-1 text-sm text-[#69766d]">
                            আপনার নাম এবং প্রোফাইল ছবি পরিবর্তন করুন।
                        </p>
                    </div>

                    {errorMessage && (
                        <p
                            role="alert"
                            className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#f0d3d0] bg-[#fff8f7] px-4 py-3 text-sm text-[#a3342c]"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mt-0.5 size-4 shrink-0"
                                aria-hidden="true"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 8v4" />
                                <path d="M12 16h.01" />
                            </svg>
                            {errorMessage}
                        </p>
                    )}

                    <form className="mt-6 space-y-6" onSubmit={onSubmit}>
                        <div>
                            <label
                                htmlFor="profile-name"
                                className="mb-1.5 block text-sm font-medium text-[#34443a]"
                            >
                                নাম
                            </label>
                            <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[#69766d]">
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
                                <input
                                    id="profile-name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    value={name}
                                    onChange={(event) => {
                                        setName(event.target.value);
                                        setErrorMessage("");
                                    }}
                                    minLength={2}
                                    maxLength={100}
                                    required
                                    disabled={isSaving}
                                    className="min-h-12 w-full rounded-xl border border-[#d7e0d8] bg-[#f8fbf8] py-2 pl-11 pr-3 text-base text-[#26352b] outline-none transition-all duration-200 placeholder:text-[#9aa59d] focus:border-[#07833f] focus:bg-white focus:ring-4 focus:ring-[#07833f]/10 disabled:cursor-not-allowed disabled:bg-[#f3f6f3] disabled:opacity-70"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-[#e7ece7] pt-6 sm:flex-row sm:justify-end">
                            <Link
                                href="/profile"
                                aria-disabled={isSaving}
                                className={`inline-flex min-h-11 items-center justify-center rounded-xl border border-[#d7e0d8] bg-white px-5 py-2.5 text-sm font-semibold text-[#34443a] transition-all duration-200 hover:border-[#07833f]/40 hover:bg-[#f5f8f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07833f]/40 ${isSaving ? "pointer-events-none opacity-60" : ""
                                    }`}
                            >
                                বাতিল
                            </Link>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#07833f] to-[#0a9a4c] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#07833f]/30 transition-all duration-200 hover:shadow-md hover:shadow-[#07833f]/40 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07833f]/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
                            >
                                {isSaving && (
                                    <span
                                        aria-hidden="true"
                                        className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                                    />
                                )}
                                {isSaving ? "আপডেট হচ্ছে…" : "তথ্য আপডেট করুন"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}