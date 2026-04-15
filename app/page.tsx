'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Course } from '@/lib/types';
import Navbar from '@/components/Navbar';
import CourseCard from '@/components/CourseCard';
import { CourseSkeleton } from '@/components/Skeletons';
import Toast from '@/components/Toast';
import JoinChannelPopup from '@/components/JoinChannelPopup';
import VerificationPopup, { VerificationPopupRef } from '@/components/VerificationPopup';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);
  const verificationRef = useRef<VerificationPopupRef>(null);
  const router = useRouter();

  const handleCourseClick = (courseId: string) => {
    if (verificationRef.current?.checkStatus()) {
      router.push(`/course/${courseId}`);
    } else {
      verificationRef.current?.open();
    }
  };

  useEffect(() => {
    async function fetchCourses() {
      try {
        const targetUrl = 'https://kgs-main-api-scamer.vercel.app/get-courses';
        const res = await fetch(`/api/proxy?url=${encodeURIComponent(targetUrl)}`);
        if (!res.ok) throw new Error('Failed to fetch courses');
        const data = await res.json();
        const coursesList = data.courses || [];
        setCourses(coursesList);
        setFilteredCourses(coursesList);
        
        // Show WhatsApp popup when all data is loaded
        if (coursesList.length > 0) {
          setShowWhatsAppPopup(true);
        }

        // Show welcome toast if they have progress
        const progress = localStorage.getItem('watchProgress');
        if (progress) {
          setToast({ message: 'Welcome back! Continue your learning.', type: 'success' });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredCourses(courses);
      return;
    }
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  return (
    <main className="flex-1">
      <Navbar onSearch={handleSearch} />
      
      <div className="max-w-7xl mx-auto">
        <header className="px-4 pt-6 md:px-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl md:text-2xl font-black text-white uppercase tracking-tight"
          >
            Explore <span className="text-primary">Courses</span>
          </motion.h1>
          <div className="h-1 w-12 bg-primary mt-1 rounded-full" />
        </header>

        {loading ? (
          <CourseSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <p className="text-destructive text-lg font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-primary rounded-full font-semibold"
            >
              Retry
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <p className="text-muted-foreground text-lg">No courses found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 p-3 md:p-8">
            {filteredCourses.map((course, index) => (
              <CourseCard 
                key={`${course.id}-${index}`} 
                course={course} 
                index={index} 
                onClick={() => handleCourseClick(course.id.toString())}
              />
            ))}
          </div>
        )}
      </div>

      <Toast 
        isVisible={!!toast} 
        message={toast?.message || ''} 
        type={toast?.type} 
        onClose={() => setToast(null)} 
      />

      <JoinChannelPopup 
        isOpen={showWhatsAppPopup} 
        onClose={() => setShowWhatsAppPopup(false)} 
        onContinue={() => setShowWhatsAppPopup(false)}
        type="whatsapp"
      />

      <VerificationPopup ref={verificationRef} />

      {/* Footer Section */}
      <footer className="mt-auto py-12 px-6 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white leading-none tracking-tight">
                VIPKGS
              </span>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-1">
                POWERED BY RK STUDY
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Premium EdTech platform providing high-quality study material and courses for competitive exams.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Quick Links</h3>
            <div className="flex flex-col gap-3">
              <a href="https://t.me/vip_study_channel" className="text-white/60 hover:text-primary transition-colors text-sm">Telegram Channel</a>
              <a href="https://whatsapp.com/channel/0029VbAvDSX0QeahEg4kkE3U" className="text-white/60 hover:text-primary transition-colors text-sm">WhatsApp Channel</a>
              <a href="https://whatsapp.com/channel/0029VbAvDSX0QeahEg4kkE3U" className="text-white/60 hover:text-primary transition-colors text-sm">Join WhatsApp</a>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Contact VIP Study</h3>
            <div className="flex flex-col gap-4">
              <p className="text-white/40 text-sm">For any queries or support, reach out to us on our official Telegram channel.</p>
              <a 
                href="https://t.me/vip_study_channel" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-primary py-3 rounded-2xl font-bold text-white hover:scale-[1.02] transition-all"
              >
                Contact on Telegram
              </a>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
            © 2026 RK STUDY. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6">
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:text-white/40 transition-colors">Privacy Policy</span>
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:text-white/40 transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
