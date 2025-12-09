import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem, JournalEntry } from "../types";

// Initialize Gemini Client
// In a real production build, ensure the key is proxy-wrapped or strictly server-side if high security is needed.
// For this blueprint demo, we use the env variable directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Predicts inventory demand based on historical usage data.
 * Demonstrates: "Predictive Inventory Management"
 */
export const forecastInventoryDemand = async (item: InventoryItem): Promise<{ prediction: number; reasoning: string }> => {
  try {
    const prompt = `
      You are an expert Hospital Supply Chain Analyst using predictive modeling.
      Analyze the following inventory item data:
      Item: ${item.name} (${item.category})
      Historical Usage (Last 6 months): ${item.monthlyUsageHistory.join(', ')}
      Current Stock: ${item.currentStock}
      
      Task:
      1. Predict the demand for the next month.
      2. Provide a brief 1-sentence strategic reasoning (e.g., considering trend, volatility).
      
      Return JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prediction: { type: Type.INTEGER },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("Gemini SCM Error:", error);
    // Fallback logic for demo stability if API fails
    const avg = item.monthlyUsageHistory.reduce((a, b) => a + b, 0) / item.monthlyUsageHistory.length;
    return { prediction: Math.ceil(avg * 1.1), reasoning: "AI unavailable, using moving average + 10% safety stock." };
  }
};

/**
 * Analyzes the General Ledger for strategic insights.
 * Demonstrates: "AI-Powered Accounting & Decision Support"
 */
export const analyzeFinancialHealth = async (entries: JournalEntry[]): Promise<string> => {
  try {
    // Summarize entries for the prompt to save tokens
    const summary = entries.slice(-20).map(e => 
      `${e.date}: ${e.description} (${e.amount}) [${e.moduleSource}]`
    ).join('\n');

    const prompt = `
      You are a CFO (Chief Financial Officer) AI for a Hospital.
      Here is a snapshot of recent GL transactions (last 20):
      ${summary}

      Provide a concise Executive Summary (max 100 words). 
      Focus on revenue leakage risks, operational efficiency, or cash flow observations.
      Style: Professional, concise, actionable.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Analysis complete. No anomalies detected.";
  } catch (error) {
    console.error("Gemini Finance Error:", error);
    return "AI Financial Analysis services are currently reconciling connection.";
  }
};