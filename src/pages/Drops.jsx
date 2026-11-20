import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WhatsappLogo, CheckCircle, Lock, Seal } from "@phosphor-icons/react";
import { useStore } from "../store";
import { DROP_AT, img } from "../data";
import { Photo, Reveal, Btn, Countdown } from "../components/ui";
import { Tilt } from "../components/fx";
import { MaskLines, RevealImage } from "../components/premium";

const UPCOMING = [
  { name: "Formula E Race-Weekend Capsule", when: "January 2027", image: "racing.jpg", note: "Released on race weekend, gone by Monday." },
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

  return (
    <div>
      <section className="relative mx-3 mt-3 overflow-hidden rounded-[40px] bg-[#0b0c0e] text-white sm:mx-5">
        <div className="absolute -left-40 top-1/4 h-[560px] w-[560px] rounded-full bg-red/30 blur-[140px]" />
        <div className="absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-red/15 blur-[120px]" />
        {/* giant outlined year */}
        <motion.p initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute -bottom-[0.12em] right-[-0.04em] select-none text-[34vw] font-semibold leading-none tracking-[-0.08em] text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,.09)]">1947</motion.p>

        <div className="relative mx-auto grid min-h-[90dvh] max-w-[1600px] items-center gap-16 px-6 py-16 sm:px-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-red" /></span>
              Next drop, live countdown
            </motion.div>
            <h1 className="display mt-8 text-[14vw] leading-[0.86] sm:text-[7.5rem] xl:text-[8.5rem]"><MaskLines lines={["Heritage", "Field Jacket."]} delay={0.4} /></h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-6 max-w-md text-lg text-white/60">Waxed cotton, archive detailing and an inner label numbered out of 1,947. Owners can add the last four digits of their VIN.</motion.p>

            <div className="mt-10 grid max-w-lg grid-cols-4 gap-2 [&_.display]:!text-5xl sm:[&_.display]:!text-6xl [&_.text-mute]:!text-white/45 [&>div>div]:w-full">
              <div className="col-span-4 [&>div]:grid [&>div]:grid-cols-4 [&>div]:gap-2 [&>div>div]:rounded-2xl [&>div>div]:border [&>div>div]:border-white/10 [&>div>div]:bg-white/[0.04] [&>div>div]:py-4 [&>div>div]:backdrop-blur">
                <Countdown target={DROP_AT} big />
              </div>
            </div>

            <div className="mt-8 max-w-lg">
              <div className="flex justify-between text-sm text-white/55"><span>Pre-registered</span><span className="tabular-nums">1,312 of 1,947</span></div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full rounded-full bg-red" initial={{ width: 0 }} animate={{ width: "67%" }} transition={{ delay: 1.1, duration: 1.6, ease: [0.16, 1, 0.3, 1] }} />
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              {on ? (
                <span className="flex items-center gap-2 rounded-full bg-fit/20 px-5 py-3.5 text-sm text-[#5fe0a0]"><CheckCircle weight="fill" size={18} /> You will get a WhatsApp alert</span>
              ) : (
                <Btn onClick={() => setOpen(true)} className="py-4"><WhatsappLogo size={18} weight="fill" /> Notify me on WhatsApp</Btn>
              )}
              <span className="flex items-center gap-2 text-sm text-white/55"><Lock size={16} /> {member === "Summit" ? "Your early access opens 24 hours before" : "Pass members get in 24 hours early"}</span>
            </div>
          </div>

          {/* fanned card stack */}
          <div className="group/stack relative mx-auto hidden h-[640px] w-full max-w-[520px] lg:block">
            {[
              { src: "heritage.jpg", label: "Archive, 1947", r: -12, x: -90, y: 30 },
              { src: "merch/keychain.jpg", label: "Brass label, numbered", r: 10, x: 90, y: 40 },
            ].map((c, i) => (
              <motion.div key={c.src} initial={{ opacity: 0, rotate: 0, x: 0, y: 40 }} animate={{ opacity: 1, rotate: c.r, x: c.x, y: c.y }} transition={{ delay: 0.6 + i * 0.12, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-1/2 top-0 h-[520px] w-[360px] -translate-x-1/2 overflow-hidden rounded-[28px] border border-white/10 shadow-2xl transition-transform duration-700 group-hover/stack:scale-[1.03]">
                <img src={img(c.src)} alt="" className="h-full w-full object-cover opacity-70" />
                <p className="absolute bottom-5 left-5 text-sm text-white/80">{c.label}</p>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 1.1, ease: [0.16, 1, 0.3, 1] }} className="absolute left-1/2 top-6 w-[380px] -translate-x-1/2">
              <Tilt holo max={12} className="rounded-[28px]">
                <div className="relative overflow-hidden rounded-[28px] shadow-[0_60px_120px_-30px_rgba(221,5,43,.55)]">
                  <Photo src="jacket.jpg" alt="Heritage Field Jacket" eager className="h-[560px]" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/90 to-transparent p-6">
                    <div>
                      <p className="font-mono text-xs text-white/70">No. 0001 / 1947</p>
                      <p className="mt-1 text-sm text-white/80">{vin4 ? `VIN ending ${vin4}` : "Your VIN on the label"}</p>
                    </div>
                    <span className="text-2xl font-semibold tabular-nums">₹9,999</span>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          </div>
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
