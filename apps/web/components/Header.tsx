import React from 'react';
import { Button } from './Button';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(8,15,23,0.8)] backdrop-blur-md border-b border-[rgba(255,255,255,0.1)]">
      <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-lg"></div>
          <span className="text-xl font-bold text-white">Codebase Wiki</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[#a1a1aa] hover:text-white transition-colors">
            Features
          </a>
          <a href="#docs" className="text-[#a1a1aa] hover:text-white transition-colors">
            Documentation
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="secondary">Log in</Button>
          <Button variant="primary">Get Started</Button>
        </div>
      </div>
    </header>
  );
}
