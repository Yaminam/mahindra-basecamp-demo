import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1];

/* 3D tilt that follows the pointer. Motion values only, no React re-renders. */
export function Tilt({ children, className = "", max = 9, glare = true, holo = false }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 180, damping: 18 });
  const glareBg = useTransform([px, py], ([x, y]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,.45), transparent 45%)`);
  const holoBg = useTransform([px, py], ([x, y]) => {
    const p = x * 100;
    return `linear-gradient(115deg, transparent ${p - 45}%, rgba(255,70,90,.35) ${p - 18}%, rgba(90,200,255,.35) ${p}%, rgba(255,225,130,.35) ${p + 18}%, transparent ${p + 45}%), radial-gradient(circle at ${p}% ${y * 100}%, rgba(255,255,255,.35), transparent 40%)`;
  });
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const leave = () => { px.set(0.5); py.set(0.5); };
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <div style={{ perspective: 1100 }} className={className}>
      <motion.div ref={ref} onPointerMove={move} onPointerLeave={leave} style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="relative h-full rounded-[inherit]">
        {children}
        {glare && <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: glareBg }} />}
        {holo && <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay" style={{ background: holoBg }} />}
      </motion.div>
    </div>
  );
}

/* Wrapper that leans toward the cursor. */
export function Magnetic({ children, strength = 0.3, className = "" }) {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 220, damping: 15 });
  const y = useSpring(0, { stiffness: 220, damping: 15 });
  const reduce = useReducedMotion();
  const move = (e) => {
    if (reduce) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  return (
    <motion.div ref={ref} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); }} style={{ x, y }} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  );
}

/* Headline that rises in letter by letter. */
export function Rise({ text, className = "", delay = 0, stagger = 0.025 }) {
  const words = text.split(" ");
  let i = 0;
  return (
    <span className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
          {[...w].map((ch) => {
            const d = delay + i++ * stagger;
            return (
              <motion.span key={d} className="inline-block" initial={{ y: "115%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: d, ease: EASE }}>
                {ch}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

/* The one marquee on the site: model names, alternating solid and outline. */
export function Marquee({ items }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-10" aria-label={items.join(", ")}>
      <div className="flex w-max animate-[marquee_40s_linear_infinite] items-center gap-14 motion-reduce:animate-none">
        {row.map((t, i) => (
          <span key={i} className={`display whitespace-nowrap text-7xl sm:text-[9rem] ${i % 2 ? "text-bone" : "text-transparent [-webkit-text-stroke:1.5px_#1c1c1c]"}`}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* Red curtain that wipes away on every route change. */
export function Curtain({ id }) {
  return (
    <motion.div
      key={id}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] origin-top bg-red"
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    />
  );
}
