"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, placeholder, ...props }, ref) => {
    const inputId = id ?? React.useId();
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(
      Boolean(props.value ?? props.defaultValue)
    );

    const isFloating = isFocused || hasValue || Boolean(placeholder);

    return (
      <div className="relative w-full">
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            placeholder={placeholder ?? " "}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => {
              setHasValue(e.target.value.length > 0);
              props.onChange?.(e);
            }}
            className={cn(
              "peer w-full h-12 px-4 pt-4 pb-2 text-sm text-ivory",
              "glass-1 border transition-all duration-200",
              "outline-none",
              error
                ? "border-red-500/60 focus:border-red-400"
                : "border-white/10 focus:border-gold/60",
              "placeholder:text-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
          {label && (
            <motion.label
              htmlFor={inputId}
              animate={
                isFloating
                  ? { y: -10, scale: 0.78, x: 0 }
                  : { y: 0, scale: 1, x: 0 }
              }
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={cn(
                "absolute left-4 top-3.5 origin-left text-sm pointer-events-none transition-colors duration-200",
                isFocused && !error ? "text-gold" : "text-platinum/60",
                error && "text-red-400"
              )}
            >
              {label}
            </motion.label>
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="mt-1.5 text-xs text-red-400"
            >
              {error}
            </motion.p>
          )}
          {hint && !error && (
            <p className="mt-1.5 text-xs text-platinum/50">{hint}</p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
Input.displayName = "Input";
