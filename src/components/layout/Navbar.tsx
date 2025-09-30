"use client";
import React, { useState } from "react";
export default function Navbar() {
  const [toggleMenu, setTogglemenu] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-10 border-b border-gray-300 py-4 flex items-center justify-center bg-primary">
        <div className="flex items-center justify-center gap-2 sm:text-2xl font-bold text-secondary">
          <img src="/assets/logo-no-bg.png" alt="favicon" width={40} height={40} />
          <span>Fragments Admin</span>
        </div>
      </nav>
    </>
  );
}
