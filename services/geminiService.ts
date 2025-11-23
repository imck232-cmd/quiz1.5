import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuestionType } from "../types";

export const generateQuestionsWithAI = async (
  content: string, 
  count: number = 5,
  selectedTypes: QuestionType[] = ['اختيار من متعدد']
): Promise<Question[]> => {
  try {
    // Initialize GoogleGenAI with process.env.API_KEY as per strict guidelines.
    // We assume the environment variable is properly configured and available.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // تحويل أنواع الأسئلة إلى نص
    const typesStr = selectedTypes.join(", ");

    const prompt = `
      You are an expert educational consultant. Analyze the following content/context and generate ${count} questions in Arabic.
      
      The requested question types are: ${typesStr}.
      
      Content to analyze:
      "${content}"

      Output requirements:
      1. Return ONLY valid JSON.
      2. Strictly follow this schema for each question.
      3. For 'صح / خطأ' (True/False), provide choices as "صح" and "خطأ".
      4. For 'ملء الفراغ' (Fill in blank), put the missing word in brackets in the explanation, and provide choices if applicable or just correct text.
      5. For other types, adapt reasonably to a choice-based structure or text answer.

      Schema:
      [
        {
          "text": "Question text here",
          "type": "One of the requested types",
          "explanation": "Explanation here",
          "choices": [
            { "text": "Choice 1", "isCorrect": boolean },
            { "text": "Choice 2", "isCorrect": boolean }
          ]
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text;

    if (!responseText) {
      throw new Error("No content generated");
    }

    let rawQuestions;
    try {
      const cleanedText = responseText.replace(/```json\n?|```/g, '').trim();
      rawQuestions = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse JSON:", responseText);
      throw new Error("فشل في معالجة استجابة الذكاء الاصطناعي.");
    }
    
    return rawQuestions.map((q: any, index: number) => ({
      id: `ai-q-${Date.now()}-${index}`,
      text: q.text,
      type: q.type || 'اختيار من متعدد', // Fallback type
      explanation: q.explanation || '',
      choices: q.choices ? q.choices.map((c: any, cIdx: number) => ({
        id: `c-${index}-${cIdx}`,
        text: c.text,
        isCorrect: c.isCorrect
      })) : []
    }));

  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("فشل في توليد الأسئلة. يرجى التأكد من مفتاح API والمحاولة مرة أخرى.");
  }
};