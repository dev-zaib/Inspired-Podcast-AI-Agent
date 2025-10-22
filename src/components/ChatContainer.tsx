"use client";

import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message, ChatState } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { chatService } from "@/services/chatService";

export const ChatContainer: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    sessionId: undefined,
    lastResponseId: undefined,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);

    const welcomeMessage: Message = {
      id: uuidv4(),
      content:
        "Hello Anthony! I'm your personal AI assistant, ready to help you stay organized with your busy schedule. I can assist with information about your podcast interviews, business meetings, client details, and anything related to AddBack Benefits Agency and Inspired Podcast Stories. What would you like to know?",
      sender: "ai",
      timestamp: new Date(),
    };

    setChatState((prev) => ({
      ...prev,
      messages: [welcomeMessage],
    }));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const handleSendMessage = async (messageContent: string) => {
    if (!sessionId) return; // Don't send if session not initialized

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
      // Send message to OpenAI Responses API
      const response = await chatService.sendMessage({
        message: messageContent,
        sessionId,
        previousResponseId: chatState.lastResponseId, // Use last response ID for conversation continuity
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
        responseId: response.responseId, // Store the OpenAI response ID
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false,
        sessionId: response.sessionId,
        lastResponseId: response.responseId, // Track the last response ID for conversation continuity
      }));
    } catch (error) {
      const errorMessage: Message = {
        id: uuidv4(),
        content:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
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
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-gray-800">
              Anthony&apos;s Personal AI Assistant
            </h1>
            <div className="text-sm text-blue-600 font-medium">
              AddBack Benefits Agency • Inspired Podcast Stories
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Online
            </div>
            <div className="text-xs text-gray-400">
              {sessionId
                ? `Session: ${sessionId.slice(0, 8)}...`
                : "Initializing..."}
            </div>
          </div>
        </div>
      </header>

      {/* Messages Container - Modern AI assistant style */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {chatState.messages.length === 0 ? (
            // Empty state - Modern assistant style
            <div className="flex flex-col items-center justify-center h-full py-20 px-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-medium text-gray-900 mb-2">
                Ready to help with your busy schedule
              </h2>
              <p className="text-gray-500 text-center max-w-md">
                Ask me about your podcast guests, meeting notes, business
                details, or anything related to AddBack Benefits Agency and
                Inspired Podcast Stories.
              </p>
            </div>
          ) : (
            <div className="py-8">
              {chatState.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
          )}

          {/* Loading indicator - AI assistant style */}
          {chatState.isLoading && (
            <div className="px-4 py-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
                    <div
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error Display - Clean style */}
      {chatState.error && (
        <div className="max-w-3xl mx-auto px-4 pb-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            <div className="flex items-center">
              <svg
                className="h-4 w-4 text-red-400 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              Something went wrong. Please try again.
            </div>
          </div>
        </div>
      )}

      {/* Input - Modern assistant style */}
      <div className="flex-shrink-0 border-t border-gray-100 bg-white">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={chatState.isLoading}
          />
        </div>
      </div>
    </div>
  );
};
