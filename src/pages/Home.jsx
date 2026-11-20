import { useRef, useState, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValueEvent } from "motion/react";
import { ArrowRight, ArrowUpRight, Garage, Storefront, Medal, Lightning, Seal, Mountains, Play, Pause, CheckCircle, Package, Wrench, Flag } from "@phosphor-icons/react";
import { useStore } from "../store";
import { PACKS, DROP_AT, EXPERIENCES, productById, modelById, inr, fits, img } from "../data";
import { Photo, Reveal, Btn, ProductCard, Countdown } from "../components/ui";
import { Tilt, Magnetic, Marquee } from "../components/fx";
import { MaskLines, ScrollText, CountUp, RevealImage, Rail } from "../components/premium";
import WorldsPan from "../components/WorldsPan";
import HeroReel from "../components/HeroReel";
import MerchShowcase from "../components/MerchShowcase";
import MerchTicker from "../components/MerchTicker";
import { ShopTheLook } from "./Merch";
import { MahindraMark } from "../components/Logo";

const Configurator = lazy(() => import("../components/Configurator"));
const EASE = [0.16, 1, 0.3, 1];
const EXPO = [0.76, 0, 0.24, 1];

function Statement() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 pb-32 pt-36 sm:px-8 sm:pt-48">
      <ScrollText
        className="max-w-[17ch] text-[9vw] font-semibold leading-[1.02] tracking-[-0.045em] sm:max-w-[22ch] sm:text-6xl lg:text-[5.25rem]"
        text="Six lakh new Mahindras hit Indian roads last year. Every one deserves genuine gear that fits, merch worth wearing and a trail worth driving."
      />
    </section>
  );
}

function Stats() {
  const items = [
    { to: 6.6, d: 1, s: "L", l: "Mahindra SUVs sold in FY26" },
    { to: 4, d: 0, s: "L+", l: "Thars on Indian roads" },
    { to: 1, d: 0, s: "L+", l: "Born Electric owners" },
    { to: 3, d: 0, s: "", l: "Ways to get it fitted" },
  ];
  return (
    <section className="relative mx-3 overflow-hidden rounded-[40px] text-white sm:mx-5">
      <RevealImage src="thar-splash.jpg" alt="Mahindra Thar crossing water" className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/30" />
      <div className="relative mx-auto flex min-h-[78vh] max-w-[1600px] flex-col justify-between gap-16 px-6 py-14 sm:px-12 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">By the numbers</p>
          <p className="max-w-xs text-white/70">The owners this store is built for. And until now, no official place to shop.</p>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.l} delay={i * 0.08} className="border-t border-white/25 pt-6">
              <p className="text-[17vw] font-semibold leading-none tracking-[-0.06em] tabular-nums sm:text-8xl xl:text-[8.5rem]"><CountUp to={it.to} decimals={it.d} suffix={it.s} /></p>
              <p className="mt-4 max-w-[16ch] text-white/75">{it.l}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BuildSection() {
  return (
    <section className="mx-auto max-w-[1600px] px-3 pt-40 sm:px-5">
      <div className="mb-12 flex flex-col gap-6 px-2 sm:px-3 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="display text-6xl sm:text-8xl lg:text-[8.5rem]"><MaskLines lines={["Build your", "beast."]} inView /></h2>
        <Reveal className="max-w-sm">
          <p className="text-lg text-mute">Paint, wheels, roof carrier, light bar and winch bumper. Bolt it on in real time, see the price, and add the whole build to your bag.</p>
          <Link to="/build" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] hover:text-red">Open full screen <ArrowUpRight size={16} /></Link>
        </Reveal>
      </div>
      <Suspense fallback={<div className="h-[86dvh] animate-pulse rounded-[32px] bg-slab" />}>
        <Configurator />
      </Suspense>
    </section>
  );
}

