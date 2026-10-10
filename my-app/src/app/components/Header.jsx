import Image from "next/image";
import Link from "next/link";
import AccountMenu from "./AccountMenu";
import ThemeToggle from "./ThemeToggle";

const date = new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "full",
    timeZone: "Asia/Dhaka",
}).format(new Date());

const HeaderPage = () => {
    return (
        <header className="border-b border-[#e3e9e4] bg-[#fbfdfb]">
            <div className="mx-auto flex h-17 max-w-6xl items-center justify-between px-4 sm:px-6">
                <Link
                    href="/"
                    aria-label="বাজার দর হোম পেজ"
                    className="flex min-w-0 items-center gap-3"
                >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#07833f]">
                        <Image
                            src="/logo-icon.png"
                            alt=""
                            width={28}
                            height={28}
                            className="size-7 object-contain"
                            priority
                        />
                    </span>
                    <span className="min-w-0">
                        <span className="block text-base font-bold leading-5 text-[#1d2b22] sm:text-lg">
                            বাজার দর
                        </span>
                        <time
                            suppressHydrationWarning
                            className="block truncate text-xs leading-4 text-[#77817a]"
                        >
                            {date}
                        </time>
                    </span>
                </Link>
                <div className="flex shrink-0 items-center gap-2">
                    <ThemeToggle />
                    <AccountMenu />
                </div>
            </div>
        </header>
    );
};

export default HeaderPage;
