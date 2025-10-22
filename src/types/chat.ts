export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  responseId?: string; // OpenAI response ID for conversation continuity
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sessionId?: string;
  lastResponseId?: string; // Track the last AI response ID for conversation continuity
}
