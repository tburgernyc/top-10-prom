"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type CursorState = "default" | "hover" | "click";

export function Cursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [state, setState] = useState<CursorState>("default");

  // Raw mouse position — dot tracks instantly
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // 0.12s lerp spring for the outer ring
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Skip on touch-only devices
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onMousedown = () => setState("click");
    const onMouseup = () => setState("default");

    const onMouseover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a, button, [role='button'], label, [data-cursor='pointer']")
      ) {
        setState("hover");
      } else {
        setState("default");
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onMousedown);
    window.addEventListener("mouseup", onMouseup);
    window.addEventListener("mouseover", onMouseover);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onMousedown);
      window.removeEventListener("mouseup", onMouseup);
      window.removeEventListener("mouseover", onMouseover);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* 8px gold dot — instant tracking */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x: cursorX, y: cursorY }}
        animate={{
          scale: state === "click" ? 0.6 : state === "hover" ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
      >
        <div
          className="w-2 h-2 rounded-full bg-gold"
          style={{ transform: "translate(-50%, -50%)" }}
        />
      </motion.div>

      {/* 32px platinum ring — lerp (spring) tracking */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ x: cursorXSpring, y: cursorYSpring }}
        animate={{
          scale: state === "hover" ? 1.8 : state === "click" ? 0.8 : 1,
          opacity: state === "click" ? 0.4 : 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <div
          className="w-8 h-8 rounded-full border border-platinum/50"
          style={{ transform: "translate(-50%, -50%)" }}
        />
      </motion.div>
    </>
  );
}
