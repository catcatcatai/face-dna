import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { FloatingToolbar } from "@/components/layout/FloatingToolbar";
import { FalConfigProvider } from "@/components/providers/FalConfigProvider";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "face-dna",
  description: "LoRA face trainer — bootstrap a training dataset from a single face image",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibmPlexMono.variable} antialiased`}>
        <FalConfigProvider>
          <SiteHeader />
          <main className="mx-auto max-w-5xl px-4 pt-14 pb-24">{children}</main>
          <FloatingToolbar />
        </FalConfigProvider>
        <Toaster />
      </body>
    </html>
  );
}
