
export type ProficiencyLevel = 1 | 2 | 3;

export interface ProjectSuggestion {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  requirements: string[];
}

export interface LevelPlan {
  level: ProficiencyLevel;
  title: string;
  description: string;
  projects: ProjectSuggestion[];
  curriculum: {
    topic: string;
    subtopics: string[];
  }[];
  advancedTasks: string[]; // For Level 3: CI/CD, Docker etc.
}

export interface UserProfile {
  name: string;
  year: string;
  domain: string;
  goal: string;
  currentLevel: ProficiencyLevel;
  skills: {
    htmlCssJs: boolean;
    mern: boolean;
    devops: boolean;
  };
}

export interface DimensionScores {
  concepts: number;
  application: number;
  problemSolving: number;
  technicalFluency: number;
  discipline: number;
  selfAwareness: number;
}

export interface ReadinessProfile {
  studentId: string;
  timestamp: number;
  dimensions: DimensionScores;
  status: string;
  benchmarks: {
    role: string;
    matchPercentage: number;
  }[];
  positioningStatement?: string;
  gapClarity?: string;
}

export interface ActionPlanResponse {
  currentLevel: ProficiencyLevel;
  levelTitle: string;
  summary: string;
  roadmap: LevelPlan;
}

export interface SkillSignal {
  taskId: string;
  taskTitle: string;
  timestamp: number;
  selfConfidence: number; 
  qualityCheck: 'Low' | 'Medium' | 'High';
  notes?: string;
}

export interface ProgressReport {
  activeSkills: SkillProgressState[];
  readinessMovement: {
    direction: 'Forward' | 'Stationary' | 'Backward';
    description: string;
  };
  alerts: { type: string; message: string }[];
  nextCheckpoint: string;
  updatedReadinessProfile?: DimensionScores; 
}

export interface MentorSessionBrief {
  summary: string;
  discussionTopics: string[];
  suggestedDuration: string;
  expectedOutcomes: string[];
}

export interface DiagnosisReport {
  geminiInsight: {
    summary: string;
    gapAnalysis: string;
    priorities: string[];
    avoidForNow: string[];
    positioningStatement: string;
    distanceFromGoal: string;
  };
}

// Fixed missing exports
export interface WeeklySnapshot {
  week: number;
  avgConfidence: number;
  avgSkill: number;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  options: { text: string; isCorrect: boolean }[];
  dimension: keyof DimensionScores;
  layer: 'Concept' | 'Application' | 'ProblemSolving';
}

export interface UserAnswer {
  questionId: string;
  questionText: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  dimension: keyof DimensionScores;
  layer: string;
  timeTaken: number;
}

export interface SkillProgressState {
  skillName: string;
  status: 'Mastered' | 'Validating' | 'Practicing' | 'Initial';
  trend: 'Improving' | 'Regressing' | 'Stationary';
  evidenceCount: number;
}

export interface BenchmarkTask {
  id: string;
  scenario: string;
  task: string;
  options: { text: string; level: number }[];
}

export interface BenchmarkResponse {
  taskId: string;
  selectedOptionIndex: number;
  evaluation: number;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  field: string;
  skills: string[];
  experience: string;
  mentoringFocus: string[];
  bio: string;
  likes: number;
  recommendations: number;
}

export interface MentorRequest {
  id: string;
  mentorId: string;
  mentorName: string;
  userId: string;
  userName: string;
  userEmail: string;
  discussionFocus: string;
  userNotes: string;
  status: 'Submitted' | 'Confirmed';
  timestamp: number;
  bundledContext: {
    domain: string;
    readinessStatus: string;
    topGap: string;
  };
}
