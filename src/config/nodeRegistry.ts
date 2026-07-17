import { z } from "zod";

export type NodeCategory = "System" | "Image" | "Video" | "Audio" | "Others";
export type FieldType = "string" | "textarea" | "number" | "boolean" | "select" | "image" | "video" | "audio" | "slider" | "videoArray";

export interface NodeField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { label: string; value: string }[];
  schema: z.ZodTypeAny;
  min?: number;
  max?: number;
  step?: number;
  tab?: string; // If set, only renders when this tab is active
}

export interface NodeDefinition {
  type: string; // The Node type identifier (e.g., "GptImageNode")
  name: string; // Human readable name
  category: NodeCategory;
  description: string;
  icon: string; // Lucide icon name
  baseCost: number; // Cost in credits to run this node
  inputs: NodeField[];
  outputs: NodeField[];
  providers?: { id: string; timeoutSeconds: number }[];
  tabs?: { label: string; value: string }[]; // Optional tabs for segmented controls
}

export const NODE_REGISTRY: NodeDefinition[] = [
  // 1. Core: Request Inputs
  {
    type: "RequestInputsNode",
    name: "Request Inputs",
    category: "System",
    description: "Accepts HTTP request inputs or manual triggers.",
    icon: "PlayCircle",
    baseCost: 0,
    inputs: [
      { name: "payload", label: "Payload JSON", type: "string", schema: z.string().optional() }
    ],
    outputs: [
      { name: "data", label: "Data", type: "string", schema: z.any() }
    ]
  },
  // 2. Core: Response
  {
    type: "ResponseNode",
    name: "Response",
    category: "System",
    description: "Returns the HTTP response data back to the caller.",
    icon: "CheckCircle",
    baseCost: 0,
    inputs: [
      { name: "data", label: "Response Data", type: "string", required: true, schema: z.string().min(1) }
    ],
    outputs: []
  },
  // 3. Stub: GPT-Image-2
  {
    type: "GptImageNode",
    name: "GPT Image 2",
    category: "Image",
    description: "Generates high quality images using GPT-Image-2.",
    icon: "Image",
    baseCost: 5,
    inputs: [
      { name: "prompt", label: "Prompt", type: "string", required: true, schema: z.string().min(1) },
      { name: "size", label: "Size", type: "select", options: [{label: "Auto", value: "auto"}, {label: "1024x1024", value: "1024x1024"}], schema: z.string().default("auto") },
      { name: "quality", label: "Quality", type: "select", options: [{label: "High", value: "high"}, {label: "Standard", value: "standard"}], schema: z.string().default("high") },
      { name: "numImages", label: "Number of Images", type: "select", options: [{label: "1", value: "1"}, {label: "2", value: "2"}, {label: "4", value: "4"}], schema: z.string().default("1") }
    ],
    outputs: [
      { name: "imageUrl", label: "Generated Images", type: "image", schema: z.string().url() }
    ]
  },
  // 4. Stub: Kling v3
  {
    type: "KlingNode",
    name: "Kling v3 Pro",
    category: "Video",
    description: "Generate video from image or text prompt using Kling v3.",
    icon: "Video",
    baseCost: 10,
    tabs: [
      { label: "Text to Video", value: "text" },
      { label: "Image to Video", value: "image" }
    ],
    inputs: [
      // Text to Video Inputs
      { name: "prompt", label: "Prompt", type: "textarea", required: true, tab: "text", schema: z.string().min(1) },
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", options: [{label: "16:9", value: "16:9"}, {label: "1:1", value: "1:1"}, {label: "9:16", value: "9:16"}], tab: "text", schema: z.string().default("16:9") },
      { name: "durationText", label: "Duration", type: "select", options: [{label: "5", value: "5"}, {label: "10", value: "10"}], tab: "text", schema: z.string().default("5") },
      { name: "negativePromptText", label: "Negative Prompt", type: "textarea", tab: "text", schema: z.string().optional() },
      { name: "generateAudio", label: "Generate Audio", type: "boolean", tab: "text", schema: z.boolean().default(false) },
      
      // Image to Video Inputs
      { name: "startFrame", label: "Start Frame", type: "image", required: true, tab: "image", schema: z.string().url() },
      { name: "description", label: "Description", type: "textarea", required: true, tab: "image", schema: z.string().min(1) },
      { name: "durationImage", label: "Duration", type: "select", options: [{label: "5", value: "5"}, {label: "10", value: "10"}], tab: "image", schema: z.string().default("5") },
      { name: "endFrame", label: "End Frame", type: "image", tab: "image", schema: z.string().url().optional() },
      { name: "negativePromptImage", label: "Negative Prompt", type: "textarea", tab: "image", schema: z.string().optional() }
    ],
    outputs: [
      { name: "videoUrl", label: "Generated Video", type: "video", schema: z.string().url() }
    ]
  },
  // 5. OpenRouter LLM
  {
    type: "OpenRouterNode",
    name: "OpenRouter LLM",
    category: "Others",
    description: "Query language models via OpenRouter.",
    icon: "MessageSquare",
    baseCost: 2,
    inputs: [
      { name: "model", label: "Model", type: "select", options: [{label: "Auto (Free)", value: "openrouter/auto"}, {label: "Zephyr 7B (Free)", value: "huggingface/zephyr-7b-beta:free"}], schema: z.string() },
      { name: "systemPrompt", label: "System Prompt", type: "string", schema: z.string().max(2000, "System prompt max 2000 chars").optional() },
      { name: "prompt", label: "User Prompt", type: "string", required: true, schema: z.string().min(1, "Prompt cannot be empty").max(4000, "Prompt max 4000 chars") }
    ],
    outputs: [
      { name: "response", label: "Response", type: "string", schema: z.string() }
    ]
  },
  // 6. FFmpeg: Merge Video
  {
    type: "MergeVideoNode",
    name: "Merge Videos",
    category: "Video",
    description: "Concatenate 2..N videos.",
    icon: "Film",
    baseCost: 3,
    inputs: [
      { name: "videos", label: "Videos", type: "videoArray", required: true, schema: z.array(z.string().url()).min(2, "Minimum 2 videos required").max(10, "Maximum 10 videos allowed") },
      { name: "transition", label: "Transition", type: "select", options: [{label: "none", value: "none"}, {label: "fade", value: "fade"}], schema: z.string().default("none") }
    ],
    outputs: [
      { name: "videoUrl", label: "Merged Video", type: "video", schema: z.string().url() }
    ]
  },
  // 7. FFmpeg: Merge A/V
  {
    type: "MergeAVNode",
    name: "Merge A/V",
    category: "Video",
    description: "Combine video stream and audio stream.",
    icon: "PlusSquare",
    baseCost: 2,
    inputs: [
      { name: "videoUrl", label: "Video", type: "video", required: true, schema: z.string().url() },
      { name: "audioUrl", label: "Audio", type: "audio", required: true, schema: z.string().url() },
      { name: "audioVolume", label: "Audio Volume", type: "slider", min: 0, max: 2, step: 0.1, schema: z.number().default(1) }
    ],
    outputs: [
      { name: "videoUrl", label: "Merged Video", type: "video", schema: z.string().url() }
    ]
  },
  // 8. FFmpeg: Extract Audio
  {
    type: "ExtractAudioNode",
    name: "Extract Audio",
    category: "Audio",
    description: "Extract audio track from a video file.",
    icon: "Mic",
    baseCost: 1,
    inputs: [
      { name: "videoUrl", label: "Video", type: "video", required: true, schema: z.string().url() },
      { name: "format", label: "Format", type: "select", options: [{label: "mp3", value: "mp3"}, {label: "wav", value: "wav"}], schema: z.string().default("mp3") }
    ],
    outputs: [
      { name: "audioUrl", label: "Extracted Audio", type: "audio", schema: z.string().url() }
    ]
  }
];