const STEPS = [
  { icon: Garage, k: "My Garage", t: "Tell us what you drive.", d: "Pick your model or scan your VIN. From then on, everything you see fits your vehicle. Nothing else.", image: "hero-thar.jpg" },
  { icon: Storefront, k: "Fit it your way", t: "Ship it. Fit it. Done.", d: "One national price on every genuine part. Ship it home, book your dealer, or have a technician come to you.", image: "dealer.jpg" },
  { icon: Medal, k: "Basecamp Pass", t: "Earn on every mile.", d: "Points on accessories, merch, service and trails. Finish a Great Escape and unlock gear money cannot buy.", image: "trail-ladakh.jpg" },
];

/* Live UI cards that preview what each step feels like in the store. */
function StepCard({ i }) {
  if (i === 0)
    return (
      <div className="w-full max-w-sm rounded-[26px] bg-white/90 p-6 text-bone shadow-2xl backdrop-blur-xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mute">My Garage</p>
        <p className="display mt-2 text-4xl">Thar Roxx</p>
        <p className="text-sm text-mute">AX7L 4x4, 2025</p>
        <div className="mt-6 flex items-center justify-between rounded-2xl bg-fit/10 px-4 py-3 text-fit">
          <span className="flex items-center gap-2 text-sm font-medium"><CheckCircle size={18} weight="fill" /> Genuine parts that fit</span>
          <span className="text-2xl font-semibold tabular-nums"><CountUp to={142} /></span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-mute">
          {["Roof", "Off-road", "Interior"].map((c, k) => <span key={c} className={`rounded-xl py-2 ${k === 0 ? "bg-bone text-white" : "bg-slab"}`}>{c}</span>)}
        </div>
      </div>
    );
  if (i === 1)
    return (
      <div className="w-full max-w-sm space-y-2 rounded-[26px] bg-white/90 p-5 text-bone shadow-2xl backdrop-blur-xl">
        {[["Ship home", "Delivers in 3 days", Package], ["Fit at my dealer", "Sat 10:30, Baner", Storefront], ["Doorstep fitment", "Technician visit", Wrench]].map(([t, s, I], k) => (
          <div key={t} className={`flex items-center gap-3 rounded-2xl p-3.5 ${k === 1 ? "bg-white shadow-[inset_0_0_0_2px_#1c1c1c]" : "bg-slab/70"}`}>
            <I size={22} className={k === 1 ? "text-red" : "text-mute"} />
            <span className="flex-1"><span className="block text-sm font-medium">{t}</span><span className="block text-xs text-mute">{s}</span></span>
            <span className={`h-5 w-5 rounded-full ${k === 1 ? "border-[6px] border-red" : "border-2 border-line"}`} />
          </div>
        ))}
        <div className="flex items-center justify-between px-1 pt-2"><span className="text-sm text-mute">Trail Roof Carrier</span><span className="text-xl font-semibold tabular-nums">₹24,990</span></div>
      </div>
    );
  return (
    <div className="w-full max-w-sm rounded-[26px] bg-white/90 p-6 text-bone shadow-2xl backdrop-blur-xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mute">Basecamp Pass</p>
      <p className="mt-2 text-6xl font-semibold tracking-[-0.05em] tabular-nums"><CountUp to={3739} /></p>
      <p className="text-sm text-mute">points, +2,499 from your last order</p>
      <div className="mt-6 flex gap-3">
        {[[Mountains, true], [Medal, true], [Flag, false]].map(([I, got], k) => (
          <span key={k} className={`grid h-14 w-14 place-items-center rounded-full ${got ? "bg-red text-white" : "bg-slab text-dim"}`}><I size={24} weight={got ? "fill" : "regular"} /></span>
        ))}
      </div>
      <p className="mt-4 text-sm text-mute">Western Ghats badge unlocked. Spiti next.</p>
    </div>
  );
}

