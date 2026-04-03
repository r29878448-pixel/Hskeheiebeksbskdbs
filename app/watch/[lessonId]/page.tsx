'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Lesson } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Maximize, 
  Volume2, 
  VolumeX,
  SkipForward,
  Settings
} from 'lucide-react';

export default function WatchPage() {
  const { lessonId } = useParams();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId');
  const router = useRouter();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch current lesson details (mocking since API doesn't have direct lesson fetch)
        // We actually need to fetch all lessons of the subject to find the current one
        if (subjectId) {
          const targetUrl = `https://kgs-main-api-scamer.vercel.app/lessons/${subjectId}`;
          const res = await fetch(`/api/proxy?url=${encodeURIComponent(targetUrl)}`);
          if (res.ok) {
            const data = await res.json();
            setAllLessons(data);
            const current = data.find((l: Lesson) => l.id.toString() === lessonId);
            setLesson(current || null);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    // Save last watched
    localStorage.setItem('lastWatched', lessonId as string);
  }, [lessonId, subjectId]);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
      
      // Save progress
      const savedProgress = JSON.parse(localStorage.getItem('watchProgress') || '{}');
      savedProgress[lessonId as string] = currentProgress;
      localStorage.setItem('watchProgress', JSON.stringify(savedProgress));
    }
  };

  const skip = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleEnded = () => {
    const currentIndex = allLessons.findIndex(l => l.id.toString() === lessonId);
    if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      router.push(`/watch/${nextLesson.id}?subjectId=${subjectId}`);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-background">Loading player...</div>;
  if (!lesson) return <div className="flex items-center justify-center h-screen bg-background">Lesson not found</div>;

  const isYouTube = lesson.video_url?.includes('youtube.com') || lesson.video_url?.includes('youtu.be');

  return (
    <main className="flex flex-col h-screen bg-black overflow-hidden">
      <Navbar />
      
      <div className="flex-1 relative group bg-black flex items-center justify-center">
        {isYouTube ? (
          <iframe
            src={`${lesson.video_url}?autoplay=1&controls=0&modestbranding=1&rel=0`}
            className="w-full h-full max-h-[80vh] aspect-video"
            allow="autoplay; encrypted-media; fullscreen"
            onLoad={() => setIsPlaying(true)}
          />
        ) : (
          <video
            ref={videoRef}
            src={lesson.video_url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
            className="w-full h-full max-h-[80vh] object-contain"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onClick={togglePlay}
          />
        )}

        <AnimatePresence>
          {showControls && !isYouTube && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-4 md:p-8"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-white hover:text-primary transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                  <span className="font-semibold hidden md:inline">{lesson.name}</span>
                </button>
                <div className="flex items-center gap-4">
                  <Settings className="w-6 h-6 text-white cursor-pointer" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {/* Progress Bar */}
                <div className="relative w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer group/progress">
                  <div 
                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-100" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button onClick={() => skip(-10)} className="text-white hover:text-primary transition-colors">
                      <RotateCcw className="w-6 h-6" />
                    </button>
                    <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform">
                      {isPlaying ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white" />}
                    </button>
                    <button onClick={() => skip(10)} className="text-white hover:text-primary transition-colors">
                      <RotateCw className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2 group/volume">
                      <button onClick={toggleMute} className="text-white">
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                      </button>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        value={volume}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          setVolume(v);
                          if (videoRef.current) videoRef.current.volume = v;
                        }}
                        className="w-0 group-hover/volume:w-20 transition-all duration-300 accent-primary"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <button onClick={handleEnded} className="text-white hover:text-primary transition-colors flex items-center gap-2">
                      <span className="text-sm font-medium hidden md:inline">Next Lesson</span>
                      <SkipForward className="w-6 h-6" />
                    </button>
                    <button className="text-white hover:text-primary transition-colors">
                      <Maximize className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-card p-6 md:px-12">
        <h2 className="text-2xl font-bold">{lesson.name}</h2>
        <p className="text-muted-foreground mt-2">
          You are watching lesson {lessonId} from the subject. Keep learning and growing!
        </p>
      </div>
    </main>
  );
}
