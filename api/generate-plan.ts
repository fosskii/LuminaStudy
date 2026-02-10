
import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { subjects, availableHours, tasks, additionalNotes, email } = await req.json();

    if (!process.env.API_KEY) {
      return new Response(JSON.stringify({ error: 'Server configuration error: Missing API Key' }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Generate a highly structured 7-day study plan for a student:
      - Subjects: ${subjects.join(", ")}
      - Daily Capacity: ${availableHours} hours
      - Tasks: ${JSON.stringify(tasks)}
      - Notes: ${additionalNotes}

      Return JSON with a 'studyPlan' array of objects: 
      { day, startTime, endTime, subject, topic, durationMinutes }
    `;

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
                  startTime: { type: Type.STRING },
                  endTime: { type: Type.STRING },
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

    const text = response.text;
    return new Response(text, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
