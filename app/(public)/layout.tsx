import type { Metadata } from "next";
import "@/app/globals.css";
import PublicNavBar from "./components/PublicNavBar";
import PublicFooter from "./components/PublicFooter";

export const metadata: Metadata = {
  title: "Ship Swift",
  description: "Ship parcels swiftly",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <PublicNavBar />
      {children}
      <PublicFooter />
    </div>
  );
}
