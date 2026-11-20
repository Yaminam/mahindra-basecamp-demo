import { motion } from "motion/react";
import { Medal, Mountains, Drop, Lightning, Flag, Tent, Lock, CheckCircle } from "@phosphor-icons/react";
import { useStore } from "../store";
import { Reveal, Btn } from "../components/ui";
import { CountUp, MaskLines } from "../components/premium";

const BADGES = [
  { icon: Mountains, name: "Western Ghats", got: true, how: "Great Escape, Sakleshpur" },
  { icon: Drop, name: "River Crossing", got: true, how: "Academy Level 1" },
  { icon: Tent, name: "First Night Out", got: false, how: "Complete any overnight trail" },
  { icon: Flag, name: "Spiti Finisher", got: false, how: "Spiti Expedition" },
  { icon: Lightning, name: "1,000 km Electric", got: false, how: "Drive a BE 6 or XEV 9e 1,000 km" },
  { icon: Medal, name: "Convoy Lead", got: false, how: "Lead a club trail" },
];

const TIERS = [
  { id: "Trail", price: "Free for owners", perks: ["1 point per ₹10 on everything", "Free shipping on accessories", "Trail badges and earned gear", "Service reminders and member prices"] },
  { id: "Summit", price: "₹499 a year", perks: ["Everything in Trail", "24-hour early access to every drop", "Members-only collab pieces", "Double points during drop weeks"] },
];

export default function Pass() {
  const { points, member, setMember } = useStore();
  const next = 2500;
  return (
    <div>
      <section className="relative mx-3 mt-3 overflow-hidden rounded-[40px] bg-red text-white sm:mx-5">
        <div className="absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-white/15 blur-[110px]" />
        <div className="relative mx-auto grid min-h-[78dvh] max-w-[1600px] gap-12 px-6 py-16 sm:px-12 md:grid-cols-[1.3fr_1fr] md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">Basecamp Pass, {member} tier</p>
            <p className="mt-6 text-[26vw] font-semibold leading-[0.8] tracking-[-0.07em] tabular-nums sm:text-[13rem]"><CountUp to={points} /></p>
            <p className="mt-5 text-lg text-white/80">points. Worth {"₹" + Math.floor(points / 4).toLocaleString("en-IN")} off your next order.</p>
          </div>
          <div className="rounded-[28px] bg-white/10 p-7 backdrop-blur">
            <div className="flex justify-between text-sm"><span className="text-white/75">Next reward at {next.toLocaleString("en-IN")} pts</span><span className="tabular-nums">{Math.min(100, Math.round((points / next) * 100))}%</span></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
              <motion.div className="h-full rounded-full bg-white" initial={{ width: 0 }} animate={{ width: `${Math.min(100, (points / next) * 100)}%` }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }} />
            </div>
            <p className="mt-4 text-sm text-white/75">Points come from accessories, merch, service visits and trails.</p>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
      <section className="mt-24">
        <h2 className="display text-6xl sm:text-8xl"><MaskLines lines={["Trail badges."]} inView /></h2>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {BADGES.map((b, i) => (
            <Reveal key={b.name} delay={i * 0.05}>
              <div className={`card flex h-full flex-col items-center p-6 text-center ${b.got ? "" : "opacity-70"}`}>
                <div className={`grid h-16 w-16 place-items-center rounded-full ${b.got ? "bg-red text-white" : "bg-slab text-dim"}`}>
                  {b.got ? <b.icon size={30} weight="fill" /> : <Lock size={24} />}
                </div>
                <p className="mt-4 text-sm font-medium">{b.name}</p>
                <p className="mt-1 text-xs text-mute">{b.how}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-24 grid gap-3 md:grid-cols-2">
        {TIERS.map((t) => (
          <div key={t.id} className={`card p-8 sm:p-10 ${member === t.id ? "ring-2 ring-bone" : ""}`}>
            <div className="flex items-baseline justify-between">
              <h3 className="display text-5xl">{t.id}</h3>
              <span className="text-sm text-mute">{t.price}</span>
            </div>
            <ul className="mt-6 space-y-3">
              {t.perks.map((p) => <li key={p} className="flex items-start gap-2.5 text-sm"><CheckCircle size={18} weight="fill" className="mt-px shrink-0 text-fit" />{p}</li>)}
            </ul>
            {member === t.id ? (
              <p className="mt-8 text-sm text-mute">Your current tier</p>
            ) : (
              <Btn className="mt-8" onClick={() => setMember(t.id)}>Switch to {t.id}</Btn>
            )}
          </div>
        ))}
      </section>
      </div>
    </div>
  );
}
