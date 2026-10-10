export default function ProductLoading() {
    return (
        <div
            aria-label="পণ্যের তথ্য লোড হচ্ছে"
            aria-busy="true"
            className="min-h-full bg-[#f0f5f0] px-4 py-6 sm:px-6 sm:py-8"
        >
            <div className="mx-auto max-w-6xl animate-pulse space-y-5">
                <div className="h-4 w-44 rounded bg-[#dfe8e0]" />
                <div className="rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-5 sm:p-7">
                    <div className="flex items-center gap-4">
                        <div className="size-16 rounded-xl bg-[#edf2ee]" />
                        <div className="flex-1 space-y-3">
                            <div className="h-6 w-48 rounded bg-[#edf2ee]" />
                            <div className="h-4 w-72 max-w-full rounded bg-[#edf2ee]" />
                        </div>
                        <div className="hidden h-20 w-24 rounded-xl bg-[#edf2ee] sm:block" />
                    </div>
                </div>
                <div className="rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-5 sm:p-7">
                    <div className="mb-4 h-5 w-40 rounded bg-[#edf2ee]" />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {Array.from({ length: 3 }, (_, index) => (
                            <div key={index} className="h-24 rounded-xl bg-[#edf2ee]" />
                        ))}
                    </div>
                </div>
                <div className="h-72 rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb]" />
            </div>
        </div>
    );
}
