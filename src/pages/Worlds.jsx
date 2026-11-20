import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react";
import { WORLDS, ALL_PRODUCTS, img } from "../data";
import { ProductCard, Reveal } from "../components/ui";
import { PageHero, MaskLines, RevealImage } from "../components/premium";
import WorldsPan from "../components/WorldsPan";

export function Worlds() {
  return (
    <div>
      <PageHero image="scorpio-spiti.jpg" kicker="Worlds" title={["Nine worlds.", "One tribe."]} sub="Every Mahindra has its own culture. Pick yours and the store changes with you: its gear, its stories, its drops." tall />
      <WorldsPan bare />
      <section className="mx-auto mt-32 grid max-w-[1600px] gap-5 px-5 sm:px-8 md:grid-cols-2 xl:grid-cols-4">
        {WORLDS.map((w, i) => (
          <Reveal key={w.id} delay={(i % 4) * 0.06}>
            <Link to={`/worlds/${w.id}`} className="group block">
              <RevealImage src={w.image} alt={w.name} className="aspect-[3/4] rounded-[28px]" imgClass="transition-transform duration-1000 group-hover:scale-105" />
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mute">{w.kicker}</p>
                  <p className="display mt-1 text-3xl">{w.name}</p>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white transition group-hover:bg-red group-hover:text-white"><ArrowUpRight size={18} /></span>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>
    </div>
  );
}

const WORLD_MATCH = {
  scorpio: (p) => p.fit?.includes("scorpion") && p.kind === "accessory",
  xuv: (p) => p.fit?.includes("xuv700") && p.kind === "accessory",
};

export function World() {
  const { id } = useParams();
  const w = WORLDS.find((x) => x.id === id) || WORLDS[0];
  const match = WORLD_MATCH[w.id] || ((p) => p.world === w.id || (w.id === "electric" && p.cat === "charging"));
  const items = ALL_PRODUCTS.filter(match);
  const others = WORLDS.filter((x) => x.id !== w.id).slice(0, 4);
  return (
    <div>
      <PageHero key={w.id} image={w.image} kicker={w.kicker} title={`${w.name}.`} sub={w.blurb} tall>
        <Link to="/worlds" className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur hover:border-white"><ArrowLeft size={14} /> All worlds</Link>
      </PageHero>
      <section className="mx-auto max-w-[1600px] px-5 pt-28 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="display text-5xl sm:text-7xl"><MaskLines lines={[`The ${w.name} edit.`]} inView /></h2>
          <p className="text-mute">{items.length} pieces</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-14 md:grid-cols-3 xl:grid-cols-4">
          {items.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}
        </div>
        {items.length === 0 && <p className="card py-16 text-center text-mute">New collection landing soon.</p>}
      </section>
      <section className="mx-auto mt-32 max-w-[1600px] px-5 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mute">Keep exploring</p>
        <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {others.map((o) => (
            <Link key={o.id} to={`/worlds/${o.id}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[28px]">
              <img src={img(o.image)} alt={o.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
              <p className="display absolute bottom-5 left-5 text-3xl text-white">{o.name}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
