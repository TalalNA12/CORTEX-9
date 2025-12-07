import { GoogleGenAI, Chat } from "@google/genai";
import { CORTEX_SYSTEM_PROMPT } from "../types";

let chatSession: Chat | null = null;
let aiInstance: GoogleGenAI | null = null;

const getAIInstance = (): GoogleGenAI => {
  if (!aiInstance) {
    // This value is injected by vite.config.ts from your .env file
    const apiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey.includes("PASTE_YOUR") || apiKey.length < 10) {
      console.error("CRITICAL ERROR: API KEY INVALID.");
      console.error("Expected '.env' file to contain: API_KEY=AIzaSy...");
      throw new Error("API_KEY_MISSING");
    }
    
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const initializeChatSession = (): Chat => {
  try {
    const ai = getAIInstance();
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: CORTEX_SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });
    return chatSession;
  } catch (error) {
    console.error("FAILED TO INIT SESSION:", error);
    throw error;
  }
};

export const sendMessageToCortex = async (message: string): Promise<string> => {
  if (!chatSession) {
    try {
        initializeChatSession();
    } catch (e) {
        return `[!] SYSTEM FAILURE: API KEY NOT DETECTED.\n\n1. Open the file named \`.env\`\n2. Ensure it contains: \`API_KEY=AIzaSy...\`\n3. Restart the terminal (\`Ctrl+C\` then \`npm run dev\`).`;
    }
  }
  
  try {
    if (!chatSession) {
        throw new Error("Session initialization failed");
    }
    const result = await chatSession.sendMessage({ message });
    return result.text || "";
  } catch (error) {
    console.error("CORTEX-9 CONNECTION FAILURE:", error);
    
    try {
        initializeChatSession();
        if(chatSession) {
             const retryResult = await chatSession.sendMessage({ message });
             return retryResult.text || "";
        }
    } catch(retryError) {
         // Ignore retry error
    }

    return `[!] CRITICAL ERROR: UPLINK FAILED. \n\nERR_MSG: ${error instanceof Error ? error.message : "UNKNOWN"}`;
  }
};