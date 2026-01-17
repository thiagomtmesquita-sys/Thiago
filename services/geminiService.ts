
import { GoogleGenAI, Type } from "@google/genai";
import { AI_SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private ai: any;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateChatResponse(history: { role: 'user' | 'model', parts: { text: string }[] }[], prompt: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction: AI_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
      return response.text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Desculpe, tive um problema técnico. Por favor, tente enviar sua mensagem diretamente pelo WhatsApp.";
    }
  }

  async createSummary(conversation: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Com base na conversa abaixo, crie um resumo profissional e conciso para ser lido por um advogado: \n\n${conversation}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING, description: "Resumo do caso" },
              urgency: { type: Type.STRING, enum: ["baixa", "média", "alta"] },
              area: { type: Type.STRING, description: "Área provável do direito" }
            },
            required: ["summary", "urgency", "area"]
          }
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Summary Error:", error);
      return { summary: conversation.slice(0, 500), urgency: "média", area: "Geral" };
    }
  }
}

export const geminiService = new GeminiService();
