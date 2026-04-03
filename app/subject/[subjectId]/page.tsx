'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Lesson } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { LessonSkeleton } from '@/components/Skeletons';
import VerificationPopup, { VerificationPopupRef } from '@/components/VerificationPopup';
import { motion } from 'motion/react';
import { ChevronLeft, Play, Clock, CheckCircle2, Plus } from 'lucide-react';

export default function SubjectPage() {
  const { subjectId } = useParams();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchedLessons, setWatchedLessons] = useState<string[]>([]);
  const verificationRef = useRef<VerificationPopupRef>(null);

  useEffect(() => {
    async function fetchLessons() {
      try {
        const targetUrl = `https://kgs-main-api-scamer.vercel.app/lessons/${subjectId}`;
        const res = await fetch(`/api/proxy?url=${encodeURIComponent(targetUrl)}`);
        if (!res.ok) throw new Error('Failed to fetch lessons');
        const data = await res.json();
        setLessons(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchLessons();

    // Load progress
    const progress = localStorage.getItem('watchProgress');
    if (progress) {
      const parsed = JSON.parse(progress);
      setWatchedLessons(Object.keys(parsed));
    }
  }, [subjectId]);

  const handleLessonClick = (lessonId: string) => {
    if (verificationRef.current?.checkStatus()) {
      router.push(`/watch/${lessonId}?subjectId=${subjectId}`);
    } else {
      verificationRef.current?.open();
    }
  };

  const handleCreateContent = () => {
    if (verificationRef.current?.checkStatus()) {
      alert('Content creation feature coming soon!');
    } else {
      verificationRef.current?.open();
    }
  };

  return (
    <main className="flex-1">
      <Navbar />
      
      <div className="max-w-4xl mx-auto">
        <div className="px-4 py-6 md:px-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Subjects</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold font-display"
              >
                Subject <span className="text-primary">Lessons</span>
              </motion.h1>
              <p className="text-muted-foreground mt-2">
                {lessons.length} lessons available in this subject.
              </p>
            </div>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleCreateContent}
              className="flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 px-6 py-3 rounded-2xl text-primary font-bold text-sm transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Content</span>
            </motion.button>
          </div>
        </div>

        {loading ? (
          <LessonSkeleton />
        ) : error ? (
          <div className="p-8 text-center text-destructive">{error}</div>
        ) : lessons.length === 0 ? (
          <div className="p-20 text-center text-muted-foreground">No lessons found for this subject.</div>
        ) : (
          <div className="space-y-2 p-3 md:p-8">
            {lessons.map((lesson, index) => {
              const isWatched = watchedLessons.includes(lesson.id.toString());
              return (
                <motion.div
                  key={`${lesson.id}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleLessonClick(lesson.id.toString())}
                  className="group flex items-center gap-4 bg-card/40 hover:bg-card border border-border hover:border-primary/30 p-4 rounded-xl cursor-pointer transition-all"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                      {lesson.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.duration || '15:00'}
                      </span>
                      {isWatched && (
                        <span className="flex items-center gap-1 text-emerald-500 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Completed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-5 h-5 text-primary fill-primary" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <VerificationPopup ref={verificationRef} />
    </main>
  );
}
