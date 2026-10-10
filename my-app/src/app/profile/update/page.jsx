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
            className="min-h-full bg-[#f0f5f0] px-4 py-8 sm:px-6 sm:py-12"
        >
            <div className="mx-auto max-w-2xl animate-pulse rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-6 sm:p-8">
                <div className="h-7 w-56 rounded bg-[#edf2ee]" />
                <div className="mt-6 flex items-center gap-4">
                    <div className="size-24 rounded-full bg-[#edf2ee]" />
                    <div className="h-10 w-40 rounded-lg bg-[#edf2ee]" />
                </div>
                <div className="mt-6 h-11 rounded-lg bg-[#edf2ee]" />
            </div>
        </div>
    );
}
