import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import path from "path";
import fs from "fs";

// Type definition for ffmpegInstaller
const installer = ffmpegInstaller as any;
ffmpeg.setFfmpegPath(installer.path);

const OUTPUT_DIR = path.join(process.cwd(), "public", "outputs");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

export async function mergeVideos(videoUrls: string[], transition: string): Promise<string> {
  const outputFileName = `merged_${generateId()}.mp4`;
  const outputPath = path.join(OUTPUT_DIR, outputFileName);
  
  const tempDir = path.join(process.cwd(), "public", "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    if (!videoUrls || videoUrls.length === 0) {
      return reject(new Error("No videos provided"));
    }
    const cmd = ffmpeg();
    videoUrls.forEach((url) => cmd.addInput(url));

    cmd.mergeToFile(outputPath, tempDir)
      .on("end", () => resolve(`/outputs/${outputFileName}`))
      .on("error", (err) => reject(err));
  });
}

export async function mergeAudioVideo(videoUrl: string, audioUrl: string, audioVolume: number = 1): Promise<string> {
  const outputFileName = `av_${generateId()}.mp4`;
  const outputPath = path.join(OUTPUT_DIR, outputFileName);

  return new Promise((resolve, reject) => {
    const cmd = ffmpeg()
      .addInput(videoUrl)
      .addInput(audioUrl)
      .outputOptions([
        "-c:v copy",
        "-c:a aac",
        "-map 0:v:0",
        "-map 1:a:0",
        "-shortest",
        `-filter:a volume=${audioVolume}`
      ]);
      
    cmd.output(outputPath)
      .on("end", () => resolve(`/outputs/${outputFileName}`))
      .on("error", (err) => reject(err))
      .run();
  });
}

export async function extractAudio(videoUrl: string): Promise<string> {
  const outputFileName = `audio_${generateId()}.mp3`;
  const outputPath = path.join(OUTPUT_DIR, outputFileName);

  return new Promise((resolve, reject) => {
    ffmpeg(videoUrl)
      .noVideo()
      .audioCodec("libmp3lame")
      .output(outputPath)
      .on("end", () => resolve(`/outputs/${outputFileName}`))
      .on("error", (err) => reject(err))
      .run();
  });
}
