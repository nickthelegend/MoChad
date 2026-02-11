import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
import { WalletProvider } from "@/context/WalletContext";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Claw Hub - Pixel Arena",
  description: "A retro-style AI battle arena.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <WalletProvider>
            <Navbar />
            <main className="main-content">
              {children}
            </main>
          </WalletProvider>
        </Providers>
      </body>
    </html>
  );
}
