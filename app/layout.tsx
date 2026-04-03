import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'VIP Study | Premium EdTech Platform',
  description: 'Learn from the best with high-quality courses and interactive lessons.',
};

import SecurityGuard from '@/components/SecurityGuard';
import VerificationPopup from '@/components/VerificationPopup';
import SplashScreen from '@/components/SplashScreen';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <noscript>
          <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#ff0000', fontFamily: 'sans-serif' }}>
            <h1>ACCESS DENIED</h1>
          </div>
        </noscript>
        <SecurityGuard>
          <SplashScreen />
          <VerificationPopup />
          {children}
        </SecurityGuard>
      </body>
    </html>
  );
}
