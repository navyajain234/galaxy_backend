import { defineConfig } from "@trigger.dev/sdk/v3";
import { aptExtension } from "@trigger.dev/build/extensions/core";

export default defineConfig({
  project: "proj_izlmwdfeifqkmpkkxuhe",
  dirs: ["src/trigger"],
  maxDuration: 3600,
  build: {
    extensions: [
      aptExtension({
        packages: ["ffmpeg"],
      }),
    ],
    external: ["@ffmpeg-installer/ffmpeg"],
  },
});