function Story() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(2, Math.floor(v * 3))));
  const s = STEPS[active];
  return (
    <section ref={ref} className="relative mt-40 h-[320vh]">
      <div className="sticky top-0 h-[100dvh] p-3 sm:p-5">
        <div className="relative h-full overflow-hidden rounded-[40px] bg-black text-white">
          <AnimatePresence mode="popLayout">
            <motion.img key={active} src={img(s.image)} alt="" className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.1, ease: EASE }} />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />

          <div className="relative mx-auto grid h-full max-w-[1600px] items-center gap-10 px-6 pt-20 sm:px-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">How Basecamp works</p>
              <div className="mt-8 flex items-start gap-6">
                <span className="display text-[22vw] leading-[0.8] text-white/15 tabular-nums sm:text-[12rem]">0{active + 1}</span>
                <AnimatePresence mode="wait">
                  <motion.div key={active} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6, ease: EASE }} className="pt-2">
                    <p className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-red"><s.icon size={20} /> {s.k}</p>
                    <h3 className="display mt-4 text-5xl sm:text-7xl">{s.t}</h3>
                    <p className="mt-5 max-w-md text-lg text-white/75">{s.d}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <div className="hidden justify-end lg:flex">
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, y: 50, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -40, rotate: -2 }} transition={{ duration: 0.7, ease: EASE }} className="flex w-full justify-end">
                  <StepCard i={active} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="absolute inset-x-6 bottom-6 grid grid-cols-3 gap-3 sm:inset-x-12 sm:bottom-10">
            {STEPS.map((st, i) => (
              <div key={st.k}>
                <div className="h-[3px] overflow-hidden rounded-full bg-white/20">
                  <motion.div className="h-full bg-white" style={{ scaleX: useTransform(scrollYProgress, [i / 3, (i + 1) / 3], [0, 1]), transformOrigin: "left" }} />
                </div>
                <p className={`mt-3 text-sm transition-colors ${i === active ? "text-white" : "text-white/45"}`}>{st.k}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MerchSpread() {
  const polo = productById("team-polo");
  const cap = productById("team-cap");
  return (
    <section className="mx-auto mt-40 max-w-[1600px] px-5 sm:px-8">
      <div className="grid gap-5 lg:grid-cols-12">
        <Link to="/merch" className="group relative lg:col-span-7">
          <RevealImage src="racing.jpg" alt="Mahindra Racing" className="aspect-[4/5] rounded-[32px] lg:aspect-auto lg:h-full lg:min-h-[760px]" imgClass="transition-transform duration-1000 group-hover:scale-105" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-[32px] bg-gradient-to-t from-black/75 to-transparent p-8 text-white sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/75">Mahindra Racing</p>
            <p className="display mt-2 text-5xl sm:text-7xl">2026 Team Collection</p>
          </div>
        </Link>
        <div className="flex flex-col gap-5 lg:col-span-5">
          <Reveal className="rounded-[32px] bg-white p-8 sm:p-10">
            <h2 className="display text-5xl sm:text-6xl">Wear the team.</h2>
            <p className="mt-4 max-w-sm text-lg text-mute">Garage-issue teamwear, priced in rupees. Add your name and number like the drivers do.</p>
            <Btn as={Link} to="/merch" className="mt-8 py-4">Shop the collection <ArrowRight size={16} weight="bold" /></Btn>
          </Reveal>
          <div className="grid flex-1 grid-cols-2 gap-5">
            {[polo, cap].map((p, i) => (
              <Link key={p.id} to={`/p/${p.id}`} className="group">
                <RevealImage src={p.image} alt={p.name} delay={i * 0.1} className="aspect-[4/5] rounded-[24px] bg-[#e9eaec]" imgClass="transition-transform duration-700 group-hover:scale-105" />
                <div className="mt-3 flex justify-between gap-2 text-[15px]"><span className="font-medium">{p.name}</span><span className="tabular-nums">{inr(p.price)}</span></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DropNight() {
  return (
    <section className="mx-3 mt-40 overflow-hidden rounded-[40px] bg-[#0e0f11] text-white sm:mx-5">
      <div className="mx-auto grid max-w-[1600px] items-center gap-16 px-6 py-20 sm:px-12 sm:py-28 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red">Numbered drop. 1,947 pieces.</p>
          <h2 className="display mt-6 text-6xl sm:text-8xl lg:text-[8rem]"><MaskLines lines={["Heritage", "Field Jacket."]} inView /></h2>
          <p className="mt-6 max-w-md text-lg text-white/60">Waxed cotton and a numbered inner label. Owners can add their VIN. Pass members get in 24 hours early.</p>
          <div className="mt-12 [&_.text-mute]:text-white/45"><Countdown target={DROP_AT} big /></div>
          <Btn as={Link} to="/drops" className="mt-12 py-4">Get early access <ArrowRight size={16} weight="bold" /></Btn>
        </div>
        <Tilt holo max={12} className="mx-auto w-full max-w-md rounded-[28px]">
          <div className="relative overflow-hidden rounded-[28px] shadow-[0_60px_120px_-40px_rgba(221,5,43,.45)]">
            <Photo src="jacket.jpg" alt="Heritage Field Jacket" className="aspect-[4/5]" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/85 to-transparent p-6">
              <div>
                <p className="font-mono text-xs text-white/70">No. 0001 / 1947</p>
                <p className="display mt-1 text-3xl">Heritage</p>
              </div>
              <Seal size={36} weight="fill" className="text-red" />
            </div>
          </div>
        </Tilt>
      </div>
    </section>
  );
}

function Packs() {
  const vehicle = useStore((s) => s.vehicle);
  const add = useStore((s) => s.add);
  const m = vehicle && modelById(vehicle.model);
  const priced = PACKS.map((pk) => {
    const items = pk.items.map(productById);
    const full = items.reduce((t, p) => t + p.price, 0);
    return { ...pk, items, full, price: Math.round((full * (1 - pk.save)) / 10) * 10, ok: !vehicle || pk.for.includes(vehicle.model) };
  });
  const rec = priced.find((p) => p.ok) || priced[0];
  const [sel, setSel] = useState(rec.id);
  const [done, setDone] = useState("");
  const pk = priced.find((p) => p.id === sel) || rec;

  return (
    <section className="mx-auto mt-40 max-w-[1600px] px-5 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="display text-6xl sm:text-8xl"><MaskLines lines={["Delivery-day", "packs."]} inView /></h2>
        <p className="max-w-sm text-lg text-mute">Curated bundles of genuine parts, priced below the sum of their parts. Add one when you book, or any time after.</p>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-12">
        {/* pack list */}
        <div className="flex flex-col gap-2 lg:col-span-5">
          {priced.map((p) => {
            const on = p.id === pk.id;
            return (
              <button key={p.id} onClick={() => setSel(p.id)} onMouseEnter={() => setSel(p.id)}
                className={`group relative overflow-hidden rounded-[26px] p-6 text-left transition-colors duration-500 sm:p-7 ${on ? "bg-bone text-white" : "bg-white hover:bg-white/70"}`}>
                {on && <motion.span layoutId="packbar" className="absolute inset-y-6 left-0 w-1 rounded-full bg-red" />}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      {p.id === rec.id && vehicle && <span className="rounded-full bg-red px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white">Recommended for your {m.name}</span>}
                      {!p.ok && <span className={`rounded-full px-2.5 py-1 text-[11px] ${on ? "bg-white/15 text-white/70" : "bg-slab text-mute"}`}>Not for your {m.name}</span>}
                    </div>
                    <p className="display mt-3 text-4xl sm:text-5xl">{p.name}</p>
                    <p className={`mt-2 text-sm ${on ? "text-white/60" : "text-mute"}`}>{p.items.length} genuine parts, save {Math.round(p.save * 100)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold tracking-tight tabular-nums">{inr(p.price)}</p>
                    <p className={`text-sm line-through tabular-nums ${on ? "text-white/40" : "text-dim"}`}>{inr(p.full)}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* stage */}
        <div className="relative min-h-[620px] overflow-hidden rounded-[36px] bg-black lg:col-span-7">
          <AnimatePresence mode="popLayout">
            <motion.div key={pk.id} className="absolute inset-0" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: EASE }}>
              <Photo src={pk.image} alt={pk.name} className="h-full w-full" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <AnimatePresence mode="wait">
            <motion.div key={pk.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.6, ease: EASE }}
              className="absolute inset-x-4 bottom-4 rounded-[28px] bg-white/90 p-6 text-bone shadow-2xl backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mute">In the {pk.name}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {pk.items.map((it, i) => (
                  <motion.div key={it.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.07 }}>
                    <Link to={`/p/${it.id}`} className="group block">
                      <Photo src={it.image} alt={it.name} className="aspect-square rounded-2xl bg-[#e9eaec] [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-110" />
                      <p className="mt-2 text-xs font-medium leading-snug">{it.name}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-5">
                <div>
                  <span className="text-3xl font-semibold tracking-tight tabular-nums">{inr(pk.price)}</span>
                  <span className="ml-2 text-sm text-mute">you save {inr(pk.full - pk.price)}</span>
                </div>
                {pk.ok ? (
                  <button onClick={() => { add({ id: pk.id, name: pk.name, price: pk.price, image: pk.image, mode: "dealer", kind: "pack" }); setDone(pk.id); setTimeout(() => setDone(""), 1800); }}
                    className="press flex items-center gap-2 rounded-full bg-red px-6 py-3.5 text-sm font-semibold text-white hover:bg-red-deep">
                    {done === pk.id ? "Pack added" : "Add pack, fitted at dealer"}
                  </button>
                ) : (
                  <span className="text-sm text-mute">Fits {pk.for.map((f) => modelById(f)?.name).filter(Boolean).join(", ")}</span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function BestSellers() {
  const vehicle = useStore((s) => s.vehicle);
  const ids = ["team-polo", "trail-hoodie", "team-softshell", "diecast-roxx", "team-cap", "kids-thar", "heritage-jacket", "trail-roof-carrier"];
  let list = ids.map(productById);
  if (vehicle) list = [...list].sort((a, b) => fits(b, vehicle) - fits(a, vehicle));
  return (
    <section className="mx-auto mt-40 max-w-[1600px] px-5 sm:px-8">
      <div className="flex items-end justify-between gap-6">
        <h2 className="display text-6xl sm:text-8xl"><MaskLines lines={["Owners are buying."]} inView /></h2>
        <Link to="/shop" className="hidden items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] hover:text-red sm:flex">Shop all <ArrowUpRight size={16} /></Link>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4">
        {list.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}
      </div>
    </section>
  );
}

function EvAndTrails() {
  return (
    <section className="mx-auto mt-40 grid max-w-[1600px] gap-5 px-5 sm:px-8 lg:grid-cols-2">
      <Link to="/trails" className="group relative min-h-[620px] overflow-hidden rounded-[32px]">
        <RevealImage src="trail-ladakh.jpg" alt="Scorpio on a Ladakh road" className="absolute inset-0" imgClass="transition-transform duration-1000 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
          <Mountains size={30} />
          <h3 className="display mt-4 text-5xl sm:text-7xl">Trails in the cart.</h3>
          <p className="mt-3 max-w-md text-white/75">Great Escape weekends, the Off-road Academy and Spiti expeditions, booked next to your gear.</p>
          <div className="mt-6 flex flex-wrap gap-2">{EXPERIENCES.map((e) => <span key={e.id} className="rounded-full bg-white/15 px-3 py-1.5 text-sm backdrop-blur">{e.name}</span>)}</div>
        </div>
      </Link>
      <Link to="/worlds/electric" className="group relative min-h-[620px] overflow-hidden rounded-[32px]">
        <RevealImage src="ev.jpg" alt="EV charging" delay={0.1} className="absolute inset-0" imgClass="transition-transform duration-1000 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
          <Lightning size={30} weight="fill" />
          <h3 className="display mt-4 text-5xl sm:text-7xl">Born Electric.</h3>
          <p className="mt-3 max-w-md text-white/75">Home wallbox with a certified install, travel cables, and quiet design for BE 6 and XEV 9e owners.</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]">Charging hub <ArrowUpRight size={16} /></span>
        </div>
      </Link>
    </section>
  );
}

function PassRed() {
  const points = useStore((s) => s.points);
  const member = useStore((s) => s.member);
  const vehicle = useStore((s) => s.vehicle);
  const m = vehicle && modelById(vehicle.model);
  const next = 2500;
  const perks = [
    ["1 pt per ₹10", "on accessories, merch, service and trails"],
    ["24h early", "access to every numbered drop"],
    ["Earned gear", "patches and tees money cannot buy"],
  ];
  return (
    <section className="relative mx-3 mt-24 overflow-hidden rounded-[40px] bg-red text-white sm:mx-5">
      <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-white/15 blur-[120px]" />
      <div className="absolute -bottom-40 right-0 h-[520px] w-[620px] rounded-full bg-black/25 blur-[120px]" />
      <div className="relative mx-auto grid max-w-[1600px] items-center gap-14 px-6 py-20 sm:px-12 sm:py-24 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Basecamp Pass</p>
          <h2 className="display mt-5 text-6xl sm:text-8xl"><MaskLines lines={["Every mile", "counts."]} inView /></h2>
          <p className="mt-6 max-w-md text-lg text-white/80">One account for accessories, merch, service and trails. Free for every Mahindra owner.</p>
          <div className="mt-10 grid max-w-xl gap-px overflow-hidden rounded-[22px] bg-white/15 sm:grid-cols-3">
            {perks.map(([k, v], i) => (
              <motion.div key={k} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.08 }} className="bg-red p-5">
                <p className="text-xl font-semibold tracking-tight">{k}</p>
                <p className="mt-1 text-sm text-white/70">{v}</p>
              </motion.div>
            ))}
          </div>
          <Link to="/pass" className="press mt-10 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-red hover:bg-bone hover:text-white">Open your Pass <ArrowRight size={16} weight="bold" /></Link>
        </div>

        {/* membership card */}
        <motion.div initial={{ opacity: 0, y: 50, rotate: -4 }} whileInView={{ opacity: 1, y: 0, rotate: -3 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.2, ease: EASE }} className="mx-auto w-full max-w-[520px]">
          <Tilt holo max={14} className="rounded-[28px]">
            <div className="relative aspect-[1.586] overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#17181c_0%,#0b0c0e_55%,#2a0a10_100%)] p-7 shadow-[0_60px_120px_-30px_rgba(0,0,0,.6)] ring-1 ring-white/10 sm:p-8">
              <div className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(115deg,#fff_0_1px,transparent_1px_14px)]" />
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-red/40 blur-3xl" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3"><MahindraMark className="h-4 w-auto text-white" /><span className="h-4 w-px bg-white/30" /><span className="text-[11px] font-semibold uppercase tracking-[0.3em]">Basecamp</span></div>
                  <span className="rounded-full border border-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">{member}</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/50">Points</p>
                  <p className="text-6xl font-semibold tracking-[-0.05em] tabular-nums sm:text-7xl"><CountUp to={points} /></p>
                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/15">
                    <motion.div className="h-full rounded-full bg-white" initial={{ width: 0 }} whileInView={{ width: `${Math.min(100, (points / next) * 100)}%` }} viewport={{ once: true }} transition={{ duration: 1.6, delay: 0.4, ease: EASE }} />
                  </div>
                  <p className="mt-2 text-xs text-white/50">{(next - points).toLocaleString("en-IN")} pts to your next reward</p>
                </div>
                <div className="flex items-end justify-between font-mono text-xs text-white/60">
                  <span>{m ? `${m.name} owner` : "Mahindra owner"}</span>
                  <span className="tracking-[0.2em]">BC 2026 0001 1947</span>
                </div>
              </div>
            </div>
          </Tilt>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroReel />
      <MerchShowcase />
      <MerchTicker />
      <Statement />
      <Stats />
      <BuildSection />
      <Story />
      <WorldsPan />
      <MerchSpread />
      <ShopTheLook />
      <DropNight />
      <Packs />
      <BestSellers />
      <EvAndTrails />
      <PassRed />
    </>
  );
}
