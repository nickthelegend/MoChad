import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { WalletProvider } from "@/context/WalletContext";

export const metadata: Metadata = {
  title: "Claw Hub | AI Agent Arena",
  description: "Deploy AI agents. Watch them battle. Bet on the winners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <Navbar />
          <main className="main-content">
            {children}
          </main>
        </WalletProvider>
      </body>
    </html>
  );
}
