import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { Garage, PencilSimple, Cube, ArrowRight } from "@phosphor-icons/react";
import { useStore } from "../store";
import { ALL_PRODUCTS, CATEGORIES, PACKS, modelById, fits, img, inr } from "../data";
import { ProductCard, Btn, Reveal, Photo } from "../components/ui";
import { Rise } from "../components/fx";

const EASE = [0.16, 1, 0.3, 1];


/* The lead product gets an editorial tile: two columns wide, two rows tall. */
function FeatureTile({ p }) {
  const add = useStore((s) => s.add);
  const vehicle = useStore((s) => s.vehicle);
  const [done, setDone] = useState(false);
  return (
    <motion.div layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: EASE }}
      className="group relative col-span-2 row-span-2 min-h-[520px] overflow-hidden rounded-[28px] lg:min-h-0">
      <Link to={`/p/${p.id}`} className="absolute inset-0" aria-label={p.name}>
        <Photo src={p.image} alt={p.name} className="h-full w-full [&_img]:transition-transform [&_img]:duration-[1200ms] group-hover:[&_img]:scale-105" />
      </Link>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-7 text-white sm:flex-row sm:items-end sm:justify-between sm:p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{p.tag || "Featured"}{vehicle && p.fit?.includes(vehicle.model) ? " · Fits your vehicle" : ""}</p>
          <h3 className="display mt-3 text-5xl sm:text-6xl">{p.name}</h3>
          <p className="mt-3 max-w-md text-white/75">{p.blurb}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">{inr(p.price)}</span>
          <button onClick={() => { add({ id: p.id, name: p.name, price: p.price, image: p.image, mode: p.modes[0], kind: p.kind }); setDone(true); setTimeout(() => setDone(false), 1500); }}
            className="press rounded-full bg-white px-5 py-3 text-sm font-semibold text-bone hover:bg-red hover:text-white">{done ? "Added" : "Add to bag"}</button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Shop() {
  const { vehicle, openPicker } = useStore();
  const [cat, setCat] = useState("all");
  const [onlyFit, setOnlyFit] = useState(true);
  const [sort, setSort] = useState("featured");
  const m = vehicle && modelById(vehicle.model);

  const list = useMemo(() => {
    let l = ALL_PRODUCTS.filter((p) => p.kind === "accessory");
    if (cat !== "all") l = l.filter((p) => p.cat === cat);
    if (vehicle && onlyFit) l = l.filter((p) => fits(p, vehicle));
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    return l;
  }, [cat, onlyFit, sort, vehicle]);
  const fitCount = vehicle ? ALL_PRODUCTS.filter((p) => p.kind === "accessory" && fits(p, vehicle)).length : 0;
  const heroImg = m ? (m.ev ? "ev.jpg" : m.line === "Thar" ? "thar-red.jpg" : m.line === "Scorpio" ? "scorpio-spiti.jpg" : "scorpio.jpg") : "hero-thar.jpg";

  return (
    <div>
      {/* garage hero */}
      <section className="relative mx-3 mt-3 overflow-hidden rounded-[32px] sm:mx-4">
        <motion.img key={heroImg} src={img(heroImg)} alt="" initial={{ scale: 1.08, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.4, ease: EASE }} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
        <div className="relative flex min-h-[460px] flex-col justify-end p-6 text-white sm:min-h-[540px] sm:p-12 lg:p-16">
          {m ? (
            <>
              <p className="flex items-center gap-2 text-sm text-white/75"><Garage size={18} /> My Garage, {vehicle.variant}, {vehicle.year}</p>
              <h1 className="display mt-3 text-[15vw] sm:text-[8rem]"><Rise key={m.id} text={m.name} delay={0.2} /></h1>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-bone">{fitCount} genuine accessories fit</span>
                <button onClick={openPicker} className="flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur hover:bg-white/25"><PencilSimple size={14} /> Change vehicle</button>
                {(m.line === "Thar") && <Link to="/build" className="flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur hover:bg-white/25"><Cube size={15} /> Build it in 3D</Link>}
              </div>
            </>
          ) : (
            <>
              <h1 className="display text-[15vw] sm:text-[8rem]"><Rise text="Accessories" delay={0.2} /></h1>
              <p className="mt-4 max-w-md text-lg text-white/80">Genuine parts, one national price. Add your vehicle and we hide everything that does not fit.</p>
              <Btn className="mt-7 w-fit py-4" onClick={openPicker}><Garage size={18} /> Add your vehicle</Btn>
            </>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        {/* sticky filters */}
        <div className="sticky top-16 z-20 -mx-4 mt-6 bg-ink/85 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <LayoutGroup>
              <div className="no-scrollbar flex gap-1 overflow-x-auto">
                {[{ id: "all", name: "All" }, ...CATEGORIES].map((c) => (
                  <button key={c.id} onClick={() => setCat(c.id)} className={`relative shrink-0 rounded-full px-4 py-2 text-sm ${cat === c.id ? "text-white" : "text-mute hover:text-bone"}`}>
                    {cat === c.id && <motion.span layoutId="cat" className="absolute inset-0 rounded-full bg-bone" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                    <span className="relative">{c.name}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
            <div className="flex items-center gap-4">
              {vehicle && (
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-mute">
                  <button role="switch" aria-checked={onlyFit} onClick={() => setOnlyFit(!onlyFit)} className={`relative h-7 w-12 rounded-full transition ${onlyFit ? "bg-fit" : "bg-slab"}`}>
                    <motion.span layout className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${onlyFit ? "right-1" : "left-1"}`} />
                  </button>
                  Only what fits
                </label>
              )}
              <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort" className="field !w-auto !rounded-full !py-2">
                <option value="featured">Featured</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-mute">{list.length} accessories</p>

        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-14 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (i === 0 && cat === "all" ? <FeatureTile key={p.id} p={p} /> : <ProductCard key={p.id} p={p} i={i} />))}
          </AnimatePresence>
        </div>
        {list.length === 0 && (
          <div className="card py-20 text-center">
            <p className="text-lg">Nothing in this category fits your {m?.name}.</p>
            <button onClick={() => setOnlyFit(false)} className="mt-3 text-sm text-red hover:underline">Show everything anyway</button>
          </div>
        )}

        {/* configurator promo */}
        <Reveal className="mt-32 grid items-center gap-8 overflow-hidden rounded-[32px] bg-white p-8 sm:p-14 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="display text-5xl sm:text-7xl">See it before you buy it.</h2>
            <p className="mt-4 max-w-lg text-lg text-mute">Bolt the roof carrier, light bar and winch bumper onto a 3D Thar, change the paint, and add the whole build in one tap.</p>
          </div>
          <Btn as={Link} to="/build" className="py-4">Open the configurator <ArrowRight size={16} weight="bold" /></Btn>
        </Reveal>
      </div>
    </div>
  );
}
