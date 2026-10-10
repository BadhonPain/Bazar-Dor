"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthToasts() {
    const searchParams = useSearchParams();
    const lastToast = useRef("");

    useEffect(() => {
        const reason = searchParams.get("reason");
        const notice = searchParams.get("notice");
        const message =
            reason === "auth-required"
                ? "পণ্যের বিস্তারিত দেখতে সাইন ইন করুন।"
                : notice === "registered"
                  ? "অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।"
                  : notice === "signed-in"
                    ? "সফলভাবে সাইন ইন হয়েছে।"
                    : "";
        const key = `${reason || ""}:${notice || ""}`;

        if (message && key !== lastToast.current) {
            if (reason === "auth-required") {
                toast(message);
            } else {
                toast.success(message);
            }
            lastToast.current = key;
        }
    }, [searchParams]);

    return null;
}
