import { Suspense } from "react";
import { Hind_Siliguri  } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthToasts from "./components/AuthToasts";
import NavBarPage from "./components/NavBar";
import HeaderPage from "./components/Header"
import Footer from "./components/Footer";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
});


export const metadata = {
  title: "বাজার দর — আজকের বাজারের দাম",
  description: "চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম এক নজরে।",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <AuthToasts />
        </Suspense>
        <HeaderPage></HeaderPage>
        <Suspense fallback={<div aria-hidden="true" className="h-22 bg-[#fbfdfb]" />}>
          <NavBarPage />
        </Suspense>
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              border: "1px solid #e1e9e2",
              borderRadius: "12px",
              fontFamily: "var(--font-bengali), sans-serif",
            },
            success: {
              iconTheme: { primary: "#07833f", secondary: "#ffffff" },
            },
          }}
        />

      </body>
    </html>
  );
}
