
import React from 'react';
import { AspectRatio, Resolution, VideoGenerationConfig } from '../types';

interface PromptInputProps {
  onGenerate: (config: VideoGenerationConfig) => void;
  disabled: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, disabled }) => {
  const [prompt, setPrompt] = React.useState('');
  const [aspectRatio, setAspectRatio] = React.useState<AspectRatio>('16:9');
  const [resolution, setResolution] = React.useState<Resolution>('720p');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate({ prompt, aspectRatio, resolution });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Describe your vision
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={disabled}
          placeholder="A futuristic city with flying neon cars at sunset, cinematic lighting, 4k detail..."
          className="w-full h-32 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-white placeholder:text-slate-500 disabled:opacity-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Aspect Ratio
          </label>
          <div className="flex gap-2">
            {(['16:9', '9:16'] as AspectRatio[]).map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => setAspectRatio(ratio)}
                disabled={disabled}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-all ${
                  aspectRatio === ratio
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {ratio === '16:9' ? 'Landscape (16:9)' : 'Portrait (9:16)'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Resolution
          </label>
          <div className="flex gap-2">
            {(['720p', '1080p'] as Resolution[]).map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setResolution(res)}
                disabled={disabled}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-all ${
                  resolution === res
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {res}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={disabled || !prompt.trim()}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-500/10 active:scale-[0.99] flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h15a3 3 0 003-3v-9a3 3 0 00-3-3h-15zm7 4.5l4.75 3-4.75 3V9z" />
        </svg>
        Generate Magic
      </button>
    </form>
  );
};

export default PromptInput;
