import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestionsWithAI = async (topic: string, count: number = 5): Promise<Question[]> => {
  try {
    const prompt = `
      Create ${count} multiple choice questions about "${topic}" in Arabic.
      Focus on educational value suitable for high school students.
      Return ONLY the raw JSON.
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: "The question text in Arabic" },
              choices: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING, description: "The choice text in Arabic" },
                    isCorrect: { type: Type.BOOLEAN, description: "Whether this choice is correct" }
                  },
                  required: ["text", "isCorrect"]
                }
              },
              explanation: { type: Type.STRING, description: "Brief explanation of the correct answer in Arabic" }
            },
            required: ["text", "choices", "explanation"]
          }
        }
      }
    });

    const rawQuestions = JSON.parse(response.text || "[]");
    
    // Map to our internal structure with IDs
    return rawQuestions.map((q: any, index: number) => ({
      id: `ai-q-${Date.now()}-${index}`,
      text: q.text,
      type: 'multiple_choice',
      explanation: q.explanation,
      choices: q.choices.map((c: any, cIdx: number) => ({
        id: `c-${index}-${cIdx}`,
        text: c.text,
        isCorrect: c.isCorrect
      }))
    }));

  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("فشل في توليد الأسئلة. يرجى المحاولة مرة أخرى.");
  }
};
