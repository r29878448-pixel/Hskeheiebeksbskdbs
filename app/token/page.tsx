'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SplashScreen from '@/components/SplashScreen';

function TokenHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Save verification data
      const verificationData = {
        token: token,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem('verification_data', JSON.stringify(verificationData));
      
      // Redirect back to home
      router.push('/');
    } else {
      // If no token, redirect to home anyway
      router.push('/');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-xl font-bold text-white">Verifying your access...</h1>
        <p className="text-white/50 text-sm mt-2">Please wait a moment.</p>
      </div>
    </div>
  );
}

export default function TokenPage() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <TokenHandler />
    </Suspense>
  );
}
