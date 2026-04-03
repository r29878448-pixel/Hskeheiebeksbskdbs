'use client';

import React, { useEffect } from 'react';

export default function SecurityGuard({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1. Disable Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Disable Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I (Inspect)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
      }
    };

    // 3. DevTools Detection (Simple version)
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        // DevTools might be open
        document.body.innerHTML = `
          <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #000; color: #ff0000; font-family: sans-serif; text-align: center; padding: 20px;">
            <h1 style="font-size: 4rem; margin-bottom: 20px;">ACCESS DENIED</h1>
            <p style="font-size: 1.5rem; color: #fff; opacity: 0.8;">Developer tools are not allowed on this website.</p>
            <p style="margin-top: 40px; color: #555;">Security measures are active.</p>
          </div>
        `;
        window.location.href = "about:blank";
      }
    };

    // 4. Debugger loop to slow down/crash devtools
    const blockDevTools = () => {
      const start = new Date().getTime();
      // eslint-disable-next-line no-debugger
      debugger;
      const end = new Date().getTime();
      if (end - start > 100) {
        document.body.innerHTML = `
          <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #000; color: #ff0000; font-family: sans-serif; text-align: center; padding: 20px;">
            <h1 style="font-size: 4rem; margin-bottom: 20px;">ACCESS DENIED</h1>
            <p style="font-size: 1.5rem; color: #fff; opacity: 0.8;">Developer tools are not allowed on this website.</p>
            <p style="margin-top: 40px; color: #555;">Security measures are active.</p>
          </div>
        `;
        window.location.href = "about:blank";
      }
    };

    // 5. Disable Print (Ctrl+P)
    const handlePrint = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.keyCode === 80) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handlePrint);
    
    const interval = setInterval(() => {
      detectDevTools();
      blockDevTools();
    }, 500);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, []);

  return <>{children}</>;
}
