"use client"
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Package, Truck, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

function PublicNavBar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '/features', label: 'Features' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/about', label: 'About' }
  ]

  const NavLinks = () => (
    <>
      {navLinks.map((link) => (
        <Link 
          key={link.href} 
          href={link.href}
          className="transition-colors hover:text-foreground/80 text-foreground/60"
        >
          {link.label}
        </Link>
      ))}
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center">
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-6 w-6" />
                    <span className="font-bold">Ship Swift</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-8">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Truck className="h-6 w-6" />
            <span className="font-bold hidden sm:inline-block">Ship Swift</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center ml-6 space-x-6 text-sm font-medium">
            <NavLinks />
          </nav>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-2">
          <Link href="/sign-in">
            <Button variant="ghost" className="text-sm font-medium">
              Log in
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="text-sm font-medium">
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default PublicNavBar