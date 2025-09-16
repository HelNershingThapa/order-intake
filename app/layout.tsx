// app/layout.tsx (Server Component)
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = { title: "App", description: "..." };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Important if a client ThemeProvider will toggle className
    <html lang="en" suppressHydrationWarning>
      {/* No client-only logic here */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
