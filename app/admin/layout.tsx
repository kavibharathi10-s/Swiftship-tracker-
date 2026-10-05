"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const NavContent = () => (
    <nav className="space-y-2">
      <Link href="/admin" passHref>
        <Button variant="ghost" className="w-full justify-start">
          Dashboard
        </Button>
      </Link>
      <Link href="/admin/drivers" passHref>
        <Button variant="ghost" className="w-full justify-start">
          Drivers
        </Button>
      </Link>
      <Link href="/admin/clients" passHref>
        <Button variant="ghost" className="w-full justify-start">
          Clients
        </Button>
      </Link>
      <Link href="/admin/deliveries" passHref>
        <Button variant="ghost" className="w-full justify-start">
          Deliveries
        </Button>
      </Link>
    </nav>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:block w-64 bg-white shadow-md">
        <div className="p-5">
          <NavContent />
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden absolute top-4 left-4"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <div className="py-4">
            <NavContent />
          </div>
        </SheetContent>
      </Sheet>

      <main className="flex-1 p-4 md:p-10 overflow-auto">{children}</main>
    </div>
  );
}
