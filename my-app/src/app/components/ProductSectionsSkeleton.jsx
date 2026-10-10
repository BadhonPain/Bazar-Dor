function SkeletonSection({ cardCount }) {
    return (
        <section aria-hidden="true" className="animate-pulse">
            <div className="mb-4 h-7 w-48 rounded-md bg-[#dfe8e0]" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: cardCount }, (_, index) => (
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
        </section>
    );
}

export default function ProductSectionsSkeleton() {
    return (
        <div
            aria-label="পণ্যের তথ্য লোড হচ্ছে"
            aria-busy="true"
            className="mx-auto mt-8 max-w-6xl space-y-8 sm:mt-10 sm:space-y-10"
        >
            <SkeletonSection cardCount={6} />
            <SkeletonSection cardCount={6} />
            <SkeletonSection cardCount={9} />
        </div>
    );
}
