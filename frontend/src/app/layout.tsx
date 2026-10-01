import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Creative Workspace",
  description: "AI-Powered Content Research & Operations Platform",
};

import Sidebar from "@/components/Sidebar";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex text-[#111111]">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
