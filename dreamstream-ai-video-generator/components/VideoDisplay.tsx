
import React from 'react';
import { GeneratedVideo } from '../types';

interface VideoDisplayProps {
  video: GeneratedVideo;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({ video }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className={`relative ${video.config.aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16] max-h-[600px] mx-auto'}`}>
        <video
          ref={videoRef}
          src={video.url}
          controls
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <a
            href={video.url}
            download={`dreamstream-${video.id}.mp4`}
            className="p-2 bg-slate-900/60 backdrop-blur-md hover:bg-slate-900/80 rounded-full text-white transition-all border border-white/10"
            title="Download Video"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5M12 3v13.5" />
            </svg>
          </a>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <span>{video.config.resolution}</span>
          <span>•</span>
          <span>{video.config.aspectRatio}</span>
        </div>
        <h3 className="text-white font-medium line-clamp-2 mb-1">{video.prompt}</h3>
        <p className="text-slate-500 text-xs italic">
          Generated on {new Date(video.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default VideoDisplay;
