
import { GoogleGenAI, Type } from "@google/genai";
import { WebsiteListing } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getListingAnalysis = async (listing: WebsiteListing): Promise<string> => {
  try {
    const prompt = `Analyze this website listing as a professional digital asset broker. 
    Listing: ${JSON.stringify(listing)}
    Provide a professional summary including:
    1. Investment potential
    2. Main risks
    3. Suggested improvements for the new owner to increase revenue.
    Keep it concise and professional. Use markdown formatting.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "Unable to analyze listing at this time.";
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return "The analyst is currently offline. Please try again later.";
  }
};

export const chatWithAssistant = async (history: { role: string, content: string }[], userMessage: string, context?: WebsiteListing): Promise<string> => {
  try {
    const systemInstruction = `You are the Investment Website Showroom Concierge. Your job is to help potential buyers find the right digital asset to purchase. 
    You are professional, data-driven, and helpful. 
    Current listing context (if any): ${context ? JSON.stringify(context) : 'General browsing'}.
    If asked about price, refer to the listing data. If asked about growth, suggest potential strategies.`;

    const contents = [
      ...history.map(h => ({ 
        role: h.role === 'user' ? 'user' : 'model' as any, 
        parts: [{ text: h.content }] 
      })),
      { role: 'user', parts: [{ text: userMessage }] }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents as any,
      config: {
        systemInstruction,
      }
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini chat error:", error);
    return "Error connecting to assistant. Please check your connection.";
  }
};
