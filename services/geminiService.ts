
import { Task, StudyBlock } from "../types";

export const generateStudyPlan = async (
  subjects: string[],
  availableHours: number,
  tasks: Task[],
  additionalNotes: string = "",
  userEmail: string = ""
): Promise<StudyBlock[]> => {
  try {
    const response = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subjects,
        availableHours,
        tasks,
        additionalNotes,
        email: userEmail
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate plan');
    }

    const result = await response.json();
    return (result.studyPlan || []).map((block: any, index: number) => ({
      ...block,
      id: `block-${Date.now()}-${index}`
    }));
  } catch (error: any) {
    console.error("API Error:", error);
    throw new Error(error.message || "Failed to generate study plan via AI Assistant.");
  }
};
