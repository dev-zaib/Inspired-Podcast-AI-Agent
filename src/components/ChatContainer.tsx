"use client";

import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message, ChatState } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { chatService } from "@/services/chatService";

export const ChatContainer: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    sessionId: undefined,
    lastResponseId: undefined,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fix hydration by only rendering on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

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
  }, [isClient]);

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
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      {/* Subtle background texture */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex-shrink-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 animate-slide-up">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and title */}
            <div className="flex items-center gap-4">
              <div className="relative w-10 h-10 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 22.5l-.394-1.933a2.25 2.25 0 00-1.423-1.423L12.75 18.75l1.933-.394a2.25 2.25 0 001.423-1.423L16.5 15l.394 1.933a2.25 2.25 0 001.423 1.423l1.933.394-1.933.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-[17px] font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                  Anthony&apos;s Assistant
                </h1>
                <p className="text-[13px] text-gray-600 dark:text-gray-400 font-medium">
                  Podcast & Business Intelligence
                </p>
              </div>
            </div>

            {/* Status indicator and Upload button */}
            <div className="flex items-center gap-4">
              <a
                href="/upload"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                <span className="text-[13px] font-medium">Upload</span>
              </a>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 animate-scale-in">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-subtle"></div>
                <span className="text-[12px] font-medium text-green-700 dark:text-green-400">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {chatState.messages.length === 0 ? (
            // Empty state with animations
            <div className="flex flex-col items-center justify-center h-full px-6 py-20">
              <div className="relative w-20 h-20 rounded-3xl bg-blue-600 shadow-2xl shadow-blue-600/30 flex items-center justify-center mb-8 animate-bounce-in">
                <svg
                  className="relative z-10 w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
                  />
                </svg>
              </div>
              <h2 className="text-[28px] font-semibold text-gray-900 dark:text-gray-100 mb-3 tracking-tight animate-fade-in">
                How can I help you today?
              </h2>
              <p
                className="text-[15px] text-gray-600 dark:text-gray-400 text-center max-w-md leading-relaxed mb-10 animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                Ask me about your podcast guests, meeting notes, business
                details, or anything related to AddBack Benefits and Inspired
                Stories.
              </p>

              {/* Suggested prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {[
                  {
                    icon: "🎙️",
                    title: "Recent Guests",
                    prompt: "Who were my recent podcast guests?",
                  },
                  {
                    icon: "📅",
                    title: "Meeting Notes",
                    prompt: "Show me notes from my last meeting",
                  },
                  {
                    icon: "💼",
                    title: "Business Info",
                    prompt: "Tell me about AddBack Benefits Agency",
                  },
                  {
                    icon: "🔍",
                    title: "Search Topics",
                    prompt: "Find discussions about insurance",
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.prompt)}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg hover:scale-105 transition-all duration-300 group animate-slide-up"
                    style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
                  >
                    <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                      {item.icon}
                    </span>
                    <div className="text-left">
                      <div className="text-[14px] font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[12px] text-gray-600 dark:text-gray-500">
                        {item.prompt}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-6 space-y-1">
              {chatState.messages.map((message, index) => (
                <div
                  key={message.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <MessageBubble message={message} />
                </div>
              ))}
            </div>
          )}

          {/* Loading indicator */}
          {chatState.isLoading && (
            <div className="px-6 py-3 animate-fade-in">
              <div className="flex items-end gap-3 max-w-[85%] md:max-w-[75%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-sm animate-pulse">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                </div>
                <div className="px-5 py-3.5 rounded-[20px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error Display */}
      {chatState.error && (
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-4">
          <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 px-4 py-3 rounded-2xl text-[13px] flex items-center gap-2 shadow-sm animate-slide-up">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>Something went wrong. Please try again.</span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="relative z-10 flex-shrink-0">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={chatState.isLoading}
        />
      </div>
    </div>
  );
};
