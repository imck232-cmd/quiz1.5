import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

// Ensure process is defined for TypeScript context, as Vite replaces process.env.API_KEY during build
declare const process: { env: { API_KEY: string } };

export const generateQuestionsWithAI = async (topic: string, count: number = 5): Promise<Question[]> => {
  try {
    // Retrieve the API key exclusively from process.env.API_KEY as per guidelines
    // Vite config replaces this string with the actual key value during build
    const apiKey = process.env.API_KEY;

    // Diagnostic logging (safe, only logs presence)
    console.log(`[Gemini Service] Initializing with key present: ${!!apiKey}`);

    if (!apiKey) {
      throw new Error("مفتاح API غير موجود. يرجى التأكد من إعداد API_KEY في إعدادات البيئة.");
    }

    // Lazy initialization: Create the client only when the function is called
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Create ${count} multiple choice questions about "${topic}" in Arabic.
      Focus on educational value suitable for high school students.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              explanation: { type: Type.STRING },
              choices: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    isCorrect: { type: Type.BOOLEAN }
                  },
                  required: ["text", "isCorrect"]
                }
              }
            },
            required: ["text", "choices"]
          }
        }
      }
    });

    const responseText = response.text;

    if (!responseText) {
      throw new Error("No content generated");
    }

    let rawQuestions;
    try {
      rawQuestions = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse JSON:", responseText);
      throw new Error("فشل في معالجة استجابة الذكاء الاصطناعي.");
    }
    
    // Map to our internal structure with IDs
    return rawQuestions.map((q: any, index: number) => ({
      id: `ai-q-${Date.now()}-${index}`,
      text: q.text,
      type: 'multiple_choice',
      explanation: q.explanation || '',
      choices: q.choices.map((c: any, cIdx: number) => ({
        id: `c-${index}-${cIdx}`,
        text: c.text,
        isCorrect: c.isCorrect
      }))
    }));

  } catch (error) {
    console.error("Gemini AI Error:", error);
    // Provide a user-friendly error message
    throw new Error("فشل في توليد الأسئلة. يرجى التأكد من مفتاح API والمحاولة مرة أخرى.");
  }
};