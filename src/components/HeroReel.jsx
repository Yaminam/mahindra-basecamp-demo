// Brand-film hero: constant headline over a reel of clips that cut from one to the next,
// with story-style progress segments. Missing clips are skipped automatically.
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ArrowRight, Pause, Play } from "@phosphor-icons/react";
import { img, modelById } from "../data";
import { useStore } from "../store";
import { MaskLines } from "./premium";
import { Magnetic } from "./fx";

const EASE = [0.16, 1, 0.3, 1];
const SHOT = 5200; // ms per clip

export const REEL = [
  { src: "reel/thar-a.mp4", label: "Thar" },
  { still: "jacket.jpg", label: "Heritage Field Jacket", to: "/p/heritage-jacket", pos: "50% 30%" },
  { src: "reel/scorpio.mp4", label: "Scorpio-N" },
  { still: "hoodie.jpg", label: "Trail Hoodie", to: "/p/trail-hoodie", pos: "50% 35%" },
  { src: "reel/xev9e.mp4", label: "XEV 9e, Born Electric" },
  { src: "reel/racing.mp4", label: "Mahindra Racing" },
  { still: "merch/polo-black.jpg", label: "Team Polo", to: "/p/team-polo", pos: "50% 50%" },
  { src: "reel/roxx.mp4", label: "Thar Roxx, Sonamarg" },
  { still: "cap.jpg", label: "Team Trucker Cap", to: "/p/team-cap", pos: "50% 25%" },
  { src: "reel/xuv.mp4", label: "XUV700" },
  { src: "reel/bolero.mp4", label: "Bolero" },
  { src: "reel/tractor.mp4", label: "Mahindra Tractors" },
];

export default function HeroReel() {
  const ref = useRef(null);
  const vids = useRef([]);
  const [clips, setClips] = useState(REEL);
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [t0, setT0] = useState(Date.now());
  const { vehicle, openPicker } = useStore();
  const nav = useNavigate();
  const m = vehicle && modelById(vehicle.model);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const clip = useTransform(scrollYProgress, [0, 1], ["inset(0% 0% 0% 0% round 0px)", "inset(6% 3% 0% 3% round 40px)"]);
  const textO = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.6], ["0%", "-14%"]);

  const drop = (src) => setClips((c) => (c.length > 1 ? c.filter((x) => x.src !== src) : c));
  const keyOf = (c) => c.src || c.still;

  // advance on a timer; restart the incoming clip from the top
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => { setCur((c) => (c + 1) % clips.length); setT0(Date.now()); }, SHOT);
    return () => clearTimeout(id);
  }, [cur, playing, clips.length, t0]);
  useEffect(() => {
    vids.current.forEach((v, i) => {
      if (!v) return;
      if (i === cur) { v.currentTime = 0; if (playing) { const r = v.play(); if (r && r.catch) r.catch(() => {}); } }
      else v.pause();
    });
  }, [cur, clips]);
  useEffect(() => {
    const v = vids.current[cur];
    if (!v) return;
    if (playing) { const r = v.play(); if (r && r.catch) r.catch(() => {}); } else v.pause();
  }, [playing]);

  const go = (i) => { setCur(i); setT0(Date.now()); };

  return (
    <section ref={ref} className="relative h-[100dvh] min-h-[660px]">
      <motion.div style={{ clipPath: clip }} className="absolute inset-0 overflow-hidden bg-black">
        {clips.map((c, i) => (i !== cur && i !== (cur + 1) % clips.length) ? null : c.still ? (
          <motion.img key={c.still} src={img(c.still)} alt="" style={{ objectPosition: c.pos }}
            initial={false} animate={{ opacity: i === cur ? 1 : 0, scale: i === cur ? 1.12 : 1 }}
            transition={{ opacity: { duration: 0.9, ease: "easeInOut" }, scale: { duration: SHOT / 1000 + 1, ease: "linear" } }}
            className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <motion.video
            key={c.src}
            ref={(el) => (vids.current[i] = el)}
            src={img(c.src)}
            muted playsInline preload="auto"
            onError={() => drop(c.src)}
            initial={false}
            animate={{ opacity: i === cur ? 1 : 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/50" />
      </motion.div>

      <motion.div style={{ opacity: textO, y: textY }} className="relative mx-auto flex h-full max-w-[1700px] flex-col justify-end px-5 pb-10 text-white sm:px-10 sm:pb-12">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-sm font-semibold uppercase tracking-[0.3em] text-white/75">Mahindra Basecamp</motion.p>
        <h1 className="display mt-4 text-[16vw] leading-[0.84] sm:text-[11vw] xl:text-[11rem]">
          <MaskLines lines={["One family.", "Every road."]} delay={0.6} />
        </h1>
        <div className="mt-8 flex flex-col gap-6 border-t border-white/20 pt-6 md:flex-row md:items-end md:justify-between">
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.9, ease: EASE }} className="max-w-sm text-lg text-white/80">
            Official merch, genuine accessories and trails for every Mahindra on the road.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25, duration: 0.9, ease: EASE }} className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link to="/merch" className="press flex items-center gap-2 rounded-full bg-red px-7 py-4 text-sm font-semibold text-white hover:bg-white hover:text-bone">
                Shop the merch <ArrowRight size={16} weight="bold" />
              </Link>
            </Magnetic>
            <Magnetic><button onClick={() => (m ? nav("/shop") : openPicker())} className="press flex items-center rounded-full border border-white/40 bg-white/10 px-6 py-4 text-sm font-semibold text-white backdrop-blur hover:border-white">{m ? `Accessories for your ${m.name}` : "Accessories for your car"}</button></Magnetic>
          </motion.div>
        </div>

        {/* reel controls */}
        <div className="mt-8 flex items-center gap-4">
          <button onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause film" : "Play film"} className="press grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/30 hover:border-white">
            {playing ? <Pause size={13} weight="fill" /> : <Play size={13} weight="fill" />}
          </button>
          <div className="flex flex-1 gap-1.5">
            {clips.map((c, i) => (
              <button key={keyOf(c)} onClick={() => go(i)} aria-label={c.label} className="group relative h-6 flex-1">
                <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-white/25 transition group-hover:bg-white/45">
                  {i < cur && <span className="absolute inset-0 bg-white" />}
                  {i === cur && (
                    <motion.span key={t0 + "-" + playing} className="absolute inset-y-0 left-0 bg-white" initial={{ width: "0%" }} animate={{ width: playing ? "100%" : "0%" }} transition={{ duration: SHOT / 1000, ease: "linear" }} />
                  )}
                </span>
              </button>
            ))}
          </div>
          <div className="w-40 shrink-0 overflow-hidden text-right text-sm text-white/75">
            <AnimatePresence mode="wait">
              <motion.span key={clips[cur]?.label + cur} className="block" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.4 }}>{clips[cur]?.label}</motion.span>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
