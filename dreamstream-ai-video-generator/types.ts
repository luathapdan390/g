
export type AspectRatio = '16:9' | '9:16';
export type Resolution = '720p' | '1080p';

export interface VideoGenerationConfig {
  prompt: string;
  aspectRatio: AspectRatio;
  resolution: Resolution;
}

export interface GeneratedVideo {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  config: VideoGenerationConfig;
}

export enum AppStatus {
  IDLE = 'IDLE',
  CHECKING_KEY = 'CHECKING_KEY',
  NEED_KEY = 'NEED_KEY',
  GENERATING = 'GENERATING',
  ERROR = 'ERROR'
}
