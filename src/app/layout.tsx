import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AppNav } from "@/components/layout/AppNav";
import { FalConfigProvider } from "@/components/providers/FalConfigProvider";
import "./globals.css";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Onset",
  description: "LoRA face trainer — bootstrap a training dataset from a single face image",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${robotoMono.variable} antialiased`}
      >
        <FalConfigProvider>
          <AppNav />
          <main className="mx-auto max-w-5xl px-4 pt-10 pb-16">{children}</main>
        </FalConfigProvider>
        <Toaster />
      </body>
    </html>
  );
}
