import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform, animate } from "motion/react";
import { MahindraMark } from "./Logo";
import { img } from "../data";

const EASE = [0.16, 1, 0.3, 1];
const EXPO = [0.76, 0, 0.24, 1];

/* Brand-film intro: a window flicks through the range while the real images load,
   then it bursts to full screen and the loader lifts away. Once per session. */
const INTRO = [
  ["hero-thar.jpg", "Thar"],
  ["range/scorpio-n.jpg", "Scorpio-N"],
  ["range/xuv700.jpg", "XUV700"],
  ["range/xev9e.jpg", "XEV 9e"],
  ["range/bolero.jpg", "Bolero"],
  ["racing.jpg", "Mahindra Racing"],
  ["range/roxx.jpg", "Thar Roxx"],
  ["range/tractor.jpg", "Tractors"],
];

export function Preloader() {
  const [show, setShow] = useState(() => !sessionStorage.getItem("bc-intro"));
  const [n, setN] = useState(0);
  const [frame, setFrame] = useState(0);
  const [burst, setBurst] = useState(false);
  useEffect(() => {
    if (!show) return;
    document.documentElement.style.overflow = "hidden";
    let loaded = 0, t = 0, raf;
    INTRO.forEach(([src]) => { const im = new Image(); im.onload = im.onerror = () => { loaded++; }; im.src = img(src); });
    const start = performance.now();
    const MIN = 2600;
    const tick = (now) => {
      const el = Math.max(0, now - start);
      const timeP = Math.min(1, el / MIN);
      const loadP = loaded / INTRO.length;
      const p = Math.min(timeP, 0.15 + loadP * 0.85);
      t = Math.max(t, p);
      setN(Math.round(t * 100));
      setFrame(Math.floor(el / 170) % INTRO.length);
      if (t >= 1) {
        setBurst(true);
        setTimeout(() => { sessionStorage.setItem("bc-intro", "1"); setShow(false); document.documentElement.style.overflow = ""; }, 1100);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); document.documentElement.style.overflow = ""; };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[90] overflow-hidden bg-[#0b0c0e] text-white"
          exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.9, ease: EXPO }} style={{ clipPath: "inset(0 0 0% 0)" }}
        >
          {/* image window */}
          <div className="absolute inset-0 grid place-items-center">
            <motion.div
              className="relative overflow-hidden bg-black"
              initial={{ width: "0vw", height: "0vh", borderRadius: 24 }}
              animate={burst ? { width: "100vw", height: "100vh", borderRadius: 0 } : { width: "min(46vw, 620px)", height: "min(28vw, 380px)", borderRadius: 24 }}
              transition={{ duration: burst ? 0.9 : 1.1, ease: EXPO }}
            >
              {INTRO.map(([src], i) => (
                <img key={src} src={img(src)} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ opacity: i === frame ? 1 : 0 }} />
              ))}
              <div className="absolute inset-0 bg-black/20" />
            </motion.div>
          </div>

          {/* wordmark */}
          <motion.div animate={{ opacity: burst ? 0 : 1 }} className="absolute inset-x-0 top-[calc(50%-min(14vw,190px)-4.5rem)] flex justify-center">
            <motion.div initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ delay: 0.3, duration: 1.1, ease: EXPO }}>
              <MahindraMark className="h-7 w-auto text-white sm:h-9" />
            </motion.div>
          </motion.div>

          {/* model ticker */}
          <motion.div animate={{ opacity: burst ? 0 : 1 }} className="absolute inset-x-0 top-[calc(50%+min(14vw,190px)+1.5rem)] flex items-center justify-center gap-4 text-sm">
            <span className="tabular-nums text-red">{String(frame + 1).padStart(2, "0")}</span>
            <span className="h-px w-8 bg-white/30" />
            <span className="w-56 whitespace-nowrap font-medium uppercase tracking-[0.22em]">{INTRO[frame][1]}</span>
          </motion.div>

          {/* corners */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: burst ? 0 : 1 }} transition={{ delay: 0.5 }} className="absolute bottom-8 left-8 text-xs font-semibold uppercase tracking-[0.3em] text-white/50 sm:bottom-10 sm:left-10">Basecamp. One family, every road.</motion.p>
          <motion.p animate={{ opacity: burst ? 0 : 1 }} className="absolute bottom-6 right-8 text-6xl font-semibold tabular-nums tracking-[-0.05em] sm:bottom-8 sm:right-10 sm:text-7xl">
            {n}<span className="text-2xl text-white/40">%</span>
          </motion.p>
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10"><div className="h-full bg-red" style={{ width: `${n}%` }} /></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Image that unmasks upward as it enters. The unclipped outer box watches the viewport
   (a clip-path'd element can read as invisible to IntersectionObserver). */
export function RevealImage({ src, alt = "", className = "", imgClass = "", delay = 0 }) {
  const pos = /(^| )(absolute|fixed)( |$)/.test(className) ? "" : "relative ";
  return (
    <motion.div className={`${pos}overflow-hidden ${className}`} initial="hide" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
      <motion.div
        className="absolute inset-0"
        variants={{ hide: { clipPath: "inset(100% 0% 0% 0%)" }, show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.2, delay, ease: EXPO } } }}
      >
        <motion.img
          src={img(src)} alt={alt} loading="lazy"
          variants={{ hide: { scale: 1.25 }, show: { scale: 1, transition: { duration: 1.8, delay, ease: EASE } } }}
          className={`h-full w-full object-cover ${imgClass}`}
        />
      </motion.div>
    </motion.div>
  );
}

