'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Subject } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { SubjectSkeleton } from '@/components/Skeletons';
import JoinChannelPopup from '@/components/JoinChannelPopup';
import VerificationPopup, { VerificationPopupRef } from '@/components/VerificationPopup';
import { motion } from 'motion/react';
import { ChevronLeft, GraduationCap, ArrowRight, Plus } from 'lucide-react';

export default function CoursePage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);
  const verificationRef = useRef<VerificationPopupRef>(null);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const targetUrl = `https://kgs-main-api-scamer.vercel.app/subjects/${courseId}`;
        const res = await fetch(`/api/proxy?url=${encodeURIComponent(targetUrl)}`);
        if (!res.ok) throw new Error('Failed to fetch subjects');
        const data = await res.json();
        setSubjects(data);
        
        // Show WhatsApp popup when subjects are loaded (user clicked a course)
        if (data.length > 0) {
          setShowWhatsAppPopup(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchSubjects();
  }, [courseId]);

  const handleCreateTopic = () => {
    if (verificationRef.current?.checkStatus()) {
      // Logic for creating topic (placeholder)
      alert('Topic creation feature coming soon!');
    } else {
      verificationRef.current?.open();
    }
  };

  const handleSubjectClick = (subjectId: string) => {
    if (verificationRef.current?.checkStatus()) {
      router.push(`/subject/${subjectId}`);
    } else {
      verificationRef.current?.open();
    }
  };

  return (
    <main className="flex-1">
      <Navbar />
      
      <div className="max-w-7xl mx-auto">
        <div className="px-4 py-6 md:px-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Courses</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold font-display"
              >
                Course <span className="text-primary">Subjects</span>
              </motion.h1>
              <p className="text-muted-foreground mt-2">Select a subject to view available lessons.</p>
            </div>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleCreateTopic}
              className="flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 px-6 py-3 rounded-2xl text-primary font-bold text-sm transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Topic</span>
            </motion.button>
          </div>
        </div>

        {loading ? (
          <SubjectSkeleton />
        ) : error ? (
          <div className="p-8 text-center text-destructive">{error}</div>
        ) : subjects.length === 0 ? (
          <div className="p-20 text-center text-muted-foreground">No subjects found for this course.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:p-8">
            {subjects.map((subject, index) => (
              <motion.div
                key={`${subject.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSubjectClick(subject.id.toString())}
                className="group relative bg-[#141414] border border-white/5 p-6 rounded-3xl cursor-pointer hover:border-primary/30 transition-all overflow-hidden flex items-center justify-between"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                    {subject.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    <span>Explore Lessons</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* StudyCap Logo UI */}
                <div className="flex flex-col items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                  <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-[8px] font-black text-primary tracking-tighter">STUDYCAP</span>
                </div>

                <div className="absolute bottom-0 left-0 h-1 bg-primary w-0 group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <JoinChannelPopup 
        isOpen={showWhatsAppPopup} 
        onClose={() => setShowWhatsAppPopup(false)} 
        onContinue={() => setShowWhatsAppPopup(false)}
        type="whatsapp"
      />

      <VerificationPopup ref={verificationRef} />
    </main>
  );
}
