'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const router = useRouter();
  useEffect(() => {
    router.prefetch('/admin');
  }, [router]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
      (async () => {
        try {
          const res = await fetch('/api/auth/me', { cache: 'no-store' });
          const data = await res.json();
          setIsAdmin(Boolean(data?.user && data.user.role === 'ADMIN'));
        } catch { setIsAdmin(false); }
      })();
    }, []);

  // Desktop & mobile links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Order', path: '/order' },
    { name: 'Live Orders', path: '/order/board' },   // 👈 NEW
    { name: 'Contact', path: '/contact' },
    // NEW: Admin link after Contact
    { name: 'Admin', path: '/admin' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-amber-500/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <img
              src="/kks-empire-logo.png"
              alt="KK's Empire Logo"
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-amber-400 ${
                  pathname === link.path ? 'text-amber-400' : 'text-slate-300'
                }`}
              >
                {link.name}
                {pathname === link.path && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                )}
              </Link>
            ))}

            <Button
              asChild
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Link href="/order">Book Table</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-amber-400 hover:bg-slate-800/50"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900/98 backdrop-blur-lg border-t border-amber-500/20">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-3 text-base font-medium transition-all duration-300 rounded-lg ${
                  pathname === link.path
                    ? 'text-amber-400 bg-amber-500/10'
                    : 'text-slate-300 hover:text-amber-400 hover:bg-slate-800/50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Button
              asChild
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold py-3 rounded-lg shadow-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link href="/order">Book Table</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;