/* Lines that slide up from behind a mask. The parent watches the viewport,
   because a fully clipped child never registers as visible. */
export function MaskLines({ lines, className = "", delay = 0, inView = false }) {
  const parent = inView
    ? { initial: "hide", whileInView: "show", viewport: { once: true, amount: 0.3 } }
    : { initial: "hide", animate: "show" };
  return (
    <motion.span className={className} {...parent}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span className="block" variants={{ hide: { y: "105%" }, show: { y: 0, transition: { duration: 1.1, delay: delay + i * 0.1, ease: EXPO } } }}>{l}</motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* Paragraph whose words darken as you scroll through it. */
export function ScrollText({ text, className = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} p={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>
      ))}
    </p>
  );
}
function Word({ children, p, range }) {
  const o = useTransform(p, range, [0.14, 1]);
  return <motion.span style={{ opacity: o }} className="mr-[0.25em] inline-block">{children}</motion.span>;
}

/* Number that counts up when it scrolls into view. */
export function CountUp({ to, decimals = 0, prefix = "", suffix = "", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease: EASE, onUpdate: setV });
    return () => c.stop();
  }, [inView, to]);
  const shown = decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString("en-IN");
  return <span ref={ref} className={className}>{prefix}{shown}{suffix}</span>;
}

/* Small floating disclosure instead of a full-width banner. */
export function DemoBadge() {
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-30 rounded-full bg-white/80 px-3 py-1.5 text-[11px] text-mute shadow-sm backdrop-blur">
      Concept demo. Products and prices illustrative.
    </div>
  );
}

/* Cinematic page header shared by inner pages: full-bleed photo panel, masked headline, actions. */
export function PageHero({ image, kicker, title, sub, children, tall = false, dark = 0.55 }) {
  return (
    <section className={`relative mx-3 mt-3 overflow-hidden rounded-[40px] text-white sm:mx-5 ${tall ? "h-[88dvh] min-h-[620px]" : "h-[72dvh] min-h-[520px]"}`}>
      <motion.img src={img(image)} alt="" initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.8, ease: EASE }} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(0,0,0,${dark + 0.25}), rgba(0,0,0,${dark * 0.35}) 55%, rgba(0,0,0,${dark * 0.6}))` }} />
      <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end p-6 sm:p-12 lg:p-16">
        {kicker && <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">{kicker}</motion.p>}
        <h1 className="display mt-4 text-[15vw] leading-[0.86] sm:text-[8rem] xl:text-[9.5rem]"><MaskLines lines={Array.isArray(title) ? title : [title]} delay={0.45} /></h1>
        <div className="mt-8 flex flex-col gap-6 border-t border-white/20 pt-6 md:flex-row md:items-end md:justify-between">
          {sub && <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8, ease: EASE }} className="max-w-md text-lg text-white/80">{sub}</motion.p>}
          {children && <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8, ease: EASE }} className="flex flex-wrap items-center gap-3">{children}</motion.div>}
        </div>
      </div>
    </section>
  );
}

/* Horizontal rail that works with any input: arrow buttons, click-and-drag, trackpad, shift+wheel. */
export function Rail({ children, className = "" }) {
  const ref = useRef(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });
  const [prog, setProg] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  const update = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProg(max > 0 ? el.scrollLeft / max : 0);
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft > max - 8 });
  };
  useEffect(() => { update(); }, []);
  const step = (dir) => {
    const el = ref.current;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  const onDown = (e) => {
    if (e.pointerType !== "mouse") return;
    drag.current = { down: true, x: e.clientX, left: ref.current.scrollLeft, moved: false };
  };
  const onMove = (e) => {
    const d = drag.current;
    if (!d.down) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) d.moved = true;
    ref.current.scrollLeft = d.left - dx;
  };
  const onUp = () => { drag.current.down = false; };
  const onClickCapture = (e) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false; } };
  return (
    <div className={`relative ${className}`}>
      <div
        ref={ref}
        data-lenis-prevent-wheel
        onScroll={update}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onClickCapture={onClickCapture}
        className="no-scrollbar -mx-5 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-4 active:cursor-grabbing sm:-mx-8 sm:px-8 [&_img]:pointer-events-none"
      >
        {children}
      </div>
      <div className="mt-6 flex items-center gap-6">
        <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-bone/10">
          <div className="h-full rounded-full bg-bone transition-[width] duration-300" style={{ width: `${Math.max(12, prog * 100)}%` }} />
        </div>
        <div className="flex gap-2">
          <button onClick={() => step(-1)} disabled={edges.start} aria-label="Previous" className="press grid h-12 w-12 place-items-center rounded-full bg-white shadow-sm transition hover:bg-bone hover:text-white disabled:opacity-30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={() => step(1)} disabled={edges.end} aria-label="Next" className="press grid h-12 w-12 place-items-center rounded-full bg-white shadow-sm transition hover:bg-bone hover:text-white disabled:opacity-30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
