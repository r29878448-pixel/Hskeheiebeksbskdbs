'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Course } from '@/lib/types';
import { Clock, ArrowRight, Heart } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  index: number;
  onClick?: (e: React.MouseEvent) => void;
}

export default function CourseCard({ course, index, onClick }: CourseCardProps) {
  const fallbackImage = "https://cdn.phototourl.com/uploads/2026-02-19-1f27dc6c-5d30-4bf9-af5f-1f5c606784dd.png";
  const [imgSrc, setImgSrc] = React.useState(course.image || fallbackImage);
  
  // Mock price for UI consistency with screenshot
  const price = [799, 699, 559, 999][index % 4];

  const CardContent = (
    <>
      {/* Image Container */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={imgSrc}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
          unoptimized={imgSrc.includes('digitaloceanspaces.com')}
          onError={() => setImgSrc(fallbackImage)}
        />
        
        {/* Top Badges */}
        <div className="absolute top-2 left-2">
          <div className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/10">
            ₹{price}
          </div>
        </div>
        
        <div className="absolute top-2 right-2">
          <div className="p-1.5 bg-black/40 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-colors border border-white/10">
            <Heart className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-2.5 md:p-3 gap-2 md:gap-3">
        <h3 className="text-[10px] md:text-xs font-bold text-white/90 line-clamp-2 leading-relaxed min-h-[2.2rem] md:min-h-[2.5rem]">
          {course.title}
        </h3>
        
        {/* Bottom Bar */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-1 md:gap-1.5 text-indigo-400">
            <Clock className="w-2.5 md:w-3 h-2.5 md:h-3" />
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-wider">LIFETIME</span>
          </div>
          
          <div className="text-white/30 group-hover:text-white transition-colors">
            <ArrowRight className="w-3 md:w-3.5 h-3 md:h-3.5" />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group flex flex-col bg-[#141414] rounded-xl overflow-hidden border border-white/5 hover:border-white/10 transition-all cursor-pointer"
      onClick={onClick}
    >
      {onClick ? (
        <div className="flex flex-col h-full">
          {CardContent}
        </div>
      ) : (
        <Link href={`/course/${course.id}`} className="flex flex-col h-full">
          {CardContent}
        </Link>
      )}
    </motion.div>
  );
}
