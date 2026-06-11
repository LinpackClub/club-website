"use client";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <nav className="bg-[#36BA98] shadow-lg h-[10vh]">
      <div className="max-w-6xl mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center space-x-4">
            <Link href="/" aria-label="Linpack Club">
              <Image
                className="LogoImage h-[8vh] w-auto"
                src="/images/logo.png"
                alt="Linpack Club logo"
                width={1600}
                height={1600}
              />
            </Link>
            <span className="font-semibold text-xl text-gray-700">
              Linpack Club
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className="py-2 px-4 text-slate-800  font-serif text-xl hover:text-indigo-500"
            >
              Home
            </Link>
            <Link
              href="/#matlab"
              className="py-2 px-4 text-slate-800  font-serif text-xl hover:text-indigo-500"
            >
              Matlab Tutorials
            </Link>
            <Link
              href="/#aboutus"
              className="py-2 px-4 text-slate-800  font-serif text-xl hover:text-indigo-500"
            >
              About Us
            </Link>
            <Link
              href="/#matlab"
              className="py-2 px-4 text-slate-800  font-serif text-xl hover:text-indigo-500"
            >
              Overleaf Resources
            </Link>
            <Link
              href="/#contact"
              className="py-2 px-4 text-slate-800  font-serif text-xl hover:text-indigo-500"
            >
              Contact Us
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              className="outline-none mobile-menu-button"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isMounted && isOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMounted && isOpen && (
        <div className="md:hidden">
          <Link
            href="/"
            className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-200"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-200"
          >
            About
          </Link>
          <Link
            href="/services"
            className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-200"
          >
            Services
          </Link>
          <Link
            href="/contact"
            className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-200"
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
