"use client";

import React, { useState, useEffect } from "react";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show button after a short delay for smooth entry
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const phoneNumber = "916381601900";
  const messageText = "Hello, I have a question regarding your products/services.";
  const encodedMessage = encodeURIComponent(messageText);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[999] transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-75"
      }`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Pulse/Glowing Ring Effect */}
      <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-60 pointer-events-none"></div>

      {/* Tooltip */}
      <div
        className={`absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap transition-all duration-300 pointer-events-none ${
          showTooltip ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
        }`}
      >
        Chat with us on WhatsApp
        {/* Tooltip Arrow */}
        <div className="absolute top-1/2 -translate-y-1/2 right-[-4px] w-2 h-2 bg-gray-900 rotate-45"></div>
      </div>

      {/* Main WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_25px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      >
        <svg
          className="w-7 h-7 transition-transform duration-300 group-hover:rotate-12"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.228 1.977 13.765 1.9 12.012 1.9c-5.438 0-9.863 4.37-9.867 9.8-.001 1.774.475 3.507 1.378 5.037L2.502 21.5l4.145-1.089zm11.233-5.263c-.301-.15-1.78-.879-2.056-.979-.275-.1-.475-.15-.675.15-.1.15-.776.979-.95 1.178-.175.199-.35.224-.65.075-1.637-.818-2.67-1.385-3.722-3.19-.277-.476.277-.442.793-1.472.088-.174.044-.324-.022-.474-.067-.15-.575-1.387-.788-1.9-.208-.501-.43-.432-.575-.439-.148-.007-.318-.009-.488-.009-.17 0-.448.064-.682.32-.234.256-.893.872-.893 2.126 0 1.254.912 2.463 1.037 2.63.125.167 1.794 2.739 4.348 3.84 2.124.918 2.625.734 3.1.689.475-.045 1.78-.727 2.03-1.429.25-.701.25-1.302.175-1.429-.075-.127-.275-.201-.575-.351z" />
        </svg>
      </a>
    </div>
  );
}
