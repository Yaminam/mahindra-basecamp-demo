import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, Shuffle, CheckCircle, ShoppingBag, ArrowsOutSimple } from "@phosphor-icons/react";
import Studio from "../three/Studio";
import Safe3D from "./Safe3D";
import { PAINTS, RIMS } from "../three/Vehicle";
import { BUILD_ACC, BUILD_MODELS, productById, inr } from "../data";
import { useStore } from "../store";

const EASE = [0.16, 1, 0.3, 1];

const matchModel = (v) => {
  if (!v) return BUILD_MODELS[0];
  const id = v.model;
  if (id === "thar" || id === "roxx") return BUILD_MODELS[0];
  if (id.startsWith("scorpio")) return BUILD_MODELS[1];
  if (id.startsWith("xuv") || id === "boleroneo") return BUILD_MODELS[2];
  return BUILD_MODELS[3];
};

export default function Configurator({ full = false }) {
  const add = useStore((s) => s.add);
  const vehicle = useStore((s) => s.vehicle);
  const startModel = matchModel(vehicle);
  const [model, setModel] = useState(startModel);
  const [paint, setPaint] = useState(PAINTS[0]);
  const [rim, setRim] = useState(RIMS[1]);
  const [roof, setRoof] = useState("black");
  const [acc, setAcc] = useState(startModel.start);
  const [night, setNight] = useState(false);
  const [added, setAdded] = useState(false);

  const options = BUILD_ACC.filter((a) => model.acc.includes(a.key));
  const chosen = options.filter((a) => acc[a.key]).map((a) => productById(a.product));
  const total = chosen.reduce((t, p) => t + p.price, 0);

  const pickModel = (m) => { setModel(m); setAcc(m.start); };
  const shuffle = () => {
    setPaint(PAINTS[Math.floor(Math.random() * PAINTS.length)]);
    setRim(RIMS[Math.floor(Math.random() * RIMS.length)]);
    setRoof(Math.random() > 0.5 ? "black" : "body");
    setAcc(Object.fromEntries(model.acc.map((k) => [k, Math.random() > 0.45])));
  };
  const addBuild = () => {
    chosen.forEach((p) => add({ id: p.id, name: p.name, price: p.price, image: p.image, mode: "dealer", kind: "accessory", slot: "Slot on confirmation", dealer: "Your nearest dealer" }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2600);
  };

  return (
    <div className={`relative overflow-hidden ${night ? "bg-[#04060a] text-white" : "bg-[#e9eaee] text-bone"} ${full ? "h-[calc(100dvh-6rem)]" : "h-[88dvh] min-h-[680px] rounded-[36px]"}`}>
      <Safe3D fallback="thar-red.jpg">
        <Studio className="absolute inset-0" night={night} config={{ model: model.id, paint: paint.hex, rim: rim.hex, roof, acc }} />
      </Safe3D>

      <div className="absolute left-6 top-6 max-w-[52%] sm:left-10 sm:top-10">
        <div className={`flex flex-wrap gap-1 rounded-full border p-1 backdrop-blur-xl ${night ? "border-white/10 bg-white/5" : "border-black/5 bg-white/70"}`}>
          {BUILD_MODELS.map((m) => (
            <button key={m.id} onClick={() => pickModel(m)} className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${model.id === m.id ? (night ? "text-bone" : "text-white") : "opacity-60 hover:opacity-100"}`}>
              {model.id === m.id && <motion.span layoutId="cfgmodel" className={`absolute inset-0 rounded-full ${night ? "bg-white" : "bg-bone"}`} transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className="relative">{m.name}</span>
            </button>
          ))}
        </div>
        <div className="pointer-events-none mt-8">
          <p className="text-sm opacity-55">{model.name}, in</p>
          <AnimatePresence mode="wait">
            <motion.h3 key={paint.id + model.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.5, ease: EASE }} className="display mt-1 text-4xl sm:text-6xl">
              {paint.name}
            </motion.h3>
          </AnimatePresence>
          <p className="mt-3 text-sm opacity-55">Drag to rotate. Every part is a genuine accessory.</p>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 flex gap-2 sm:bottom-10 sm:left-10">
        <button onClick={() => setNight(!night)} aria-label="Toggle night mode" className={`press flex h-11 items-center gap-2 rounded-full px-4 text-sm backdrop-blur ${night ? "border border-white/15 bg-white/5 hover:border-white/40" : "border border-black/10 bg-white/80 hover:border-black/30"}`}>
          {night ? <Sun size={18} /> : <Moon size={18} />} {night ? "Back to studio" : "Night drive"}
        </button>
        <button onClick={shuffle} aria-label="Surprise me" className={`press grid h-11 w-11 place-items-center rounded-full ${night ? "border border-white/15 bg-white/5 hover:border-white/40" : "border border-black/10 bg-white/80 hover:border-black/30"} backdrop-blur`}><Shuffle size={18} /></button>
        {!full && <Link to="/build" aria-label="Open full screen" className={`press grid h-11 w-11 place-items-center rounded-full ${night ? "border border-white/15 bg-white/5 hover:border-white/40" : "border border-black/10 bg-white/80 hover:border-black/30"} backdrop-blur`}><ArrowsOutSimple size={18} /></Link>}
      </div>

      <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }}
        data-lenis-prevent
        className="no-scrollbar absolute inset-x-3 bottom-3 max-h-[52%] overflow-y-auto rounded-[28px] border border-white/10 bg-[#141518]/80 p-6 backdrop-blur-2xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[370px] lg:bottom-auto lg:right-8 lg:top-8 lg:max-h-[calc(100%-4rem)]">
        <p className="text-xs uppercase tracking-[0.2em] text-white/45">Paint</p>
        <div className="mt-3 flex gap-2.5">
          {PAINTS.map((p) => (
            <button key={p.id} onClick={() => setPaint(p)} aria-label={p.name} title={p.name}
              className={`press h-9 w-9 rounded-full ring-offset-2 ring-offset-[#141518] transition ${paint.id === p.id ? "ring-2 ring-white" : "ring-1 ring-white/15"}`} style={{ background: `radial-gradient(circle at 35% 30%, #ffffff55, ${p.hex} 60%)` }} />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">Wheels</p>
            <div className="mt-3 flex gap-2">
              {RIMS.map((r) => (
                <button key={r.id} onClick={() => setRim(r)} aria-label={r.name} title={r.name}
                  className={`press h-8 w-8 rounded-full ring-offset-2 ring-offset-[#141518] ${rim.id === r.id ? "ring-2 ring-white" : "ring-1 ring-white/15"}`} style={{ background: `radial-gradient(circle at 35% 30%, #fff9, ${r.hex} 55%)` }} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">Roof</p>
            <div className="mt-3 flex rounded-full bg-white/5 p-1 text-xs">
              {[["black", "Black"], ["body", "Body"]].map(([id, l]) => (
                <button key={id} onClick={() => setRoof(id)} className={`relative flex-1 rounded-full py-1.5 ${roof === id ? "text-bone" : "text-white/60"}`}>
                  {roof === id && <motion.span layoutId="roof" className="absolute inset-0 rounded-full bg-white" />}
                  <span className="relative">{l}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-7 text-xs uppercase tracking-[0.2em] text-white/45">Genuine accessories for {model.name}</p>
        <div className="mt-3 space-y-1.5">
          {options.map((a) => {
            const p = productById(a.product);
            const on = !!acc[a.key];
            return (
              <motion.button key={model.id + a.key} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                onClick={() => setAcc({ ...acc, [a.key]: !on })}
                className={`press flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition ${on ? "bg-white text-bone" : "bg-white/[0.05] text-white hover:bg-white/10"}`}>
                <span className="flex items-center gap-2.5">
                  <span className={`grid h-4 w-4 place-items-center rounded-full border ${on ? "border-red bg-red" : "border-white/30"}`}>{on && <CheckCircle size={16} weight="fill" className="text-white" />}</span>
                  {a.label}
                </span>
                <span className={`text-xs tabular-nums ${on ? "text-bone/60" : "text-white/50"}`}>{inr(p.price)}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-7 flex items-end justify-between border-t border-white/10 pt-5">
          <div>
            <p className="text-xs text-white/45">Accessories total</p>
            <motion.p key={total} initial={{ opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">{inr(total)}</motion.p>
          </div>
          <button onClick={addBuild} disabled={!chosen.length} className="press flex items-center gap-2 rounded-full bg-red px-5 py-3.5 text-sm font-semibold text-white hover:bg-red-deep disabled:opacity-40">
            {added ? <><CheckCircle size={18} weight="fill" /> Added</> : <><ShoppingBag size={18} /> Add build</>}
          </button>
        </div>
        <p className="mt-3 text-[11px] text-white/40">Fitted at your dealer. Warranty intact.</p>
      </motion.div>
    </div>
  );
}
