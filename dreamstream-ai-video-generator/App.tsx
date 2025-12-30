
import React, { useState, useEffect, useCallback } from 'react';
import { AppStatus, VideoGenerationConfig, GeneratedVideo } from './types';
import { generateVideo } from './services/geminiService';
import ApiKeySelection from './components/ApiKeySelection';
import LoadingOverlay from './components/LoadingOverlay';
import PromptInput from './components/PromptInput';
import VideoDisplay from './components/VideoDisplay';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.CHECKING_KEY);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedVideo[]>([]);
  const [currentVideo, setCurrentVideo] = useState<GeneratedVideo | null>(null);

  const checkApiKey = useCallback(async () => {
    try {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (hasKey) {
        setStatus(AppStatus.IDLE);
      } else {
        setStatus(AppStatus.NEED_KEY);
      }
    } catch (e) {
      console.error("Error checking API key status:", e);
      setStatus(AppStatus.NEED_KEY);
    }
  }, []);

  useEffect(() => {
    checkApiKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async (config: VideoGenerationConfig) => {
    setStatus(AppStatus.GENERATING);
    setError(null);

    try {
      const videoUrl = await generateVideo(config);
      const newVideo: GeneratedVideo = {
        id: Math.random().toString(36).substring(7),
        url: videoUrl,
        prompt: config.prompt,
        timestamp: Date.now(),
        config
      };

      setCurrentVideo(newVideo);
      setHistory(prev => [newVideo, ...prev]);
      setStatus(AppStatus.IDLE);
    } catch (err: any) {
      if (err.message === "AUTH_REQUIRED") {
        setStatus(AppStatus.NEED_KEY);
      } else {
        console.error("Generation error:", err);
        setError(err.message || "An unexpected error occurred during generation.");
        setStatus(AppStatus.ERROR);
      }
    }
  };

  if (status === AppStatus.CHECKING_KEY) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === AppStatus.NEED_KEY) {
    return <ApiKeySelection onKeySelected={() => setStatus(AppStatus.IDLE)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      {status === AppStatus.GENERATING && <LoadingOverlay />}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-fuchsia-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h15a3 3 0 003-3v-9a3 3 0 00-3-3h-15zm7 4.5l4.75 3-4.75 3V9z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">DreamStream<span className="text-indigo-500">AI</span></span>
          </div>
          <button 
            // @ts-ignore
            onClick={() => window.aistudio.openSelectKey()}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase font-bold tracking-widest"
          >
            Switch Key
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 space-y-8">
            <section>
              <h2 className="text-3xl font-bold text-white mb-2">Create cinematic videos</h2>
              <p className="text-slate-400 mb-8">
                Harness the power of Gemini Veo 3.1 to generate professional-grade videos from simple text descriptions.
              </p>
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                {/* Accent glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-[60px]"></div>
                
                <PromptInput 
                  onGenerate={handleGenerate} 
                  disabled={status === AppStatus.GENERATING} 
                />

                {status === AppStatus.ERROR && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-400 mt-0.5 shrink-0">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-red-200">
                      <p className="font-semibold mb-1">Generation failed</p>
                      <p className="opacity-80">{error}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {history.length > 0 && (
              <section className="hidden lg:block">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-slate-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recent Creations
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {history.slice(0, 5).map((vid) => (
                    <button
                      key={vid.id}
                      onClick={() => setCurrentVideo(vid)}
                      className={`group relative text-left p-3 rounded-xl border transition-all flex items-center gap-4 ${
                        currentVideo?.id === vid.id 
                          ? 'bg-indigo-600/10 border-indigo-500/50' 
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-16 h-12 bg-slate-800 rounded-lg overflow-hidden shrink-0">
                        <video src={vid.url} className="w-full h-full object-cover opacity-60" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{vid.prompt}</p>
                        <p className="text-xs text-slate-500">
                          {vid.config.aspectRatio} • {vid.config.resolution}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Results Display */}
          <div className="lg:col-span-7">
            {currentVideo ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Preview</h2>
                  <div className="flex items-center gap-2">
                    <span className="flex w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-tighter">Ready</span>
                  </div>
                </div>
                <VideoDisplay video={currentVideo} />
              </div>
            ) : (
              <div className="h-full min-h-[400px] border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 text-slate-700 border border-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Your video will appear here</h3>
                <p className="text-slate-500 max-w-xs leading-relaxed">
                  Enter a prompt on the left to start dreaming. Our AI will transform your words into cinema.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="mt-auto py-12 border-t border-slate-800/50 text-center">
        <p className="text-slate-600 text-sm">
          Powered by Gemini 2.5/3 Veo Models
        </p>
      </footer>
    </div>
  );
};

export default App;
