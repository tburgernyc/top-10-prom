"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useChat } from "ai/react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { AriaMessageBubble } from "./AriaMessageBubble";

export interface AriaChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant" as const,
  content:
    "Hello, I'm **Aria** — your personal style concierge at Top 10 Prom. ✨\n\nI'm here to help you find your perfect prom look. Tell me about your vision — a color, a silhouette, a vibe — and I'll guide you through our curated collections.\n\nWhat are you dreaming of?",
};

/* ── Send icon ─────────────────────────────────────────────────────────────── */
function SendIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export function AriaChatPanel({ isOpen, onClose }: AriaChatPanelProps) {
  const [mounted, setMounted] = useState(false);

  // SSR guard — createPortal requires document
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useChat({ api: "/api/chat" });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages update or streaming
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  // Submit on Enter (Shift+Enter = newline)
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    }
  }

  const allMessages = [
    WELCOME_MESSAGE,
    ...messages.map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — darkens on mobile only */}
          <motion.div
            key="aria-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[290] sm:pointer-events-none bg-black/40 sm:bg-transparent"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Glass-5 panel */}
          <motion.div
            key="aria-panel"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "fixed z-[300] flex flex-col overflow-hidden",
              "glass-5 border border-white/[0.10] shadow-glass-lg",
              // Mobile: full-width bottom sheet
              "bottom-0 left-0 right-0 rounded-t-2xl h-[70dvh] max-h-[600px]",
              // sm+: float above FAB at bottom-left
              "sm:bottom-24 sm:left-6 sm:right-auto sm:w-[380px] sm:h-[520px] sm:rounded-2xl"
            )}
            role="dialog"
            aria-label="Aria Style Concierge chat"
            aria-modal="true"
          >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full border border-gold/40 bg-gold/10
                               flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="text-xs font-semibold text-gold">A</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-ivory leading-none">Aria</p>
                  <p className="text-[10px] text-platinum/40 mt-0.5">Style Concierge</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[10px] text-platinum/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" aria-hidden="true" />
                  Online
                </span>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-full flex items-center justify-center
                             text-platinum/40 hover:text-platinum hover:bg-white/[0.06]
                             transition-all duration-200"
                  aria-label="Close Aria chat"
                  data-cursor="pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ── Message list ────────────────────────────────────────────── */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 min-h-0"
            >
              {allMessages.map((msg) => (
                <AriaMessageBubble
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                />
              ))}

              <AnimatePresence>
                {isLoading && (
                  <AriaMessageBubble
                    key="streaming-indicator"
                    role="assistant"
                    content=""
                    isStreaming
                  />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-red-400/80 text-center py-1"
                    role="alert"
                  >
                    Something went wrong. Please try again.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* ── Input bar ───────────────────────────────────────────────── */}
            <form
              onSubmit={handleSubmit}
              className="flex-shrink-0 flex items-end gap-2 px-3 py-3 border-t border-white/[0.08]"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask Aria about styles, colors, designers…"
                rows={1}
                className={cn(
                  "flex-1 resize-none rounded-xl px-3 py-2.5 text-sm text-ivory",
                  "glass-1 border border-white/[0.08]",
                  "focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20",
                  "placeholder:text-platinum/30 transition-all duration-200",
                  "max-h-32 overflow-y-auto leading-relaxed"
                )}
                aria-label="Message Aria"
              />

              <motion.button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={cn(
                  "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center",
                  "transition-all duration-200",
                  input.trim() && !isLoading
                    ? "bg-gold text-onyx hover:bg-gold-light"
                    : "bg-white/[0.04] text-platinum/30 cursor-not-allowed"
                )}
                whileTap={input.trim() && !isLoading ? { scale: 0.93 } : {}}
                aria-label="Send message"
                data-cursor="pointer"
              >
                {isLoading ? (
                  <motion.span
                    className="w-4 h-4 rounded-full border-2 border-current/30 border-t-current block"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    aria-hidden="true"
                  />
                ) : (
                  <SendIcon />
                )}
              </motion.button>
            </form>

            <p className="text-center text-[9px] text-platinum/20 pb-2.5 px-4 flex-shrink-0">
              Aria may make mistakes. Visit a boutique to try on.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
