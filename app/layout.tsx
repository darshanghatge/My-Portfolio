import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SceneCanvas } from "@/components/scene/SceneCanvas";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Darshan P — Creative Developer & Technologist",
  description:
    "Interactive 3D portfolio featuring a stylized procedural planet wrapped in a swirling ribbon shell, on a deep navy starfield.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050816] text-zinc-100 relative selection:bg-pink-500/30 selection:text-white overflow-x-hidden">
        {/* Mount SceneCanvas ONCE as a fixed full-screen layer behind everything (z-0, pointer-events: none) */}
        <SceneCanvas />

        {/* Soft edge celestial vignette */}
        <div
          className="fixed inset-0 pointer-events-none z-[1]"
          style={{
            background:
              "radial-gradient(circle at center, transparent 40%, rgba(5, 8, 22, 0.75) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Page Content layer above the canvas (z-10) */}
        <div className="relative z-10 flex flex-col flex-1 w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
