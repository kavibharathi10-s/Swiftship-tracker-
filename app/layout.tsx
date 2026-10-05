import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";

const font = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ship Swift",
  description: "Courier Services",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={font.className}>
          {children}
          <Toaster />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
