// Shop-by-category bento with real photography.
import { Link } from "react-router-dom";
import { ArrowUpRight } from "@phosphor-icons/react";
import { MERCH } from "../data";
import { MaskLines, RevealImage } from "./premium";

const TILES = [
  { cat: "Teamwear", image: "racing.jpg", span: "lg:col-span-2 lg:row-span-2", big: true },
  { cat: "Apparel", image: "hoodie.jpg", span: "lg:row-span-2" },
  { cat: "Headwear", image: "cap.jpg", span: "" },
  { cat: "Collectibles", image: "diecast.jpg", span: "" },
  { cat: "Kids", image: "kids-rideon.jpg", span: "lg:col-span-2" },
  { cat: "Pets", image: "dog.jpg", span: "" },
  { cat: "Accessories", image: "backpack.jpg", span: "" },
];

export default function MerchCategories() {
  return (
    <section className="mx-auto mt-32 max-w-[1600px] px-5 sm:px-8">
      <h2 className="display text-6xl sm:text-8xl"><MaskLines lines={["Shop by", "category."]} inView /></h2>
      <div className="mt-12 grid auto-rows-[220px] grid-cols-2 gap-3 sm:gap-4 lg:auto-rows-[260px] lg:grid-cols-4">
        {TILES.map((t, i) => {
          const n = MERCH.filter((p) => p.cat === t.cat).length;
          return (
            <Link key={t.cat} to="/merch" className={`group relative overflow-hidden rounded-[28px] ${t.span} ${t.big ? "col-span-2 row-span-2" : ""}`}>
              <RevealImage src={t.image} alt={t.cat} delay={i * 0.05} className="absolute inset-0" imgClass="transition-transform duration-[1200ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white sm:p-7">
                <div>
                  <p className={`display ${t.big ? "text-5xl sm:text-7xl" : "text-3xl sm:text-4xl"}`}>{t.cat}</p>
                  <p className="mt-1 text-sm text-white/70">{n} {n === 1 ? "piece" : "pieces"}</p>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-red"><ArrowUpRight size={18} /></span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
