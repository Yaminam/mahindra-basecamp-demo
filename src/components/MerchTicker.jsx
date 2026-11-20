// Endless strip of merch products. Pauses on hover; each tile links to its product page.
import { Link } from "react-router-dom";
import { MERCH, inr } from "../data";
import { Photo } from "./ui";

export default function MerchTicker() {
  const list = MERCH.filter((p) => p.image);
  const row = [...list, ...list];
  return (
    <section className="mt-32 overflow-hidden py-6" aria-label="New in merch">
      <div className="mx-auto mb-8 flex max-w-[1600px] items-end justify-between px-5 sm:px-8">
        <h2 className="display text-5xl sm:text-7xl">New in merch.</h2>
        <Link to="/merch" className="hidden text-sm font-semibold uppercase tracking-[0.14em] hover:text-red sm:block">Shop all {list.length}</Link>
      </div>
      <div className="group">
        <div className="flex w-max animate-[marquee_70s_linear_infinite] gap-4 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {row.map((p, i) => (
            <Link key={p.id + i} to={`/p/${p.id}`} className="w-60 shrink-0 sm:w-72">
              <div className="relative overflow-hidden rounded-[22px] bg-[#e9eaec]">
                <Photo src={p.image} alt={p.name} className="aspect-[4/5] [&_img]:transition-transform [&_img]:duration-700 hover:[&_img]:scale-105" />
                {p.tag && <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold shadow-sm">{p.tag}</span>}
              </div>
              <div className="mt-3 flex justify-between gap-3 text-[15px]">
                <span className="truncate font-medium">{p.name}</span>
                <span className="shrink-0 tabular-nums">{inr(p.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
