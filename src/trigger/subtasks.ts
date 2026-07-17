import { task, wait, logger } from "@trigger.dev/sdk/v3";
import prisma from "@/lib/prisma";

export const simulateWebhookTask = task({
  id: "simulate-webhook-task",
  run: async (payload: { url: string; data: any; delaySeconds?: number }) => {
    if (payload.delaySeconds) {
      await wait.for({ seconds: payload.delaySeconds });
    }
    logger.info(`Simulating webhook hit to ${payload.url}`);
    
    const response = await fetch(payload.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload.data)
    });
    
    if (!response.ok) {
      logger.error(`Simulated webhook failed with status ${response.status}`);
    }
    return { success: response.ok };
  }
});

// Reusable mock webhook process with provider fallback
const processMockNodeWebhook = async (dbId: string, resultData: any, providers: { id: string; timeoutSeconds: number }[] = []) => {
  await prisma.nodeExecution.update({
    where: { id: dbId },
    data: { status: "RUNNING" }
  });
  
  if (!providers || providers.length === 0) {
    providers = [{ id: "default", timeoutSeconds: 30 }];
  }

  let finalOutput = null;
  let success = false;
  let usedProvider = "";
  let lastError = null;

  for (const provider of providers) {
    logger.info(`Attempting provider: ${provider.id}`);
    
    // Create a waitable token with timeout
    const token = await wait.createToken({ timeout: `${provider.timeoutSeconds}s` });
    const webhookUrl = token.url;
    
    // Trigger the background task to hit our token URL
    await simulateWebhookTask.trigger({
      url: webhookUrl,
      data: resultData,
      delaySeconds: 5
    });
    
    try {
      const response = await wait.forToken(token.id);

      if (!response.ok) {
        throw new Error(`Webhook timed out or failed: ${response.error?.message}`);
      }

      finalOutput = response.output;
      success = true;
      usedProvider = provider.id;
      break; // Success! Break out of the fallback loop
    } catch (err: any) {
      logger.warn(`Provider ${provider.id} failed: ${err.message}. Trying next provider...`);
      lastError = err;
      // Loop continues to next provider
    }
  }

  if (!success) {
    throw new Error(`All providers failed. Last error: ${lastError?.message}`);
  }
  
  await prisma.nodeExecution.update({
    where: { id: dbId },
    data: { 
      status: "SUCCESS", 
      outputData: finalOutput as any, 
      completedAt: new Date(),
      error: `Executed via provider: ${usedProvider}` // log the successful provider
    }
  });
  
  return finalOutput;
};

import { NODE_REGISTRY } from "@/config/nodeRegistry";

const getProvidersFor = (type: string) => {
  return NODE_REGISTRY.find(d => d.type === type)?.providers || [];
};

export const gptImageTask = task({
  id: "gpt-image-task",
  run: async (payload: { dbId: string, prompt: string, aspectRatio?: string }) => {
    // Generate an image dynamically based on the prompt using pollinations.ai
    const promptStr = payload.prompt || "a beautiful scenic landscape";
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptStr)}?nologo=true&enhance=true`;
    
    return processMockNodeWebhook(payload.dbId, {
      imageUrl: imageUrl
    }, getProvidersFor("GptImageNode"));
  }
});

export const klingTask = task({
  id: "kling-task",
  run: async (payload: { dbId: string, prompt: string, imageUrl?: string }) => {
    return processMockNodeWebhook(payload.dbId, {
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    }, getProvidersFor("KlingNode"));
  }
});

export const openRouterTask = task({
  id: "openrouter-task",
  run: async (payload: { dbId: string, model: string, systemPrompt?: string, prompt: string }) => {
    await prisma.nodeExecution.update({ where: { id: payload.dbId }, data: { status: "RUNNING" } });
    try {
      const messages = [];
      if (payload.systemPrompt) {
        messages.push({ role: "system", content: payload.systemPrompt });
      }
      messages.push({ role: "user", content: payload.prompt });

      let aiResponse = "";
      const apiKey = process.env.OPENROUTER_API_KEY;
      
      if (!apiKey || apiKey === "sk-dummy") {
        // Dummy response rule: echo back something dynamic
        aiResponse = `[Mock Response] I received your prompt about: "${payload.prompt.substring(0, 50)}...". I am an AI assistant and here is a detailed, multi-paragraph mock response. The user requested: ${payload.prompt}`;
      } else {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": "http://localhost:3000", 
            "X-Title": "Galaxy Flow",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: payload.model || "openrouter/auto",
            messages: messages
          })
        });

        if (!response.ok) {
          throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        aiResponse = data.choices?.[0]?.message?.content || "No response received.";
      }
      
      const resultData = { response: aiResponse };
      await prisma.nodeExecution.update({
        where: { id: payload.dbId },
        data: { status: "SUCCESS", outputData: resultData as any, completedAt: new Date() }
      });
      return resultData;
    } catch (err: any) {
      await prisma.nodeExecution.update({
        where: { id: payload.dbId },
        data: { status: "FAILED", error: err.message, completedAt: new Date() }
      });
      throw new Error(`OpenRouter failed: ${err.message}`);
    }
  }
});

import { mergeVideos, mergeAudioVideo, extractAudio } from "@/lib/ffmpeg";

export const mergeVideoTask = task({
  id: "merge-video-task",
  run: async (payload: { dbId: string, videos: string[], transition: string }) => {
    await prisma.nodeExecution.update({ where: { id: payload.dbId }, data: { status: "RUNNING" } });
    try {
      const videoUrl = await mergeVideos(payload.videos, payload.transition || "none");
      const resultData = { videoUrl };
      await prisma.nodeExecution.update({
        where: { id: payload.dbId },
        data: { status: "SUCCESS", outputData: resultData as any, completedAt: new Date() }
      });
      return resultData;
    } catch (err: any) {
      await prisma.nodeExecution.update({
        where: { id: payload.dbId },
        data: { status: "FAILED", error: err.message, completedAt: new Date() }
      });
      throw new Error(`FFmpeg merge failed: ${err.message}`);
    }
  }
});

export const mergeAVTask = task({
  id: "merge-av-task",
  run: async (payload: { dbId: string, videoUrl: string, audioUrl: string, audioVolume?: number }) => {
    await prisma.nodeExecution.update({ where: { id: payload.dbId }, data: { status: "RUNNING" } });
    try {
      const videoUrl = await mergeAudioVideo(payload.videoUrl, payload.audioUrl, payload.audioVolume ?? 1);
      const resultData = { videoUrl };
      await prisma.nodeExecution.update({
        where: { id: payload.dbId },
        data: { status: "SUCCESS", outputData: resultData as any, completedAt: new Date() }
      });
      return resultData;
    } catch (err: any) {
      await prisma.nodeExecution.update({
        where: { id: payload.dbId },
        data: { status: "FAILED", error: err.message, completedAt: new Date() }
      });
      throw new Error(`FFmpeg A/V merge failed: ${err.message}`);
    }
  }
});

export const extractAudioTask = task({
  id: "extract-audio-task",
  run: async (payload: { dbId: string, videoUrl: string }) => {
    await prisma.nodeExecution.update({ where: { id: payload.dbId }, data: { status: "RUNNING" } });
    try {
      const audioUrl = await extractAudio(payload.videoUrl);
      const resultData = { audioUrl };
      await prisma.nodeExecution.update({
        where: { id: payload.dbId },
        data: { status: "SUCCESS", outputData: resultData as any, completedAt: new Date() }
      });
      return resultData;
    } catch (err: any) {
      throw new Error(`FFmpeg extract audio failed: ${err.message}`);
    }
  }
});
