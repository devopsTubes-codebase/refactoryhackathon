import React from 'react';

export function Footer() {
  return (
    <footer className="bg-[rgba(8,15,23,0.8)] border-t border-[rgba(255,255,255,0.1)]">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-lg"></div>
              <span className="text-xl font-bold text-white">Codebase Wiki</span>
            </div>
            <p className="text-[#a1a1aa] text-sm">
              Generate GitBook-like documentation from your codebase automatically.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-[#a1a1aa] hover:text-white transition-colors text-sm">Features</a></li>
              <li><a href="#pricing" className="text-[#a1a1aa] hover:text-white transition-colors text-sm">Pricing</a></li>
              <li><a href="#docs" className="text-[#a1a1aa] hover:text-white transition-colors text-sm">Documentation</a></li>
              <li><a href="#changelog" className="text-[#a1a1aa] hover:text-white transition-colors text-sm">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="text-[#a1a1aa] hover:text-white transition-colors text-sm">About</a></li>
              <li><a href="#blog" className="text-[#a1a1aa] hover:text-white transition-colors text-sm">Blog</a></li>
              <li><a href="#careers" className="text-[#a1a1aa] hover:text-white transition-colors text-sm">Careers</a></li>
              <li><a href="#contact" className="text-[#a1a1aa] hover:text-white transition-colors text-sm">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#privacy" className="text-[#a1a1aa] hover:text-white transition-colors text-sm">Privacy</a></li>
              <li><a href="#terms" className="text-[#a1a1aa] hover:text-white transition-colors text-sm">Terms</a></li>
              <li><a href="#security" className="text-[#a1a1aa] hover:text-white transition-colors text-sm">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.1)] text-center text-[#a1a1aa] text-sm">
          © 2026 Codebase Wiki. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
