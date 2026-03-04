"use client";

import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export interface AriaMessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  /** Show typing indicator instead of content */
  isStreaming?: boolean;
}

/* ── Aria avatar — gold "A" monogram ──────────────────────────────────────── */
function AriaAvatar() {
  return (
    <div
      className="flex-shrink-0 w-7 h-7 rounded-full border border-gold/40
                 flex items-center justify-center bg-gold/10"
      aria-hidden="true"
    >
      <span className="text-[10px] font-semibold text-gold tracking-wide">A</span>
    </div>
  );
}

/* ── Streaming ellipsis dots ─────────────────────────────────────────────── */
function TypingDots() {
  return (
    <span className="flex items-center gap-1 h-4" aria-label="Aria is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-gold/50"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.18,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

/* ── Markdown component overrides ────────────────────────────────────────── */
const markdownComponents: React.ComponentProps<typeof ReactMarkdown>["components"] = {
  // Paragraphs — no extra margin between streamed chunks
  p: ({ children }) => (
    <p className="mb-2 last:mb-0 leading-relaxed text-sm text-ivory/90">{children}</p>
  ),
  // Bold — gold tint for designer/dress names
  strong: ({ children }) => (
    <strong className="font-semibold text-gold/90">{children}</strong>
  ),
  // Emphasis
  em: ({ children }) => (
    <em className="italic text-platinum/80">{children}</em>
  ),
  // Unordered list
  ul: ({ children }) => (
    <ul className="mb-2 last:mb-0 flex flex-col gap-1 pl-1">{children}</ul>
  ),
  li: ({ children }) => (
    <li className="flex gap-2 text-sm text-ivory/80 leading-relaxed">
      <span className="text-gold/50 flex-shrink-0 mt-0.5">›</span>
      <span>{children}</span>
    </li>
  ),
  // Ordered list
  ol: ({ children }) => (
    <ol className="mb-2 last:mb-0 flex flex-col gap-1 pl-1 list-decimal list-inside">{children}</ol>
  ),
  // Inline code
  code: ({ children }) => (
    <code className="px-1.5 py-0.5 rounded bg-white/[0.08] text-xs font-mono text-platinum/80">
      {children}
    </code>
  ),
  // Block-level code fence
  pre: ({ children }) => (
    <pre className="my-2 p-3 rounded-lg bg-white/[0.06] text-xs font-mono text-platinum/80 overflow-x-auto">
      {children}
    </pre>
  ),
};

/* ── Main component ──────────────────────────────────────────────────────── */
export function AriaMessageBubble({
  role,
  content,
  isStreaming = false,
}: AriaMessageBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex gap-2.5 w-full",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Aria avatar — only for assistant messages */}
      {!isUser && <AriaAvatar />}

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3",
          isUser
            ? // User: glass-1 right-aligned
              "glass-1 rounded-tr-sm text-ivory/90"
            : // Aria: subtle gold left accent line
              "bg-white/[0.04] border border-white/[0.06] border-l-2 border-l-gold/30 rounded-tl-sm"
        )}
      >
        {isStreaming && !content ? (
          <TypingDots />
        ) : isUser ? (
          <p className="text-sm text-ivory/90 leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </motion.div>
  );
}
