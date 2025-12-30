
import { GoogleGenAI } from "@google/genai";
import { VideoGenerationConfig } from "../types";

export const generateVideo = async (config: VideoGenerationConfig): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: config.prompt,
      config: {
        numberOfVideos: 1,
        resolution: config.resolution,
        aspectRatio: config.aspectRatio
      }
    });

    // Polling logic
    while (!operation.done) {
      // Reassuring delay
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      // We must create a new instance or reuse existing one to poll
      // Using the operation handle
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if (!operation.response?.generatedVideos?.[0]?.video?.uri) {
      throw new Error("Video generation failed: No URI returned.");
    }

    const downloadLink = operation.response.generatedVideos[0].video.uri;
    
    // Fetch the video data as a blob because the direct link might require authentication/API key
    const response = await fetch(`${downloadLink}&key=${process.env.GEMINI_API_KEY}`);
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error: any) {
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("AUTH_REQUIRED");
    }
    console.error("Video generation error:", error);
    throw error;
  }
};
