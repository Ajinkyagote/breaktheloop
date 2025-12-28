
import { GoogleGenAI, Type } from "@google/genai";
import { 
  ActionPlanResponse, 
  UserProfile, 
  ProficiencyLevel, 
  ReadinessProfile, 
  UserAnswer, 
  DiagnosisReport,
  AssessmentQuestion,
  BenchmarkTask,
  BenchmarkResponse,
  MentorSessionBrief
} from "../types";

const FAST_MODEL = 'gemini-3-flash-preview';
const PRIMARY_MODEL = 'gemini-3-pro-preview';

const retryOperation = async <T>(
  operation: () => Promise<T>, 
  maxRetries: number = 3, 
  delay: number = 2000
): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    const isRateLimit = error?.status === 429 || error?.code === 429 || error?.message?.includes('429') || error?.message?.includes('quota') || error?.status === 'RESOURCE_EXHAUSTED';
    if (maxRetries > 0 && isRateLimit) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryOperation(operation, maxRetries - 1, delay * 2);
    }
    throw error;
  }
};

const safeParseJSON = (text: string) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanText = jsonMatch ? jsonMatch[0] : text;
    return JSON.parse(cleanText);
  } catch (e) {
    throw new Error("Failed to parse project recommendations. Please try again.");
  }
};

export const generateLevelActionPlan = async (
  userProfile: UserProfile
): Promise<ActionPlanResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const levelDirectives = {
    1: "Suggest 3 projects focused EXCLUSIVELY on UI CLONING (e.g., Facebook Frontend Clone, Spotify UI). No backend logic. Use HTML, CSS, and basic JS.",
    2: "Suggest 3 projects focused on FULLSTACK functionality (e.g., Social Media with Auth, Task Manager with DB). Must have a working Backend and responsive Frontend.",
    3: "Suggest 3 projects focused on CLOUD DEPLOYMENT and scaling (e.g., Deploying to AWS with Docker, CI/CD Pipeline Setup). Focus on production readiness and infrastructure."
  };

  const prompt = `
    Act as a Senior Tech Lead. Generate a project action plan for a student.
    Domain: ${userProfile.domain}
    Level: ${userProfile.currentLevel}
    Directive: ${levelDirectives[userProfile.currentLevel as ProficiencyLevel]}
    Goal: ${userProfile.goal}

    Return a JSON object exactly matching this structure:
    {
      "currentLevel": ${userProfile.currentLevel},
      "levelTitle": "Phase Name",
      "summary": "Short explanation of why these projects are chosen for this level.",
      "roadmap": {
        "level": ${userProfile.currentLevel},
        "title": "Primary Technical Focus",
        "description": "Short pathway description",
        "curriculum": [{ "topic": "Key Skill", "subtopics": ["Concept A", "Concept B"] }],
        "projects": [
          {
            "id": "p1",
            "title": "Project Name (e.g. Facebook UI Clone)",
            "description": "What exactly the user needs to build.",
            "techStack": ["HTML", "Tailwind"],
            "requirements": ["Requirement 1", "Requirement 2"]
          }
        ],
        "advancedTasks": ["Bonus Challenge 1"]
      }
    }
  `;

  return retryOperation(async () => {
    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json"
      }
    });

    return safeParseJSON(response.text);
  });
};

export const generateDiagnosis = async (profile: ReadinessProfile, history: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze: ${JSON.stringify(profile)}. Output JSON with summary, gapAnalysis, priorities (array), avoidForNow (array), positioningStatement, distanceFromGoal.`;
  return retryOperation(async () => {
    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return safeParseJSON(response.text);
  });
};

export const getNextQuestion = async (history: UserAnswer[], profile: UserProfile) => {
  if (history.length >= 10) return { question: null, isComplete: true };
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Adaptive Question for ${profile.domain} aiming for ${profile.goal}. History: ${JSON.stringify(history)}. Output JSON.`;
  return retryOperation(async () => {
    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return { question: safeParseJSON(response.text), isComplete: false };
  });
};

export const analyzeSession = async (history: UserAnswer[], profile: UserProfile) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze technical session: ${JSON.stringify(history)}. Output JSON Readiness Profile.`;
  return retryOperation(async () => {
    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return safeParseJSON(response.text);
  });
};

export const getBenchmarkTasks = async (history: any, profile: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `3 Industry Benchmark Tasks for ${profile.domain}. Output JSON Array.`;
  return retryOperation(async () => {
    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return safeParseJSON(response.text);
  });
};

export const evaluateBenchmarkGap = async (profile: any, responses: any, user: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Evaluate benchmark responses: ${JSON.stringify(responses)}. Output JSON with positioning and gapClarity.`;
  return retryOperation(async () => {
    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return safeParseJSON(response.text);
  });
};

export const generateMentorBrief = async (profile: any, user: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Mentor brief for student profile. Output JSON.`;
  return retryOperation(async () => {
    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return safeParseJSON(response.text);
  });
};

export const streamAssistantChat = async (messages: any[], context: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return await ai.models.generateContentStream({
    model: FAST_MODEL,
    contents: {
      parts: [{ text: `You are LIA assistant. Context: ${JSON.stringify(context)}. Messages: ${JSON.stringify(messages)}` }]
    }
  });
};
