
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION_TRAINER, SYSTEM_INSTRUCTION_CHAT, SYSTEM_INSTRUCTION_COACH } from "../constants";
import { DailyRhythm, DogProfile } from "../types";

// Helper to check API key inside functions to prevent module-level crash
const getApiKey = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables");
    throw new Error("API_KEY is missing");
  }
  return apiKey;
};

// Helper to clean JSON output from AI (removes markdown code blocks)
const cleanJSON = (text: string): string => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

// Schema definition reused for generation attempts
const DAILY_RHYTHM_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    theme: { type: Type.STRING, description: "A unique, rugged name for today's plan (e.g. 'Operation: Concrete Jungle' or 'The Wet Weather Protocol')" },
    motto: { type: Type.STRING, description: "A short, punchy thought for the human." },
    ritual: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Name of the morning activity" },
        duration: { type: Type.STRING },
        activity: { type: Type.STRING, description: "Specific instructions. Not generic." },
        vibe: { type: Type.STRING, description: "Mood: e.g. Laser Focus, Calm Control" }
      }
    },
    work: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        duration: { type: Type.STRING },
        activity: { type: Type.STRING, description: "The main event. Highly specific to breed/environment." },
        vibe: { type: Type.STRING }
      }
    },
    peace: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        duration: { type: Type.STRING },
        activity: { type: Type.STRING },
        vibe: { type: Type.STRING }
      }
    }
  }
};

export const generateDailyRhythm = async (dog: DogProfile): Promise<DailyRhythm | null> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  // Random seed to force variety and break semantic caching
  const missionSeed = Math.floor(Math.random() * 10000);

  const prompt = `
    MISSION ID: ${missionSeed}
    
    TARGET PROFILE:
    Name: ${dog.name}
    Specs: ${dog.age}, ${dog.breed}
    Engine: ${dog.energy} Energy
    
    OPERATIONAL ENVIRONMENT:
    Terrain: ${dog.environment}
    Time Window: ${dog.timeAvailable}
    
    DIRECTIVES:
    Generate a highly specific, non-repetitive Daily Rhythm.
    1. Morning Ritual: Low effort for human, high engagement for dog.
    2. The Work: High intensity outlet. If time is short, increase mental load.
    3. The Peace: Decompression.
    
    CONSTRAINTS:
    - Do NOT use generic terms like "walk around the block".
    - Create a unique "Theme" name based on the specific breed/environment combo.
    - If the dog is high energy and time is short, prescribe intense mental work.
  `;

  try {
    try {
      // Attempt 1: High-End Reasoning (Gemini 3 Pro)
      // Using higher temperature for creativity/variety
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION_TRAINER,
            responseMimeType: "application/json",
            responseSchema: DAILY_RHYTHM_SCHEMA,
            temperature: 1.2, // Increased for variety
            topK: 40,
        }
      });
      const text = response.text;
      if (text) return JSON.parse(cleanJSON(text)) as DailyRhythm;
    } catch (primaryError) {
      console.warn("Gemini 3 Pro unavailable (likely quota), falling back to Flash.", primaryError);
      
      // Attempt 2: High-Speed/Stability (Gemini 2.5 Flash)
      // Flash supports thinkingConfig for better reasoning.
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION_TRAINER,
            thinkingConfig: { thinkingBudget: 2048 },
            responseMimeType: "application/json",
            responseSchema: DAILY_RHYTHM_SCHEMA,
            temperature: 1.0, // Slightly higher than default
        }
      });
      const text = response.text;
      if (text) return JSON.parse(cleanJSON(text)) as DailyRhythm;
    }
  } catch (finalError) {
    console.error("All rhythm generation attempts failed:", finalError);
    return null;
  }
  
  return null;
};

export const chatWithWildcord = async (message: string, history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash', // Flash is faster for real-time chat
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_CHAT,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text || "Silence... try again.";
  } catch (error) {
    console.error("Chat error:", error);
    return "The radio silence is deafening. Check your connection.";
  }
};

export const submitCheckIn = async (notes: string, stats: { label: string; value: string }[]): Promise<string> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const statsString = stats.map(s => `${s.label}: ${s.value}`).join(', ');
  const prompt = `
    Player Check-In Report:
    Stats for this period: ${statsString}
    
    Player Notes/Struggles:
    "${notes}"
    
    Provide your critique, Coach.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_COACH,
      }
    });
    return response.text || "Check-in received. Keep moving.";
  } catch (error) {
    console.error("Check-in error:", error);
    return "Unable to process check-in. Server comms down.";
  }
};
