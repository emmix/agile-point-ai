
export enum EstimationState {
  VOTING = 'VOTING',
  REVEALED = 'REVEALED'
}

export interface Player {
  id: string;
  name: string;
  vote: string | null;
  isHost: boolean;
  isAI?: boolean;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  finalEstimate?: string;
}

export interface AIAnalysis {
  suggestedPoints: string;
  reasoning: string;
  risks: string[];
  complexityScore: number; // 1-10
}

export interface Session {
  id: string;
  currentStory: Story;
  players: Player[];
  state: EstimationState;
  history: Story[];
}
