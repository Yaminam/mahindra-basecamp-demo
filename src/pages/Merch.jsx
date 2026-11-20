import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight, TShirt, Truck, ArrowsCounterClockwise, ShieldCheck } from "@phosphor-icons/react";
import { ALL_PRODUCTS, COLLECTIONS, MERCH_CATS, DROP_AT, img, inr, productById } from "../data";
import { useStore } from "../store";
import { ProductCard, Btn, Reveal, Countdown, Photo } from "../components/ui";
import { Rise, Magnetic, Tilt } from "../components/fx";
import { Rail, MaskLines } from "../components/premium";

const EASE = [0.16, 1, 0.3, 1];

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  return (
    <section ref={ref} className="relative mx-3 mt-3 h-[86dvh] min-h-[560px] overflow-hidden rounded-[32px] sm:mx-4">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img src={img("racing.jpg")} alt="Mahindra Racing Formula E car" className="h-full w-full object-cover object-[50%_40%]" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-6 text-white sm:p-12 lg:p-16">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-sm font-medium uppercase tracking-[0.28em] text-white/80">Mahindra Racing</motion.p>
        <h1 className="display mt-4 max-w-4xl text-[13vw] leading-[0.88] sm:text-[7.5rem]">
          <Rise text="2026 Team" delay={0.35} /><br /><Rise text="Collection" delay={0.55} />
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-5 max-w-md text-lg text-white/80">
          The kit the team wears on the grid. Priced in rupees, shipped from India.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: 0.8, ease: EASE }} className="mt-8 flex flex-wrap gap-3">
          <Magnetic><Btn onClick={() => document.getElementById("grid")?.scrollIntoView({ behavior: "smooth" })} className="py-4">Shop teamwear <ArrowRight size={16} weight="bold" /></Btn></Magnetic>
          <Magnetic><Btn as={Link} to="/p/racing-tee" variant="ghost" className="border-white/40 bg-white/10 py-4 text-white hover:border-white">Personalise a tee</Btn></Magnetic>
        </motion.div>
      </div>
    </section>
  );
}

function Perks() {
  const items = [
    [Truck, "Free shipping over ₹1,499"],
    [ArrowsCounterClockwise, "15-day easy returns"],
    [TShirt, "Name and number printing"],
    [ShieldCheck, "100% official merchandise"],
  ];
  return (
    <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-6 gap-y-4 px-4 py-8 sm:px-6 md:grid-cols-4">
      {items.map(([Icon, t]) => (
        <p key={t} className="flex items-center gap-3 text-sm text-mute"><Icon size={22} className="shrink-0 text-bone" /> {t}</p>
      ))}
    </div>
  );
}

