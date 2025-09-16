import React from "react";
import { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === "user";

  // Format AI response text for better readability
  const formatText = (text: string) => {
    if (isUser) return text;

    return text;
  };

  const formattedContent = formatText(message.content);

  return (
    <div className={`px-4 py-6 ${isUser ? "bg-gray-50" : "bg-white"}`}>
      <div className="flex items-start space-x-4 max-w-full">
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser ? "bg-gray-700 text-white" : "bg-blue-500 text-white"
          }`}
        >
          {isUser ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
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
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div
            className={`font-semibold text-sm mb-3 ${
              isUser ? "text-gray-900" : "text-gray-900"
            }`}
          >
            {isUser ? "You" : "AI Assistant"}
          </div>

          <div className={`${isUser ? "text-gray-900" : "text-gray-800"}`}>
            <div className="whitespace-pre-wrap leading-relaxed text-base">
              {formattedContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
