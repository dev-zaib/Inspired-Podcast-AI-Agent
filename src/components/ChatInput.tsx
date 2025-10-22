import React, { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
      resetTextareaHeight();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="px-6 py-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800">
      <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
        <div
          className={`relative flex items-end gap-2 bg-gray-100 dark:bg-gray-800/50 rounded-[24px] transition-all duration-300 shadow-sm ${
            isFocused
              ? "scale-[1.02] shadow-blue-500/20 ring-2 ring-blue-500/50"
              : "hover:shadow-md"
          }`}
        >
          {/* Animated border glow on focus */}
          {isFocused && (
            <div className="absolute -inset-0.5 bg-blue-500/20 rounded-[24px] blur-sm"></div>
          )}

          {/* Textarea */}
          <div className="relative flex-1 z-10">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask about podcast guests, meetings, or business details..."
              rows={1}
              className="w-full resize-none bg-transparent px-5 py-3.5 text-[15px] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none leading-relaxed transition-all duration-300"
              style={{
                minHeight: "24px",
                maxHeight: "120px",
              }}
              disabled={isLoading}
            />
          </div>

          {/* Send button */}
          <div className="relative flex-shrink-0 p-2 z-10">
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className={`relative w-9 h-9 rounded-full font-medium transition-all duration-300 flex items-center justify-center overflow-hidden ${
                !message.trim() || isLoading
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white shadow-lg shadow-blue-600/50 hover:shadow-xl hover:shadow-blue-600/60 hover:scale-110 active:scale-95"
              }`}
            >
              {isLoading ? (
                <div className="relative w-4 h-4">
                  <div className="absolute inset-0 border-2 border-white/30 rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <svg
                  className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Helper text */}
        <div className="flex items-center justify-center mt-3 text-[11px] text-gray-500 dark:text-gray-600 animate-fade-in">
          <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-[10px] font-medium mr-1 shadow-sm">
            ⏎
          </kbd>
          <span>to send · </span>
          <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-[10px] font-medium mx-1 shadow-sm">
            ⇧
          </kbd>
          <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-[10px] font-medium mr-1 shadow-sm">
            ⏎
          </kbd>
          <span>for new line</span>
        </div>
      </form>
    </div>
  );
};
