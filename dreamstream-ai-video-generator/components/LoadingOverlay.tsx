
import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "Visualizing your concept...",
  "Applying cinematic lighting effects...",
  "Rendering high-quality frames...",
  "Simulating physics and motion...",
  "Almost there, finalizing the export...",
  "Encoding pixels into high-definition...",
  "Synchronizing fluid motion...",
  "Taking a creative breath..."
];

const LoadingOverlay: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="mt-8 text-center px-4">
        <h2 className="text-xl font-medium text-white mb-2">{MESSAGES[messageIndex]}</h2>
        <p className="text-slate-400 text-sm animate-pulse">
          Video generation typically takes 1-2 minutes.
        </p>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-[100px] -z-10"></div>
    </div>
  );
};

export default LoadingOverlay;
