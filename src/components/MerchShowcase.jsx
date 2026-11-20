// Home merch showcase: collection tabs swap a campaign image and four products.
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, TShirt, BaseballCap, Trophy, Baby, Dog, Backpack } from "@phosphor-icons/react";
import { COLLECTIONS, MERCH, img } from "../data";
import { ProductCard } from "./ui";
import { MaskLines } from "./premium";

const EASE = [0.16, 1, 0.3, 1];
const CATS = [
  ["Teamwear", TShirt], ["Apparel", TShirt], ["Headwear", BaseballCap],
  ["Accessories", Backpack], ["Collectibles", Trophy], ["Kids", Baby], ["Pets", Dog],
];

export default function MerchShowcase() {
  const [col, setCol] = useState(COLLECTIONS[0].id);
  const c = COLLECTIONS.find((x) => x.id === col);
  const items = MERCH.filter((p) => p.collection === col).slice(0, 4).map((p) => ({ ...p, kind: "merch", fit: null, modes: ["ship"] }));
  const count = MERCH.filter((p) => p.collection === col).length;

  return (
    <section className="mx-auto max-w-[1600px] px-5 pt-32 sm:px-8 sm:pt-40">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red">Official merchandise</p>
          <h2 className="display mt-4 text-6xl sm:text-8xl lg:text-[8.5rem]"><MaskLines lines={["Wear the", "badge."]} inView /></h2>
        </div>
        <div className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <div className="flex gap-1 rounded-full bg-white p-1 shadow-sm">
            {COLLECTIONS.map((x) => (
              <button key={x.id} onClick={() => setCol(x.id)} className={`relative shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition ${col === x.id ? "text-white" : "text-mute hover:text-bone"}`}>
                {col === x.id && <motion.span layoutId="mstab" className="absolute inset-0 rounded-full bg-bone" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                <span className="relative">{x.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-12">
        {/* campaign image */}
        <Link to="/merch" className="group relative min-h-[520px] overflow-hidden rounded-[36px] bg-black lg:col-span-5 lg:min-h-0">
          <AnimatePresence mode="popLayout">
            <motion.img key={c.id} src={img(c.image)} alt={c.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
              initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: EASE }} />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6, ease: EASE }}>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">{c.line}</p>
                <p className="display mt-2 text-5xl sm:text-6xl">{c.name}</p>
                <p className="mt-3 max-w-sm text-white/75">{c.blurb}</p>
                <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-bone transition group-hover:bg-red group-hover:text-white">
                  Shop all {count} <ArrowUpRight size={16} />
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </Link>

        {/* products */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:col-span-7">
          <AnimatePresence mode="popLayout">
            {items.map((p, i) => <ProductCard key={c.id + p.id} p={p} i={i} />)}
          </AnimatePresence>
        </div>
      </div>

      {/* category strip */}
      <div className="no-scrollbar -mx-5 mt-14 flex gap-3 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        {CATS.map(([name, Icon]) => (
          <Link key={name} to="/merch" className="group flex shrink-0 items-center gap-3 rounded-full bg-white px-5 py-3.5 text-sm font-medium shadow-sm transition hover:bg-bone hover:text-white">
            <Icon size={18} className="text-red transition group-hover:text-white" /> {name}
          </Link>
        ))}
      </div>
    </section>
  );
}
