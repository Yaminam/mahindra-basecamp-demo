// Worlds accordion: auto-cycles until you take over, panels bloom from mono to colour,
// the open panel shows live products from that world.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { WORLDS, ALL_PRODUCTS, img } from "../data";
import { MaskLines } from "./premium";
import { Photo } from "./ui";

const EASE = [0.16, 1, 0.3, 1];
const CYCLE = 4200;

const productsFor = (w) =>
  ALL_PRODUCTS.filter((p) =>
    w.id === "scorpio" ? p.fit?.includes("scorpion") && p.kind === "accessory"
    : w.id === "xuv" ? p.fit?.includes("xuv700") && p.kind === "accessory"
    : p.world === w.id || (w.id === "electric" && p.cat === "charging"));

export default function WorldsPan({ bare = false }) {
  const [open, setOpen] = useState(0);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (held) return;
    const t = setTimeout(() => setOpen((o) => (o + 1) % WORLDS.length), CYCLE);
    return () => clearTimeout(t);
  }, [open, held]);

  return (
    <section className="mx-auto mt-40 max-w-[1600px] px-5 sm:px-8">
      {!bare && (
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="display text-6xl sm:text-8xl lg:text-[8.5rem]"><MaskLines lines={["Pick your", "world."]} inView /></h2>
          <p className="max-w-sm text-lg text-mute">Every Mahindra has its own culture. Each world has its own gear, stories and drops.</p>
        </div>
      )}

      <div className="hidden h-[80vh] min-h-[600px] gap-2 lg:flex" onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)}>
        {WORLDS.map((w, i) => {
          const on = open === i;
          const items = productsFor(w);
          return (
            <motion.div key={w.id} onMouseEnter={() => setOpen(i)} onFocus={() => setOpen(i)}
              animate={{ flexGrow: on ? 8 : 1 }} transition={{ duration: 0.9, ease: EASE }}
              className="group relative min-w-0 basis-0 overflow-hidden rounded-[30px] bg-black">
              <motion.img src={img(w.image)} alt="" animate={{ scale: on ? 1.02 : 1.3, filter: on ? "grayscale(0) brightness(1)" : "grayscale(1) brightness(0.55)" }}
                transition={{ duration: 1.2, ease: EASE }} className="absolute inset-0 h-full w-full object-cover" />
              <div className={`absolute inset-0 transition-opacity duration-700 ${on ? "bg-gradient-to-t from-black/85 via-black/10 to-black/30" : "bg-black/20"}`} />

              <AnimatePresence>
                {!on && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute bottom-7 left-1/2 -translate-x-1/2 rotate-180 whitespace-nowrap text-xl font-semibold tracking-tight text-white [writing-mode:vertical-rl]">{w.name}</motion.span>
                )}
              </AnimatePresence>

              {on && !held && (
                <motion.span key={"p" + i + open} className="absolute left-6 right-6 top-6 h-[2px] origin-left bg-white/80" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: CYCLE / 1000, ease: "linear" }} />
              )}
              <span className={`absolute top-10 text-xs font-semibold tabular-nums ${on ? "left-6 text-white/80" : "left-1/2 -translate-x-1/2 text-white/60"}`}>{String(i + 1).padStart(2, "0")}</span>

              <AnimatePresence>
                {on && (
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
                    className="absolute inset-x-0 bottom-0 z-10 p-8 text-white">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">{w.kicker}</p>
                    <div className="mt-2 flex items-end justify-between gap-6">
                      <div>
                        <p className="display text-6xl xl:text-8xl">{w.name}</p>
                        <p className="mt-3 max-w-md text-white/75">{w.blurb}</p>
                      </div>
                      <Link to={`/worlds/${w.id}`} className="press flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-bone hover:bg-red hover:text-white">
                        Explore {items.length > 0 && <span className="tabular-nums opacity-60">{items.length}</span>} <ArrowUpRight size={16} />
                      </Link>
                    </div>
                    {items.length > 0 && (
                      <div className="mt-6 grid max-w-[760px] grid-cols-3 gap-3">
                        {items.slice(0, 3).map((p, k) => (
                          <motion.div key={p.id} className="min-w-0" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 + k * 0.08 }}>
                            <Link to={`/p/${p.id}`} className="flex w-full min-w-0 items-center gap-3 rounded-2xl bg-white/10 p-2 pr-3 backdrop-blur-md transition hover:bg-white/20">
                              <Photo src={p.image} className="h-14 w-14 shrink-0 rounded-xl" />
                              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{p.name}</span><span className="text-xs tabular-nums text-white/70">₹{p.price.toLocaleString("en-IN")}</span></span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              {!on && <Link to={`/worlds/${w.id}`} aria-label={w.name} className="absolute inset-0" />}
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-3 lg:hidden">
        {WORLDS.map((w) => (
          <Link key={w.id} to={`/worlds/${w.id}`} className="relative block h-56 overflow-hidden rounded-[24px]">
            <img src={img(w.image)} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-black/10" />
            <div className="absolute bottom-0 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">{w.kicker}</p>
              <p className="display mt-1 text-4xl">{w.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
