import { Unkey } from "@unkey/api";

export const unkey = new Unkey({ rootKey: process.env.UNKEY_ROOT_KEY || "" });

export async function verifyApiKey(key: string) {
  try {
    const response = await unkey.keys.verifyKey({ key });
    
    if (!response.data.valid) {
      return { valid: false, error: "Invalid API key" };
    }

    return { valid: true, ownerId: response.data.identity?.id, meta: response.data.meta };
  } catch (error) {
    console.error("Unkey Error:", error);
    return { valid: false, error: "Internal error verifying API key" };
  }
}
