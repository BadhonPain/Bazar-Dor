export default function CategoryLoading() {
    return (
        <div
            aria-label="পণ্যের তথ্য লোড হচ্ছে"
            aria-busy="true"
            className="min-h-full bg-[#f0f5f0] px-4 py-6 sm:px-6 sm:py-8"
        >
            <div className="mx-auto max-w-6xl animate-pulse space-y-5">
                <div className="h-8 w-56 rounded bg-[#dfe8e0]" />
                <div className="h-4 w-72 max-w-full rounded bg-[#dfe8e0]" />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }, (_, index) => (
                        <div
                            key={index}
                            className="min-h-28 rounded-xl border border-[#e1e9e2] bg-[#fbfdfb] p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="size-11 rounded-xl bg-[#edf2ee]" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-2/3 rounded bg-[#edf2ee]" />
                                    <div className="h-3 w-1/3 rounded bg-[#edf2ee]" />
                                </div>
                            </div>
                            <div className="mt-4 h-4 w-1/2 rounded bg-[#edf2ee]" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
