
import React from 'react';

interface ApiKeySelectionProps {
  onKeySelected: () => void;
}

const ApiKeySelection: React.FC<ApiKeySelectionProps> = ({ onKeySelected }) => {
  const handleOpenSelectKey = async () => {
    try {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      // Assume success after dialog interaction as per guidelines
      onKeySelected();
    } catch (error) {
      console.error("Error opening key selection:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Set Up API Key</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          The high-quality Veo video model requires a dedicated API key from a paid Google Cloud project. 
          Please select your key to continue.
        </p>
        <div className="space-y-4">
          <button
            onClick={handleOpenSelectKey}
            className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
          >
            Select API Key
          </button>
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            Learn about billing setup
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySelection;
