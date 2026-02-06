import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Craig-O-Cache | Redis-Like Caching Layer Manager",
  description: "Professional caching layer manager with TTL management, cache invalidation, hit/miss analytics, key browser, and memory usage stats.",
  keywords: ["cache", "redis", "caching", "ttl", "key-value", "analytics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
