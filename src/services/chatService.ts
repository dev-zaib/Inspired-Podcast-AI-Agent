import axios from "axios";

export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  response: string;
  sessionId?: string;
}

export const chatService = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      // Call our internal API route instead of directly calling n8n
      const response = await axios.get("/api/chat", {
        params: {
          message: request.message,
          sessionId: request.sessionId || `session-${Date.now()}`,
        },
        timeout: 30000,
      });

      return {
        response:
          response.data.output ||
          "I'm sorry, I couldn't generate a response. Please try again.",
        sessionId: response.data.sessionId || request.sessionId,
      };
    } catch (error) {
      console.error("Chat service error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error(
            "Authentication failed. Please check your access credentials."
          );
        }

        if (error.response?.status === 403) {
          throw new Error(
            "Access forbidden. You don't have permission to use this service."
          );
        }

        if (error.code === "ERR_NETWORK") {
          throw new Error(
            "Unable to connect to AI service. Please check your internet connection and try again."
          );
        }

        if (error.response?.status === 404) {
          throw new Error(
            "AI service is temporarily unavailable. Please try again later."
          );
        }

        if (error.response && error.response.status >= 500) {
          throw new Error(
            "AI service is experiencing issues. Please try again in a few moments."
          );
        }

        throw new Error("Failed to get response from AI. Please try again.");
      }

      throw new Error("An unexpected error occurred. Please try again.");
    }
  },
};
