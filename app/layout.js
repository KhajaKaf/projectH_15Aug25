// app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
//import dynamic from "next/dynamic";
import { CartProvider } from "@/providers/cart-provider";
import ClientToaster from "@/components/client-toaster";
const inter = Inter({ subsets: ["latin"] });
//const Toaster = dynamic(() => import("@/components/ui/toaster"), { ssr: false });

export const metadata = {
  title: "KK's Empire - Indo-Arabian Fine Dining",
  description:
    "Experience authentic Indo-Arabian cuisine in a luxurious dining atmosphere. Book your table now.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-slate-900`}>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
           <ClientToaster />
        </CartProvider>
      </body>
    </html>
  );
}