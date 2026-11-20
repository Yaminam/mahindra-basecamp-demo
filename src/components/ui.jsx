import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, Prohibit, Plus } from "@phosphor-icons/react";
import { img, inr, modelById, fits, FALLBACK } from "../data";
import { useStore } from "../store";
import { Tilt } from "./fx";

const EASE = [0.16, 1, 0.3, 1];

/* Photo with graceful fallback: try the mapped backup shot first, then a toned panel, never a broken image. */
export function Photo({ src, alt = "", className = "", pos = "center", eager = false }) {
  const [cur, setCur] = useState(src);
  const [bad, setBad] = useState(false);
  useEffect(() => { setCur(src); setBad(false); }, [src]);
  const fail = () => (FALLBACK[cur] && cur !== FALLBACK[cur] ? setCur(FALLBACK[cur]) : setBad(true));
  return (
    <div className={`${/(^| )(absolute|fixed)( |$)/.test(className) ? "" : "relative "}overflow-hidden bg-slab ${className}`}>
      {!bad && (
        <img
          src={img(cur)}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          onError={fail}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: pos }}
        />
      )}
      {bad && <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#ffffff,#e3e5e8_70%)]" />}
    </div>
  );
}

/* Enter-on-scroll reveal. Motion respects the OS reduced-motion setting via MotionConfig in App. */
export function Reveal({ children, delay = 0, y = 28, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Btn({ as: As = "button", variant = "red", className = "", children, ...rest }) {
  const look = {
    red: "bg-red text-white hover:bg-red-deep",
    bone: "bg-bone text-ink hover:bg-white",
    ghost: "border border-line text-bone hover:border-bone/60 bg-ink/40 backdrop-blur",
  }[variant];
  return (
    <As className={`press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold ${look} ${className}`} {...rest}>
      {children}
    </As>
  );
}

export function FitBadge({ product, vehicle, compact = false }) {
  if (!product.fit) return null;
  if (!vehicle)
    return <span className="inline-flex items-center gap-1 text-xs text-mute">Fits {product.fit.length} models</span>;
  const m = modelById(vehicle.model);
  const ok = fits(product, vehicle);
  return ok ? (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-fit">
      <CheckCircle weight="fill" size={13} /> {compact ? "Fits" : `Fits your ${m.name}`}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-xs text-dim">
      <Prohibit size={13} /> Not for {m.name}
    </span>
  );
}

export function ProductCard({ p, i = 0 }) {
  const vehicle = useStore((s) => s.vehicle);
  const add = useStore((s) => s.add);
  const [sized, setSized] = useState("");
  const dim = p.fit && vehicle && !fits(p, vehicle);
  const quick = (size) => {
    add({ id: p.id, name: p.name, price: p.price, image: p.image, mode: p.modes[0], kind: p.kind, size });
    setSized(size || "ok");
    setTimeout(() => setSized(""), 1400);
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: dim ? 0.45 : 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: Math.min(i, 8) * 0.045, ease: EASE }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-[20px] bg-[#e9eaec]">
        <Link to={`/p/${p.id}`} className="block" aria-label={p.name}>
          <Photo src={p.image} alt={p.name} className="aspect-[4/5] [&_img]:transition-transform [&_img]:duration-[900ms] [&_img]:ease-[cubic-bezier(.16,1,.3,1)] group-hover:[&_img]:scale-[1.05]" />
          {p.image2 && (
            <Photo src={p.image2} alt="" className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          )}
        </Link>
        {p.tag && <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-bone shadow-sm">{p.tag}</span>}
        {!dim && (
          <div className="absolute inset-x-2 bottom-2 translate-y-[120%] rounded-2xl bg-white/90 p-2 opacity-0 shadow-lg backdrop-blur transition duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            {sized ? (
              <p className="flex items-center justify-center gap-1.5 py-1.5 text-sm font-medium text-fit"><CheckCircle size={16} weight="fill" /> Added{sized !== "ok" ? ` (${sized})` : ""}</p>
            ) : p.sizes ? (
              <div className="flex flex-wrap justify-center gap-1">
                {p.sizes.map((s) => (
                  <button key={s} onClick={() => quick(s)} className="press h-8 min-w-9 rounded-full px-2 text-xs font-medium hover:bg-bone hover:text-white">{s}</button>
                ))}
              </div>
            ) : (
              <button onClick={() => quick()} className="press flex w-full items-center justify-center gap-1.5 rounded-xl py-1.5 text-sm font-medium hover:bg-bone hover:text-white">
                <Plus size={15} weight="bold" /> {p.kind === "accessory" ? "Quick add" : "Add to bag"}
              </button>
            )}
          </div>
        )}
      </div>
      <Link to={`/p/${p.id}`} className="mt-3.5 block">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-medium leading-snug">{p.name}</h3>
          <p className="shrink-0 text-[15px] tabular-nums">{inr(p.price)}</p>
        </div>
        {p.colors && (
          <div className="mt-2 flex gap-1.5">
            {p.colors.map((c) => <span key={c} className="h-3.5 w-3.5 rounded-full ring-1 ring-black/15" style={{ background: c }} />)}
          </div>
        )}
        {p.fit && <div className="mt-2"><FitBadge product={p} vehicle={vehicle} /></div>}
      </Link>
    </motion.div>
  );
}

export function useCountdown(target) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const ms = Math.max(0, target - now);
  return {
    d: Math.floor(ms / 864e5),
    h: Math.floor((ms / 36e5) % 24),
    m: Math.floor((ms / 6e4) % 60),
    s: Math.floor((ms / 1e3) % 60),
    done: ms === 0,
  };
}

export function Countdown({ target, big = false }) {
  const c = useCountdown(target);
  const cells = [["Days", c.d], ["Hrs", c.h], ["Min", c.m], ["Sec", c.s]];
  return (
    <div className="flex gap-3 sm:gap-5">
      {cells.map(([l, v]) => (
        <div key={l} className="text-center">
          <div className={`display tabular-nums ${big ? "text-6xl sm:text-7xl" : "text-4xl"}`}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={v} initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 14, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="inline-block">
                {String(v).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="mt-1 font-mono text-[11px] uppercase text-mute">{l}</div>
        </div>
      ))}
    </div>
  );
}

export function Toast({ show, children }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-bone px-5 py-3 text-sm font-medium text-ink shadow-[0_20px_50px_-20px_rgba(0,0,0,.8)]"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
