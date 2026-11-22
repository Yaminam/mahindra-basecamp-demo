import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WhatsappLogo, CheckCircle, Lock, Seal } from "@phosphor-icons/react";
import { useStore } from "../store";
import { DROP_AT, img } from "../data";
import { Photo, Reveal, Btn, Countdown, useCountdown } from "../components/ui";
import { Tilt } from "../components/fx";
import { MaskLines, RevealImage } from "../components/premium";

const UPCOMING = [
  { name: "Formula E Race-Weekend Capsule", when: "January 2027", image: "merch/softshell.jpg", note: "Released on race weekend, gone by Monday." },
  { name: "Great Escape Patch Series", when: "Earned, not sold", image: "trail-ladakh.jpg", note: "Unlocked by finishing a trail." },
  { name: "Born Electric Reflective Line", when: "February 2027", image: "ev.jpg", note: "Night-drive apparel for EV owners." },
];
const ARCHIVE = [
  { name: "Roxx Launch Tee", pieces: "2,024 pieces", image: "tee.jpg" },
  { name: "Monsoon Trail Shell", pieces: "1,500 pieces", image: "jacket.jpg" },
  { name: "1:18 Thar Desert Fury", pieces: "999 pieces", image: "diecast.jpg" },
  { name: "Team Trucker Cap, Launch Run", pieces: "750 pieces", image: "merch/cap-black.jpg" },
];

