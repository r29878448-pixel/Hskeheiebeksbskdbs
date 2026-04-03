'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, Bell, User, X, MessageCircle, Send, Phone, PlusCircle, Headphones, Home, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Home', icon: <Home className="w-5 h-5" />, href: '/' },
    { name: 'Profile', icon: <User className="w-5 h-5" />, href: '#' },
    { name: 'Telegram channel', icon: <Send className="w-5 h-5" />, href: 'https://t.me/vip_study_channel' },
    { name: 'WhatsApp channel', icon: <MessageCircle className="w-5 h-5" />, href: 'https://whatsapp.com/channel/0029VbAvDSX0QeahEg4kkE3U' },
    { name: 'Join WhatsApp channel', icon: <Phone className="w-5 h-5" />, href: 'https://whatsapp.com/channel/0029VbAvDSX0QeahEg4kkE3U' },
    { name: 'Join Telegram channel', icon: <Send className="w-5 h-5" />, href: 'https://t.me/vip_study_channel' },
    { name: 'Contact VIP study', icon: <Headphones className="w-5 h-5" />, href: 'https://t.me/vip_study_channel' },
    { name: 'Add batch request', icon: <PlusCircle className="w-5 h-5" />, href: '#' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-white/5 px-4 py-2 md:px-6">
        <div className="max-w-[1920px] mx-auto flex flex-col gap-4">
          {/* Top Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
              
              <Link href="/" className="flex flex-col">
                <span className="text-lg font-black text-white leading-none tracking-tight">
                  VIPKGS
                </span>
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.2em] mt-0.5">
                  POWERED BY VIP STUDY
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#141414] border border-white/10 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-white/80">0h 35m</span>
              </div>
              
              <button className="p-2 hover:bg-white/5 rounded-full transition-colors relative hidden md:block">
                <Bell className="w-5 h-5 text-white/70" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
              </button>
              
              <button className="p-2 hover:bg-white/5 rounded-full transition-colors hidden md:block">
                <User className="w-5 h-5 text-white/70" />
              </button>
            </div>
          </div>

          {/* Search Bar Row */}
          <div className="relative w-full max-w-2xl mx-auto pb-2 px-2 md:px-0">
            <Search className="absolute left-6 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search your batch..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full bg-[#141414] border border-white/5 rounded-2xl py-2.5 md:py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all text-sm text-white placeholder:text-white/20 shadow-inner"
            />
          </div>
        </div>
      </nav>

      {/* Navigation Menu Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-[#0a0a0a] border-r border-white/10 z-[101] p-6 flex flex-col gap-8"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-white">MENU</span>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {menuItems.map((item, idx) => (
                  <Link 
                    key={idx} 
                    href={item.href}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-all group"
                  >
                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-white/5">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest text-center">
                  © 2026 VIP STUDY
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
