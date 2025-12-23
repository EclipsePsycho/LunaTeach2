
import { GoogleGenAI, Type } from "@google/genai";
import { Teacher, StudentPreferences } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const aiService = {
  async getMatchingInsight(prefs: StudentPreferences, topTeachers: Teacher[]): Promise<string> {
    const prompt = `
      You are the "Luna AI Intelligence" for an elite English learning marketplace in Iran.
      A student with the following preferences is looking for a teacher:
      - Goal: ${prefs.goal}
      - Level: ${prefs.level}
      - Style: ${prefs.style}
      - Budget: ${prefs.budget} Tomans
      
      The top matches are: ${topTeachers.map(t => t.name).join(', ')}.
      
      Write a short, professional, and encouraging summary (2-3 sentences) in Persian (Farsi) explaining why these teachers were selected and how they will help the student reach their specific goal. 
      Use a sophisticated, high-end tone. Do not use English words unless necessary.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text || "در حال تحلیل بهترین گزینه‌ها برای شما...";
    } catch (error) {
      console.error("AI Insight Error:", error);
      return "با توجه به اهداف شما، این اساتید بهترین ترکیب تجربه و تخصص را برای پیشرفت سریع شما ارائه می‌دهند.";
    }
  },

  async generateRoadmap(prefs: StudentPreferences, teacher: Teacher): Promise<any> {
    const prompt = `
      Create a 4-week English learning roadmap for a student.
      Student Goal: ${prefs.goal}
      Student Level: ${prefs.level}
      Teacher Style: ${teacher.styles.join(', ')}
      Teacher Philosophy: ${teacher.philosophy}
      
      Return a JSON array of 4 objects. Each object should have:
      - week: number
      - focus: string (in Persian)
      - outcome: string (in Persian)
      
      Tone: Professional and structured. Language: Persian.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                week: { type: Type.INTEGER },
                focus: { type: Type.STRING },
                outcome: { type: Type.STRING }
              },
              required: ["week", "focus", "outcome"]
            }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    } catch (error) {
      console.error("Roadmap Generation Error:", error);
      return [
        { week: 1, focus: "ارزیابی اولیه و تعیین نقاط قوت", outcome: "تدوین برنامه دقیق آموزشی" },
        { week: 2, focus: "تمرکز بر مهارت‌های پایه مکالمه", outcome: "افزایش اعتماد به نفس در صحبت" },
        { week: 3, focus: "ساختاربندی جملات پیچیده", outcome: "بهبود دقت دستوری در بیان" },
        { week: 4, focus: "شبیه‌سازی موقعیت‌های واقعی", outcome: "آمادگی برای استفاده کاربردی از زبان" }
      ];
    }
  }
};
