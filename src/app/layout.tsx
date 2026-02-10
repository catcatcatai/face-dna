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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=JSON.parse(localStorage.getItem("onset-accent"));if(s&&s.state){var e=document.documentElement.style,h=s.state.hue,c=s.state.chroma;if(h!=null)e.setProperty("--accent-hue",h);if(c!=null){e.setProperty("--accent-chroma",c);e.setProperty("--accent-chroma-dim",c*0.05/0.19)}}}catch(e){}})()`,
          }}
        />
      </head>
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
