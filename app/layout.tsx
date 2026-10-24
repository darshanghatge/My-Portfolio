import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SceneCanvas } from "@/components/scene/SceneCanvas";
import { DecodeLoader } from "@/components/loader/DecodeLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
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
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className={`${jetbrainsMono.variable} min-h-full flex flex-col bg-[#050816] text-zinc-100 relative selection:bg-pink-500/30 selection:text-white overflow-x-hidden`}>
        {/* Full-screen intro loader mounted as first child of body */}
        <DecodeLoader />

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

