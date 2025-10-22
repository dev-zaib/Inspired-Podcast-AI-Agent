import React from "react";
import { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div className="animate-slide-up">
      <div
        className={`flex ${
          isUser ? "justify-end" : "justify-start"
        } px-6 py-3 group`}
      >
        <div
          className={`flex ${
            isUser ? "flex-row-reverse" : "flex-row"
          } items-end gap-3 max-w-[85%] md:max-w-[75%]`}
        >
          {/* Avatar */}
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl ${
              isUser
                ? "bg-gray-700 group-hover:shadow-gray-500/50"
                : "bg-blue-600 group-hover:shadow-blue-500/50"
            }`}
          >
            {isUser ? (
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            ) : (
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
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 22.5l-.394-1.933a2.25 2.25 0 00-1.423-1.423L12.75 18.75l1.933-.394a2.25 2.25 0 001.423-1.423L16.5 15l.394 1.933a2.25 2.25 0 001.423 1.423l1.933.394-1.933.394a2.25 2.25 0 00-1.423 1.423z"
                />
              </svg>
            )}
          </div>

          {/* Message bubble */}
          <div
            className={`relative px-5 py-3.5 rounded-[20px] shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.02] ${
              isUser
                ? "bg-blue-600 text-white"
                : "bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-gray-100 border border-gray-200/50 dark:border-gray-700/50"
            }`}
          >
            {/* Subtle hover effect */}
            {!isUser && (
              <div className="absolute inset-0 rounded-[20px] bg-blue-500/0 group-hover:bg-blue-500/5 transition-all duration-300"></div>
            )}

            {/* Message content */}
            <div
              className={`relative z-10 text-[15px] leading-relaxed font-medium ${
                isUser ? "text-white" : "text-gray-900 dark:text-gray-100"
              }`}
            >
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
            </div>

            {/* Timestamp */}
            <div
              className={`relative z-10 text-[11px] mt-1.5 font-medium ${
                isUser ? "text-blue-100" : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {message.timestamp.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
