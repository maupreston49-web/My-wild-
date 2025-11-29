
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION_TRAINER, SYSTEM_INSTRUCTION_CHAT, SYSTEM_INSTRUCTION_COACH } from "../constants";
import { DailyRhythm, DogProfile, Source } from "../types";

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

// Helper to extract sources from grounding metadata
const extractSources = (response: any): Source[] => {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources: Source[] = [];
  
  chunks.forEach((chunk: any) => {
    if (chunk.web) {
      sources.push({
        title: chunk.web.title || "Source",
        uri: chunk.web.uri
      });
    }
  });

  // Deduplicate sources by URI
  const uniqueSources = new Map();
  sources.forEach(s => uniqueSources.set(s.uri, s));
  return Array.from(uniqueSources.values());
};

export const generateDailyRhythm = async (dog: DogProfile): Promise<DailyRhythm | null> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  // Random seed to force variety
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
    1. Use Google Search to find specific behavioral traits, working history, and training needs for the ${dog.breed} breed.
    2. Incorporate these specific traits into the "Daily Rhythm" plan below.
    3. Return ONLY a valid JSON object. Do not include markdown formatting or extra text.
    
    JSON STRUCTURE REQUIRED:
    {
      "theme": "A unique, rugged name for the plan",
      "motto": "A short punchy quote",
      "ritual": { "title": "Morning activity name", "duration": "Time", "activity": "Specific instructions", "vibe": "Mood" },
      "work": { "title": "Main event name", "duration": "Time", "activity": "Specific instructions", "vibe": "Mood" },
      "peace": { "title": "Evening activity name", "duration": "Time", "activity": "Specific instructions", "vibe": "Mood" }
    }
  `;

  try {
    // Using gemini-2.5-flash with googleSearch for fast, grounded results
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        systemInstruction: SYSTEM_INSTRUCTION_TRAINER,
        temperature: 0.7, // Controlled creativity for valid JSON
      }
    });

    const text = response.text;
    if (text) {
      try {
        const parsedRhythm = JSON.parse(cleanJSON(text)) as DailyRhythm;
        // Attach grounding sources if available
        parsedRhythm.sources = extractSources(response);
        return parsedRhythm;
      } catch (e) {
        console.error("Failed to parse Rhythm JSON", e);
        // Fallback or retry logic could go here
      }
    }
  } catch (error) {
    console.error("Rhythm generation failed:", error);
    return null;
  }
  
  return null;
};

export const chatWithWildcord = async (message: string, history: {role: string, parts: {text: string}[]}[]): Promise<{ text: string, sources?: Source[] }> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  try {
    // Generate content with googleSearch tool for up-to-date info
    // We construct the history manually for generateContent as 'chat' helper with tools can be complex to manage state
    // converting chat history to Content format
    const contents = [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_CHAT,
        tools: [{googleSearch: {}}],
      }
    });

    return {
        text: response.text || "Silence... try again.",
        sources: extractSources(response)
    };

  } catch (error) {
    console.error("Chat error:", error);
    return { text: "The radio silence is deafening. Check your connection." };
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
