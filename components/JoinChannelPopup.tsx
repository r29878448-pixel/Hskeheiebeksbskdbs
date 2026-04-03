'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Send, X, ExternalLink } from 'lucide-react';

interface JoinChannelPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  type?: 'whatsapp' | 'telegram';
}

export default function JoinChannelPopup({ isOpen, onClose, onContinue, type = 'whatsapp' }: JoinChannelPopupProps) {
  const whatsappLink = "https://whatsapp.com/channel/0029VbAvDSX0QeahEg4kkE3U";
  const telegramLink = "https://t.me/vip_study_channel";
  
  const isWhatsApp = type === 'whatsapp';
  const link = isWhatsApp ? whatsappLink : telegramLink;
  const title = isWhatsApp ? "WhatsApp Channel" : "Telegram Channel";
  const icon = isWhatsApp ? <MessageCircle className="w-10 h-10 text-emerald-500" /> : <Send className="w-10 h-10 text-blue-500" />;
  const accentColor = isWhatsApp ? "bg-emerald-500" : "bg-blue-500";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            className="relative w-full max-w-sm bg-[#141414] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            {/* Subtle Gradient Background */}
            <div className={`h-24 ${accentColor} opacity-10 blur-3xl absolute -top-12 -left-12 w-48 rounded-full`} />
            <div className={`h-24 ${accentColor} opacity-10 blur-3xl absolute -bottom-12 -right-12 w-48 rounded-full`} />

            <div className="p-7 flex flex-col items-center text-center relative z-10">
              <button 
                onClick={onClose}
                className="absolute top-5 right-5 p-1.5 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-white/30" />
              </button>

              <div className="mb-5 p-3.5 bg-white/5 rounded-2xl border border-white/10">
                {icon}
              </div>

              <h2 className="text-xl font-black text-white mb-2 tracking-tight">
                {title}
              </h2>
              <p className="text-white/50 text-xs mb-6 leading-relaxed max-w-[240px]">
                Join our official channel for real-time updates and exclusive study material.
              </p>

              <div className="flex flex-col gap-2.5 w-full">
                <a 
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg ${accentColor}`}
                >
                  Join Channel
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                
                <button 
                  onClick={onContinue}
                  className="w-full py-3 rounded-xl font-bold text-white/30 hover:text-white hover:bg-white/5 transition-all text-xs"
                >
                  Continue to Batch
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
