
import { GoogleGenAI, Type } from "@google/genai";
import { Task, StudyBlock } from "../types";

export const generateStudyPlan = async (
  subjects: string[],
  availableHours: number,
  tasks: Task[],
  additionalNotes: string = ""
): Promise<StudyBlock[]> => {
  // Fix: Strictly follow SDK guidelines by initializing GoogleGenAI with process.env.API_KEY directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Generate a highly structured 7-day study plan for a student with the following details:
    - Subjects: ${subjects.join(", ")}
    - Available Study Hours per day: ${availableHours}
    - Existing Tasks/Deadlines: ${tasks.map(t => `${t.title} (${t.subject}, Due: ${t.dueDate}, Difficulty: ${t.difficulty})`).join("; ")}
    - Additional Requirements: ${additionalNotes}

    Rules:
    1. Balance the workload across 7 days.
    2. Include breaks (don't schedule more than 90 mins without a gap, but return only the study blocks).
    3. Prioritize tasks with closer due dates and higher difficulty.
    4. Each block should have a specific 'topic' derived from the subjects or tasks.
    5. Ensure the 'day' field is one of: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            studyPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  startTime: { type: Type.STRING, description: "HH:MM format" },
                  endTime: { type: Type.STRING, description: "HH:MM format" },
                  subject: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  durationMinutes: { type: Type.NUMBER }
                },
                required: ["day", "startTime", "endTime", "subject", "topic", "durationMinutes"]
              }
            }
          }
        }
      }
    });

    // Fix: Access response.text directly as a property (not a method) as per SDK guidelines
    const jsonStr = response.text || "{}";
    const result = JSON.parse(jsonStr.trim());
    return (result.studyPlan || []).map((block: any, index: number) => ({
      ...block,
      id: `block-${Date.now()}-${index}`
    }));
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate study plan via AI.");
  }
};
