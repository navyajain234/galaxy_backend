import { defineConfig } from "@trigger.dev/sdk/v3";
import { ffmpeg } from "@trigger.dev/build/extensions/core";

export default defineConfig({
  project: "proj_izlmwdfeifqkmpkkxuhe",
  dirs: ["src/trigger"],
  maxDuration: 3600,
  build: {
    extensions: [
      ffmpeg(),
    ],
    external: ["@ffmpeg-installer/ffmpeg"],
  },
});
