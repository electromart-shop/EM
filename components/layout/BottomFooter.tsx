

import React from "react";
import Link from "next/link";
import { Zap, Mail, MapPin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-black text-gray-300 pt-16 pb-8 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex flex-col items-start">
              <img src="/images/logo.jpg" className="h-8 mb-2 logo" alt="Electromart Logo" />
              <span className="font-bold text-xl tracking-tight text-white">
                ELECTROMART
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              Fueling Tomorrow's Tech Today. Providing affordable electronic components for students across Tamil Nadu to innovate without limits.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="hover:text-brand-orange transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-orange transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-brand-orange transition-colors text-sm">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm">
                <Mail size={18} className="text-brand-orange shrink-0 mt-0.5" />
                <a href="mailto:electromart.cbe@gmail.com" className="hover:text-white transition-colors break-all">
                  electromart.cbe@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <MapPin size={18} className="text-brand-orange shrink-0 mt-0.5" />
                <span>Tamil Nadu, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} ELECTROMART. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 flex items-center">
            Built with <Heart size={12} className="text-brand-orange mx-1" /> for engineering students
          </p>
        </div>
      </div>
    </footer>
  );
}
