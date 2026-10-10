import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ProfileUpdateForm from "./ProfileUpdateForm";

export default async function UpdateProfilePage() {
    return (
        <Suspense fallback={<ProfileUpdateLoading />}>
            <ProfileUpdateContent />
        </Suspense>
    );
}

async function ProfileUpdateContent() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        redirect("/sign-in?reason=auth-required&callbackURL=%2Fprofile%2Fupdate");
    }

    return <ProfileUpdateForm user={session.user} />;
}

function ProfileUpdateLoading() {
    return (
        <div
            aria-label="প্রোফাইল ফর্ম লোড হচ্ছে"
            aria-busy="true"
            className="min-h-full bg-gradient-to-b from-[#e6f0e8] to-[#f0f5f0] px-4 py-8 sm:px-6 sm:py-14"
        >
            <div className="mx-auto max-w-2xl animate-pulse overflow-hidden rounded-3xl border border-[#e1e9e2] bg-white shadow-[0_10px_40px_-12px_rgba(7,131,63,0.18)]">
                <div className="h-28 bg-[#e5efe7] sm:h-32" />
                <div className="px-6 pb-8 sm:px-8">
                    <div className="relative -mt-12 flex flex-col items-center gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:gap-5">
                        <div className="size-24 rounded-full border-4 border-white bg-[#edf2ee] sm:size-28" />
                        <div className="h-10 w-40 rounded-xl bg-[#edf2ee]" />
                    </div>
                    <div className="mt-8 space-y-5">
                        <div className="space-y-2">
                            <div className="h-4 w-20 rounded bg-[#edf2ee]" />
                            <div className="h-12 rounded-xl bg-[#f3f7f4]" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-20 rounded bg-[#edf2ee]" />
                            <div className="h-12 rounded-xl bg-[#f3f7f4]" />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3 border-t border-[#e7ece7] pt-6">
                        <div className="h-11 w-28 rounded-xl bg-[#edf2ee]" />
                        <div className="h-11 w-36 rounded-xl bg-[#edf2ee]" />
                    </div>
                </div>
            </div>
        </div>
    );
}