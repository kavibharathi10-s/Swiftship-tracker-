import React from "react";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function SiteFooter() {
  return (
    <footer className="flex flex-col sm:flex-row flex-wrap justify-between items-center py-6 px-4 md:px-6 border-t gap-6">
      {/* Left section: Branding and Rights */}
      <div className="flex flex-col items-center sm:items-start">
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          © 2024 Ship Swift. All rights reserved.
        </p>
        <nav className="mt-2 flex gap-4 sm:gap-6">
          <Link
            href={"/terms-of-service"}
            className="text-xs hover:underline underline-offset-4"
          >
            Terms of Service
          </Link>
          <Link
            href={"/privacy-policy"}
            className="text-xs hover:underline underline-offset-4"
          >
            Privacy Policy
          </Link>
        </nav>
      </div>

      {/* Center section: Quick Links */}
      <div className="flex flex-col items-center sm:items-start gap-2 sm:gap-4">
        <p className="text-sm font-semibold text-muted-foreground">
          Quick Links
        </p>
        <nav className="flex flex-wrap justify-center sm:justify-start gap-4">
          <Link
            href={"/about-us"}
            className="text-xs hover:underline underline-offset-4"
          >
            About Us
          </Link>
          <Link
            href={"/faq"}
            className="text-xs hover:underline underline-offset-4"
          >
            FAQ
          </Link>
          <Link
            href={"/careers"}
            className="text-xs hover:underline underline-offset-4"
          >
            Careers
          </Link>
          <Link
            href={"/support"}
            className="text-xs hover:underline underline-offset-4"
          >
            Support
          </Link>
        </nav>
      </div>

      {/* Right section: Social Media and Contact Info */}
      <div className="flex flex-col items-center sm:items-end gap-2 sm:gap-4">
        <div className="flex items-center gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
            aria-label="Facebook"
          >
            <FaFacebook size={18} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
            aria-label="Twitter"
          >
            <FaTwitter size={18} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
            aria-label="Instagram"
          >
            <FaInstagram size={18} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={18} />
          </a>
        </div>
        <p className="text-xs text-muted-foreground text-center sm:text-right">
          Email us at{" "}
          <a
            href="mailto:support@shipswift.com"
            className="hover:underline underline-offset-4"
          >
            support@shipswift.com
          </a>
        </p>
      </div>
    </footer>
  );
}

export default SiteFooter;
