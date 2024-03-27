import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Amalfi",
  description: " Amalfi Order System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr" className="h-full">
      <script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
      <body className={`font-inter ${inter.className}`}>
        <div>{children}</div>
      </body>
    </html>
  );
}
