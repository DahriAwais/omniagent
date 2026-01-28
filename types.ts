
export enum AgentType {
  ORCHESTRATOR = 'ORCHESTRATOR',
  SLIDE_MASTER = 'SLIDE_MASTER',
  WEB_ARCHITECT = 'WEB_ARCHITECT',
  VISUAL_DESIGNER = 'VISUAL_DESIGNER',
  RESEARCHER = 'RESEARCHER',
  YOUTUBE_RESEARCHER = 'YOUTUBE_RESEARCHER',
  TASK_SCHEDULER = 'TASK_SCHEDULER',
  ROADMAP_STRATEGIST = 'ROADMAP_STRATEGIST'
}

export type AppContext = 'HUB' | 'CHAT' | 'SLIDES' | 'WEB' | 'DESIGN' | 'RESEARCH' | 'YOUTUBE' | 'ROADMAP' | 'LOADING';

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  description: string;
}

export interface Slide {
  title: string;
  content: string;
  points: string[];
}

export interface RoadmapNode {
  id: string;
  label: string;
  description: string;
  duration: string;
  skills: string[];
  children?: RoadmapNode[];
}

export interface PlanStep {
  id: string;
  title: string;
  description: string;
  agent: AgentType;
}

export interface ExecutionPlan {
  objective: string;
  steps: PlanStep[];
  technicalStack: string[];
  estimatedComplexity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  plan?: ExecutionPlan;
  agentType?: AgentType;
}

export interface AgentResponse {
  type: AgentType;
  content: any;
  explanation: string;
}