function Collections({ active, onPick }) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-16 sm:px-6">
      <Reveal><h2 className="display text-5xl sm:text-7xl">Shop by collection.</h2></Reveal>
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {COLLECTIONS.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.06}>
            <Tilt max={6} className="rounded-[24px]">
              <button onClick={() => onPick(c.id)} className={`group relative block aspect-[3/4] w-full overflow-hidden rounded-[24px] text-left ring-offset-4 ring-offset-ink transition ${active === c.id ? "ring-2 ring-red" : ""}`}>
                <img src={img(c.image)} alt={c.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white">
                  <div>
                    <p className="text-xs text-white/70">{c.line}</p>
                    <p className="display mt-1 text-2xl sm:text-3xl">{c.name}</p>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-red"><ArrowUpRight size={16} /></span>
                </div>
              </button>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function PromoBanner() {
  return (
    <div className="col-span-full my-6 grid overflow-hidden rounded-[28px] bg-bone text-white md:grid-cols-[1.1fr_1fr]">
      <div className="flex flex-col justify-center p-8 sm:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-red">Race-weekend capsule</p>
        <h3 className="display mt-4 text-5xl sm:text-6xl">Drops Friday. Gone by Monday.</h3>
        <p className="mt-4 max-w-md text-white/65">A new limited capsule every race weekend. Basecamp Pass members get first access.</p>
        <div className="mt-8 [&_.text-mute]:text-white/50"><Countdown target={DROP_AT} /></div>
        <Btn as={Link} to="/drops" variant="red" className="mt-8 w-fit py-4">Get notified</Btn>
      </div>
      <div className="relative min-h-[320px]">
        <img src={img("merch/polo-black.jpg")} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>
    </div>
  );
}

/* Shop the look: lifestyle photo with pulsing hotspots that open a mini product card. */
const LOOKS = [
  { image: "hoodie.jpg", title: "Spiti, 4,500 m.", sub: "Layered for the cold desert.", spots: [
    { id: "trail-hoodie", x: 40, y: 69 },
    { id: "trail-beanie" },
    { id: "trail-pack" },
  ] },
  { image: "cap.jpg", title: "Race weekend.", sub: "Garage-issue, grandstand-ready.", spots: [
    { id: "team-cap", x: 50, y: 17 },
    { id: "racing-tee", x: 58, y: 62 },
    { id: "electric-shades" },
  ] },
];

function ShopTheLook() {
  const add = useStore((s) => s.add);
  const [look, setLook] = useState(0);
  const [open, setOpen] = useState(null);
  const [done, setDone] = useState("");
  const L = LOOKS[look];
  const items = L.spots.map((s) => ({ ...s, p: productById(s.id) }));
  const total = items.reduce((t, s) => t + s.p.price, 0);
  return (
    <section className="mx-auto mt-32 max-w-[1600px] px-5 sm:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="display text-6xl sm:text-8xl"><MaskLines lines={["Shop the look."]} inView /></h2>
        <div className="flex gap-1 rounded-full bg-white p-1 shadow-sm">
          {LOOKS.map((l, i) => (
            <button key={l.title} onClick={() => { setLook(i); setOpen(null); }} className={`relative rounded-full px-5 py-2.5 text-sm font-medium ${look === i ? "text-white" : "text-mute hover:text-bone"}`}>
              {look === i && <motion.span layoutId="lookpill" className="absolute inset-0 rounded-full bg-bone" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className="relative">{l.title.replace(".", "")}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-10 grid gap-5 lg:grid-cols-[auto_1fr]">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[36px] bg-slab lg:h-[78vh] lg:max-h-[760px] lg:w-auto">
          <AnimatePresence mode="popLayout">
            <motion.img key={L.image} src={img(L.image)} alt={L.title} className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {items.map((s, i) => s.x == null ? null : (
            <div key={look + s.id} className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
              <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 + i * 0.12, type: "spring", stiffness: 300, damping: 18 }}
                onClick={() => setOpen(open === s.id ? null : s.id)} aria-label={s.p.name}
                className="relative -translate-x-1/2 -translate-y-1/2">
                <span className="absolute inset-0 animate-ping rounded-full bg-white/60" />
                <span className={`relative grid h-9 w-9 place-items-center rounded-full text-sm font-semibold shadow-lg transition ${open === s.id ? "bg-red text-white" : "bg-white text-bone"}`}>{i + 1}</span>
              </motion.button>
              <AnimatePresence>
                {open === s.id && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6 }}
                    className="absolute left-6 top-4 z-10 w-64 rounded-2xl bg-white p-3 text-bone shadow-2xl">
                    <div className="flex gap-3">
                      <Photo src={s.p.image} className="h-20 w-16 shrink-0 rounded-xl bg-[#e9eaec]" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-snug">{s.p.name}</p>
                        <p className="mt-1 text-sm tabular-nums text-mute">{inr(s.p.price)}</p>
                        <Link to={`/p/${s.p.id}`} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-red">View <ArrowRight size={12} /></Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <AnimatePresence mode="wait">
              <motion.div key={L.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                <p className="display text-5xl">{L.title}</p>
                <p className="mt-2 text-white/75">{L.sub}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col rounded-[36px] bg-white p-7 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mute">In this look</p>
          <ul className="mt-6 flex-1 space-y-5">
            {items.map((s, i) => (
              <li key={look + s.id} onMouseEnter={() => setOpen(s.id)} className="flex items-center gap-4">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${open === s.id ? "bg-red text-white" : "bg-slab"}`}>{i + 1}</span>
                <Photo src={s.p.image} className="h-20 w-16 shrink-0 rounded-xl bg-[#e9eaec]" />
                <div className="min-w-0 flex-1">
                  <Link to={`/p/${s.p.id}`} className="font-medium hover:text-red">{s.p.name}</Link>
                  <p className="text-sm text-mute">{s.x == null ? "Pairs with this look" : COLLECTIONS.find((c) => c.id === s.p.collection)?.name}</p>
                </div>
                <span className="tabular-nums">{inr(s.p.price)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-black/5 pt-6">
            <div className="flex items-baseline justify-between"><span className="text-mute">The full look</span><span className="text-3xl font-semibold tracking-tight tabular-nums">{inr(total)}</span></div>
            <button onClick={() => { items.forEach((s) => add({ id: s.p.id, name: s.p.name, price: s.p.price, image: s.p.image, mode: "ship", kind: "merch", size: s.p.sizes ? "M" : undefined })); setDone(L.title); setTimeout(() => setDone(""), 1800); }}
              className="press mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-red py-4 text-sm font-semibold text-white hover:bg-red-deep">
              {done === L.title ? "Look added (size M)" : "Add the whole look"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Merch() {
  const [col, setCol] = useState("all");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("featured");
  const list = useMemo(() => {
    let l = ALL_PRODUCTS.filter((p) => p.kind === "merch");
    if (col !== "all") l = l.filter((p) => p.collection === col);
    if (cat !== "all") l = l.filter((p) => p.cat === cat);
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "new") l = [...l].sort((a, b) => (b.tag === "New") - (a.tag === "New"));
    return l;
  }, [col, cat, sort]);
  const under999 = ALL_PRODUCTS.filter((p) => p.kind === "merch" && p.price <= 999);
  const pick = (c) => { setCol(c); setTimeout(() => document.getElementById("grid")?.scrollIntoView({ behavior: "smooth" }), 50); };

  return (
    <div>
      <Hero />
      <Perks />
      <Collections active={col} onPick={pick} />
      <ShopTheLook />

      <section id="grid" className="mx-auto max-w-[1400px] scroll-mt-20 px-4 pt-24 sm:px-6">
        <div className="sticky top-16 z-20 -mx-4 bg-ink/85 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <LayoutGroup>
              <div className="no-scrollbar flex gap-1 overflow-x-auto">
                {[["all", "Everything"], ...COLLECTIONS.map((c) => [c.id, c.name])].map(([id, name]) => (
                  <button key={id} onClick={() => setCol(id)} className={`relative shrink-0 rounded-full px-4 py-2 text-sm ${col === id ? "text-white" : "text-mute hover:text-bone"}`}>
                    {col === id && <motion.span layoutId="mcol" className="absolute inset-0 rounded-full bg-bone" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                    <span className="relative">{name}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
            <div className="flex items-center gap-2">
              <select aria-label="Category" value={cat} onChange={(e) => setCat(e.target.value)} className="field !w-auto !rounded-full !py-2">
                <option value="all">All categories</option>
                {MERCH_CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
              <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} className="field !w-auto !rounded-full !py-2">
                <option value="featured">Featured</option>
                <option value="new">New in</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-mute">{list.length} products</p>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.slice(0, 8).map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}
          </AnimatePresence>
          {list.length > 8 && <PromoBanner />}
          <AnimatePresence mode="popLayout">
            {list.slice(8).map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}
          </AnimatePresence>
        </div>
        {list.length === 0 && (
          <div className="card py-20 text-center">
            <p className="text-lg">Nothing here yet.</p>
            <button onClick={() => { setCol("all"); setCat("all"); }} className="mt-3 text-sm text-red hover:underline">Show everything</button>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pt-32 sm:px-6">
        <Reveal><h2 className="display text-5xl sm:text-7xl">Fan essentials under ₹999.</h2></Reveal>
        <Rail className="mt-10">
          {under999.map((p, i) => (
            <div key={p.id} className="w-[62vw] shrink-0 snap-start sm:w-[300px]"><ProductCard p={p} i={i} /></div>
          ))}
        </Rail>
      </section>
    </div>
  );
}
