import { Hind_Siliguri  } from "next/font/google";
import "./globals.css";
import NavBarPage from "./components/NavBar";
import HeaderPage from "./components/Header"

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
});


export const metadata = {
  title: "বাজার দর — আজকের বাজারের দাম",
  description: "চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম এক নজরে।",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <HeaderPage></HeaderPage>
        <NavBarPage></NavBarPage>
        <main>
          {children}
        </main>

      </body>
    </html>
  );
}
