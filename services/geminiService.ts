
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

const PRIMARY_MODEL = 'gemini-3-pro-preview';
const FAST_MODEL = 'gemini-3-flash-preview';

export const generateLevelActionPlan = async (
  userProfile: UserProfile
): Promise<ActionPlanResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Act as a Senior Product Architect and Learning Designer. 
    Generate a highly specific, production-ready curriculum and project roadmap for a student at Level ${userProfile.currentLevel} in the domain: ${userProfile.domain}.

    LEVEL CONTEXT:
    Level 1: Foundational. Knowledge of HTML/CSS/JS. Needs 3 beginner-to-intermediate projects.
    Level 2: Intermediate/MERN. Knowledge of React/Node. Needs 3 complex projects (e.g., Whiteboard, LMS). Focus on responsive design and cloud deployment.
    Level 3: Advanced/Job Ready. Knowledge of full-stack. Focus on CI/CD, Docker, and industrial architecture.

    USER DATA:
    - Target Goal: ${userProfile.goal}
    - Skills: ${JSON.stringify(userProfile.skills)}

    TASK:
    1. Define a "levelTitle" and "summary".
    2. Create a "roadmap" object containing:
       - curriculum: A list of 4-5 core topics with subtopics.
       - projects: Exactly 3 project suggestions with title, description, tech stack, and 3-4 specific requirements.
       - advancedTasks: Specific requirements for the level (Level 2: Cloud/Responsive, Level 3: Docker/CI-CD).

    Output must be JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: PRIMARY_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            currentLevel: { type: Type.NUMBER },
            levelTitle: { type: Type.STRING },
            summary: { type: Type.STRING },
            roadmap: {
              type: Type.OBJECT,
              properties: {
                level: { type: Type.NUMBER },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                curriculum: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      topic: { type: Type.STRING },
                      subtopics: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                  }
                },
                projects: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                      requirements: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                  }
                },
                advancedTasks: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Plan Generation Error:", error);
    throw error;
  }
};

export const generateDiagnosis = async (
  profile: ReadinessProfile,
  history: any[]
): Promise<DiagnosisReport['geminiInsight']> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze this student readiness profile: ${JSON.stringify(profile)}. Provide a gap analysis, action priorities, what to avoid for now, a positioning statement, and distance from goal. Output JSON.`;
  
  const response = await ai.models.generateContent({
    model: PRIMARY_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          gapAnalysis: { type: Type.STRING },
          priorities: { type: Type.ARRAY, items: { type: Type.STRING } },
          avoidForNow: { type: Type.ARRAY, items: { type: Type.STRING } },
          positioningStatement: { type: Type.STRING },
          distanceFromGoal: { type: Type.STRING },
        },
        required: ["summary", "gapAnalysis", "priorities", "avoidForNow", "positioningStatement", "distanceFromGoal"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const getNextQuestion = async (
  history: UserAnswer[],
  profile: UserProfile
): Promise<{ question: AssessmentQuestion | null; isComplete: boolean }> => {
  if (history.length >= 10) return { question: null, isComplete: true };

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Generate one adaptive technical question for a student in ${profile.domain} aiming for ${profile.goal}. History: ${JSON.stringify(history)}. Output JSON.`;
  
  const response = await ai.models.generateContent({
    model: FAST_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING },
          dimension: { type: Type.STRING },
          layer: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                isCorrect: { type: Type.BOOLEAN }
              }
            }
          }
        },
        required: ["id", "text", "dimension", "layer", "options"]
      }
    }
  });
  
  return { 
    question: JSON.parse(response.text.trim()) as AssessmentQuestion, 
    isComplete: false 
  };
};

export const analyzeSession = async (
  history: UserAnswer[],
  profile: UserProfile
): Promise<ReadinessProfile> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze these answers: ${JSON.stringify(history)}. Generate a readiness profile for ${profile.name}. Output JSON.`;
  
  const response = await ai.models.generateContent({
    model: FAST_MODEL, // Switched to FAST_MODEL for speed
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          studentId: { type: Type.STRING },
          timestamp: { type: Type.NUMBER },
          dimensions: {
            type: Type.OBJECT,
            properties: {
              concepts: { type: Type.NUMBER },
              application: { type: Type.NUMBER },
              problemSolving: { type: Type.NUMBER },
              technicalFluency: { type: Type.NUMBER },
              discipline: { type: Type.NUMBER },
              selfAwareness: { type: Type.NUMBER }
            }
          },
          status: { type: Type.STRING },
          benchmarks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                matchPercentage: { type: Type.NUMBER }
              }
            }
          }
        },
        required: ["studentId", "timestamp", "dimensions", "status", "benchmarks"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const getBenchmarkTasks = async (
  history: UserAnswer[],
  profile: UserProfile
): Promise<BenchmarkTask[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Generate 3 industry benchmark scenarios for ${profile.domain}. Output JSON.`;
  
  const response = await ai.models.generateContent({
    model: FAST_MODEL, // Switched to FAST_MODEL for speed
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            scenario: { type: Type.STRING },
            task: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  level: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const evaluateBenchmarkGap = async (
  profile: ReadinessProfile,
  responses: BenchmarkResponse[],
  userProfile: UserProfile
): Promise<{ positioning: string; gapClarity: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Evaluate benchmark responses: ${JSON.stringify(responses)}. Current profile: ${JSON.stringify(profile)}. Goal: ${userProfile.goal}. Output JSON with "positioning" and "gapClarity".`;
  
  const response = await ai.models.generateContent({
    model: FAST_MODEL, // Switched to FAST_MODEL for speed
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          positioning: { type: Type.STRING },
          gapClarity: { type: Type.STRING }
        },
        required: ["positioning", "gapClarity"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const generateMentorBrief = async (
  profile: ReadinessProfile,
  user: UserProfile
): Promise<MentorSessionBrief> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Generate a mentor brief based on this profile: ${JSON.stringify(profile)}. User: ${JSON.stringify(user)}. Output JSON.`;
  
  const response = await ai.models.generateContent({
    model: PRIMARY_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          discussionTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedDuration: { type: Type.STRING },
          expectedOutcomes: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["summary", "discussionTopics", "suggestedDuration", "expectedOutcomes"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const streamAssistantChat = async (
  messages: any[],
  context: { profile: ReadinessProfile | null; plan: ActionPlanResponse | null; user: UserProfile | null }
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContentStream({
    model: PRIMARY_MODEL,
    contents: {
      parts: [
        { text: `You are LIA, a Learning Intelligence Assistant. Context: ${JSON.stringify(context)}. Messages: ${JSON.stringify(messages)}` }
      ]
    }
  });
  return response;
};
