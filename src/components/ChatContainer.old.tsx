"use client";

import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message, ChatState } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { chatService } from "@/services/chatService";

export const ChatContainer: React.FC = () => {
  const [sessionId, setSessionId] = useState(() => uuidv4());
  const [chatState, setChatState] = useState<ChatState>(() => {
    const welcomeMessage: Message = {
      id: uuidv4(),
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    };
    return {
      messages: [welcomeMessage],
      isLoading: false,
      error: null,
    };
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const handleSendMessage = async (messageContent: string) => {
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content: messageContent,
      sender: "user",
      timestamp: new Date(),
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      // Send message to n8n webhook
      const response = await chatService.sendMessage({
        message: messageContent,
        sessionId,
      });

      // Update session ID if returned from server
      if (response.sessionId && response.sessionId !== sessionId) {
        setSessionId(response.sessionId);
      }

      // Add AI response
      const aiMessage: Message = {
        id: uuidv4(),
        content: response.response,
        sender: "ai",
        timestamp: new Date(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage: Message = {
        id: uuidv4(),
        content: `Sorry, I encountered an error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        sender: "ai",
        timestamp: new Date(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-lg">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4">
        <h1 className="text-xl font-bold">AI Assistant</h1>
        <p className="text-blue-100 text-sm">Powered by n8n</p>
        <p className="text-blue-200 text-xs mt-1">
          Session: {sessionId.slice(-8)}
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatState.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Loading indicator */}
        {chatState.isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {chatState.error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 m-4 rounded">
          <p className="text-sm">Error: {chatState.error}</p>
        </div>
      )}

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={chatState.isLoading}
      />
    </div>
  );
};