export default function Drops() {
  const { notify, addNotify, member } = useStore();
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [vin4, setVin4] = useState("");
  const on = notify.includes("heritage");
  const valid = /^[6-9]\d{9}$/.test(phone);
  const t = useCountdown(DROP_AT);

  return (
    <div>
      <section className="relative mx-3 mt-3 overflow-hidden rounded-[40px] bg-[#0b0c0e] text-white sm:mx-5">
        <div className="absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red/25 blur-[140px]" />
        {/* drifting giant wordmark */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden" aria-hidden>
          <div className="flex w-max animate-[marquee_60s_linear_infinite] gap-16 motion-reduce:animate-none">
            {[0, 1].map((k) => (
              <span key={k} className="whitespace-nowrap text-[22vw] font-semibold leading-none tracking-[-0.07em] text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,.08)]">HERITAGE 1947 HERITAGE 1947</span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto grid min-h-[calc(100dvh-96px)] max-w-[1700px] items-center gap-10 px-6 py-12 sm:px-12 lg:grid-cols-[1fr_auto_1fr]">
          {/* left: story */}
          <div className="max-w-md">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-red" /></span>
              Drop 07
            </motion.div>
            <h1 className="display mt-6 text-6xl leading-[0.88] xl:text-[5.5rem]"><MaskLines lines={["Heritage", "Field Jacket."]} delay={0.4} /></h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-6 text-lg text-white/60">Waxed cotton and archive detailing, with an inner label numbered out of 1,947. Owners can stitch in their VIN.</motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-8 flex items-baseline gap-3">
              <span className="text-4xl font-semibold tracking-tight tabular-nums">₹9,999</span>
              <span className="text-sm text-white/45">1 per customer</span>
            </motion.div>
          </div>

          {/* centre: product */}
          <motion.div initial={{ opacity: 0, y: 60, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="relative mx-auto w-[min(78vw,400px)]">
            <Tilt holo max={14} className="rounded-[30px]">
              <div className="relative overflow-hidden rounded-[30px] shadow-[0_60px_140px_-30px_rgba(221,5,43,.6)]">
                <Photo src="jacket.jpg" alt="Heritage Field Jacket" eager className="aspect-[4/5]" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/85 to-transparent p-5">
                  <p className="font-mono text-xs text-white/75">No. 0001 / 1947</p>
                  <p className="text-xs text-white/75">{vin4 ? `VIN ending ${vin4}` : "Your VIN here"}</p>
                </div>
              </div>
            </Tilt>
            {[
              ["Waxed cotton", "-left-40 top-[14%]", "left"],
              ["Brass hardware", "-left-36 bottom-[12%]", "left"],
            ].map(([t, pos, side], i) => (
              <motion.div key={t} initial={{ opacity: 0, x: side === "left" ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 + i * 0.15 }}
                className={`absolute hidden items-center gap-3 xl:flex ${pos} ${side === "right" ? "flex-row-reverse" : ""}`}>
                <span className="whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs backdrop-blur">{t}</span>
                <span className="h-px w-14 bg-white/30" />
                <span className="h-1.5 w-1.5 rounded-full bg-red" />
              </motion.div>
            ))}
          </motion.div>

          {/* right: countdown + CTA */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-sm justify-self-end">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Drops in</p>
            <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
              {[["Days", t.d], ["Hours", t.h], ["Minutes", t.m], ["Seconds", t.s]].map(([l, v]) => (
                <div key={l} className="flex items-baseline justify-between py-2.5">
                  <span className="text-sm text-white/45">{l}</span>
                  <span className="text-4xl font-semibold tabular-nums tracking-tight">{String(v).padStart(2, "0")}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-xs text-white/50"><span>Pre-registered</span><span className="tabular-nums">1,312 / 1,947</span></div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full rounded-full bg-red" initial={{ width: 0 }} animate={{ width: "67%" }} transition={{ delay: 1.3, duration: 1.6, ease: [0.16, 1, 0.3, 1] }} />
              </div>
            </div>
            <div className="mt-7">
              {on ? (
                <span className="flex w-full items-center justify-center gap-2 rounded-full bg-fit/20 py-4 text-sm text-[#5fe0a0]"><CheckCircle weight="fill" size={18} /> You're on the WhatsApp list</span>
              ) : (
                <Btn onClick={() => setOpen(true)} className="w-full py-4"><WhatsappLogo size={18} weight="fill" /> Notify me on WhatsApp</Btn>
              )}
              <p className="mt-3 flex items-center justify-center gap-2 text-xs text-white/45"><Lock size={14} /> {member === "Summit" ? "Your early access opens 24 hours before" : "Pass members get in 24 hours early"}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto mt-32 max-w-[1600px] px-5 sm:px-8">
        <h2 className="display text-6xl sm:text-8xl"><MaskLines lines={["Coming up."]} inView /></h2>
        <div className="mt-12 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          {UPCOMING.slice(0, 1).map((u) => (
            <div key={u.name} className="relative min-h-[620px] overflow-hidden rounded-[36px] text-white">
              <RevealImage src={u.image} alt={u.name} className="absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-8 sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">{u.when}</p>
                <p className="display mt-3 text-5xl sm:text-6xl">{u.name}</p>
                <p className="mt-3 text-white/70">{u.note}</p>
              </div>
            </div>
          ))}
          <div className="grid gap-5">
            {UPCOMING.slice(1).map((u, i) => (
              <div key={u.name} className="relative min-h-[300px] overflow-hidden rounded-[36px] text-white">
                <RevealImage src={u.image} alt={u.name} delay={0.1 + i * 0.1} className="absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-0 p-7">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">{u.when}</p>
                  <p className="display mt-2 text-4xl">{u.name}</p>
                  <p className="mt-2 text-sm text-white/70">{u.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-32 max-w-[1600px] px-5 sm:px-8">
        <div className="flex items-end justify-between">
          <h2 className="display text-5xl sm:text-6xl">The archive.</h2>
          <p className="text-mute">Sold out. Every one.</p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {ARCHIVE.map((a, i) => (
            <Reveal key={a.name} delay={i * 0.06} className="group">
              <div className="relative overflow-hidden rounded-[24px] bg-[#e9eaec]">
                <Photo src={a.image} alt={a.name} className="aspect-square grayscale transition duration-700 group-hover:grayscale-0" />
                <span className="absolute left-3 top-3 rounded-full bg-bone px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">Sold out</span>
              </div>
              <p className="mt-3 font-medium">{a.name}</p>
              <p className="text-sm text-mute">{a.pieces}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.div onClick={(e) => e.stopPropagation()} initial={{ y: 30, scale: 0.97 }} animate={{ y: 0, scale: 1 }} className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-2xl">
              <WhatsappLogo size={36} weight="fill" className="text-fit" />
              <h2 className="display mt-4 text-4xl">Get the alert</h2>
              <p className="mt-2 text-sm text-mute">One message when the drop opens. Nothing else.</p>
              <label htmlFor="ph" className="mt-6 block text-xs text-mute">Mobile number</label>
              <div className="mt-2 flex items-center rounded-2xl bg-white shadow-[inset_0_0_0_1px_rgba(12,13,15,.08)] focus-within:shadow-[inset_0_0_0_2px_#1c1c1c]">
                <span className="pl-4 font-mono text-sm text-mute">+91</span>
                <input id="ph" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} className="w-full bg-transparent px-3 py-3.5 font-mono text-sm focus:outline-none" placeholder="98XXXXXXXX" />
              </div>
              {phone.length === 10 && !valid && <p className="mt-2 text-xs text-red">Enter a valid Indian mobile number</p>}
              <label htmlFor="v4" className="mt-4 block text-xs text-mute">Last 4 of your VIN, for the label (optional)</label>
              <input id="v4" value={vin4} onChange={(e) => setVin4(e.target.value.toUpperCase().slice(0, 4))} className="field mt-2 font-mono" />
              <Btn className="mt-6 w-full py-4 disabled:opacity-40" disabled={!valid} onClick={() => { addNotify("heritage"); setOpen(false); }}>Notify me</Btn>
              <p className="mt-3 text-center text-xs text-mute">By continuing you agree to receive this alert on WhatsApp.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
