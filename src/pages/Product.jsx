import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "motion/react";
import { ArrowLeft, Package, Storefront, Wrench, ShieldCheck, MapPin, Medal, Cube, CheckCircle, Warning, Plus, Minus, Truck, ArrowsCounterClockwise, Heart, Star, X, ArrowUpRight, ShoppingBag } from "@phosphor-icons/react";
import { useStore } from "../store";
import { productById, ALL_PRODUCTS, DEALERS, SLOTS, COLLECTIONS, MODELS, WORLDS, BUILD_ACC, inr, fits, modelById, img } from "../data";
import { Photo, Btn, FitBadge, ProductCard } from "../components/ui";
import { MaskLines, RevealImage, Rail } from "../components/premium";

const EASE = [0.16, 1, 0.3, 1];
const PRINT_FEE = 499;
const MODE_META = {
  ship: { icon: Package, title: "Ship home (DIY)", sub: "Delivered in 2 to 4 days. Fitting guide included." },
  dealer: { icon: Storefront, title: "Fit at my dealer", sub: "Book a slot. Fitment included in price." },
  doorstep: { icon: Wrench, title: "Doorstep fitment", sub: "Technician visit, ₹499 visit fee." },
};
const REVIEWS = [
  { name: "Arjun M.", car: "Thar Roxx", place: "Tested in Spiti", stars: 5, text: "Took it over Kunzum La with full load. Not a single rattle, and the dealer fit took under two hours." },
  { name: "Neha K.", car: "Scorpio-N", place: "Monsoon, Western Ghats", stars: 5, text: "Three months of rain and mud. Still looks factory fresh. Worth paying for genuine." },
  { name: "Rohit S.", car: "Thar", place: "Weekend trails, Pune", stars: 4, text: "Fit is perfect and the price was the same as the brochure. Booking the slot online was easy." },
];

export default function ProductRoute() {
  const { id } = useParams();
  return <Product key={id} />;
}

function Accordion({ title, children, open: start = false }) {
  const [open, setOpen] = useState(start);
  return (
    <div className="border-b border-bone/10">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-5 text-left font-medium" aria-expanded={open}>
        {title} {open ? <Minus size={18} /> : <Plus size={18} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden">
            <div className="pb-5 text-sm leading-relaxed text-mute">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Product() {
  const { id } = useParams();
  const p = productById(id);
  const { vehicle, add, openPicker } = useStore();
  const [mode, setMode] = useState(p?.modes.includes("dealer") ? "dealer" : p?.modes[0]);
  const [dealer, setDealer] = useState(DEALERS[0].id);
  const [slot, setSlot] = useState(SLOTS[0]);
  const [size, setSize] = useState("");
  const [color, setColor] = useState(p?.colors?.[0]);
  const [pin, setPin] = useState("");
  const [pinRes, setPinRes] = useState(null);
  const [printOn, setPrintOn] = useState(false);
  const [pName, setPName] = useState("");
  const [pNum, setPNum] = useState("");
  const [liked, setLiked] = useState(false);
  const [zoom, setZoom] = useState(null);
  const [added, setAdded] = useState(false);
  const buyRef = useRef(null);
  const buyVisible = useInView(buyRef, { amount: 0 });

  if (!p) return <div className="mx-auto max-w-[1400px] px-6 py-32 text-center"><p>We could not find that item.</p><Link to="/shop" className="text-red">Back to shop</Link></div>;

  const m = vehicle && modelById(vehicle.model);
  const blocked = p.fit && vehicle && !fits(p, vehicle);
  const needsSize = p.sizes && !size;
  const fee = (mode === "doorstep" ? 499 : 0) + (printOn && (pName || pNum) ? PRINT_FEE : 0);
  const dealerObj = DEALERS.find((d) => d.id === dealer);
  const collection = COLLECTIONS.find((c) => c.id === p.collection);
  const world = WORLDS.find((w) => w.id === p.world);
  const gallery = [...new Set([p.image, p.image2, collection?.image, world?.image].filter(Boolean))].slice(0, 4);
  const fitModels = p.fit ? MODELS.filter((x) => p.fit.includes(x.id)) : [];
  const in3d = BUILD_ACC.some((a) => a.product === p.id);
  const related = ALL_PRODUCTS.filter((x) => x.id !== p.id && ((p.collection && x.collection === p.collection) || (!p.collection && (x.world === p.world || x.cat === p.cat) && (!vehicle || fits(x, vehicle))))).slice(0, 8);
  const back = p.kind === "merch" ? ["/merch", "Merch"] : ["/shop", "Accessories"];
  const features = p.specs
    ? p.specs
    : [["Material", p.cat === "Apparel" || p.cat === "Teamwear" ? "Premium cotton blend" : "Built to last"], ["Made in", "India"], ["Official", "Mahindra licensed"]];

  const checkPin = () => {
    if (!/^\d{6}$/.test(pin)) return setPinRes({ err: "Enter a 6-digit pincode" });
    setPinRes({ ok: `Delivers to ${pin} by ${new Date(Date.now() + 3 * 864e5).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}. COD available.` });
  };
  const addToBag = () => {
    if (blocked || needsSize) { buyRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    const print = printOn && (pName || pNum) ? ` (${[pName, pNum].filter(Boolean).join(" ")})` : "";
    add({ id: p.id + (print ? "-print" : ""), name: p.name + print, price: p.price + fee, image: p.image, mode, kind: p.kind, size: size || undefined,
      dealer: mode === "dealer" ? dealerObj.name : undefined, slot: mode === "dealer" ? slot : undefined });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };
  const cta = needsSize ? "Select a size" : blocked ? "Does not fit your vehicle" : added ? "Added to bag" : `Add to bag, ${inr(p.price + fee)}`;

  return (
    <div>
      <div className="mx-auto max-w-[1600px] px-5 pt-6 sm:px-8">
        <nav className="flex items-center gap-2 text-sm text-mute">
          <Link to={back[0]} className="inline-flex items-center gap-1.5 hover:text-bone"><ArrowLeft size={14} /> {back[1]}</Link>
          {collection && <><span className="text-dim">/</span><span>{collection.name}</span></>}
          {!collection && world && <><span className="text-dim">/</span><span>{world.name}</span></>}
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
          {/* gallery: editorial mosaic */}
          <div className="grid grid-cols-2 gap-3">
            {gallery.map((g, i) => (
              <button key={g} onClick={() => setZoom(g)} className={`group relative overflow-hidden rounded-[28px] bg-[#e9eaec] ${i === 0 ? "col-span-2 aspect-[5/4]" : gallery.length === 2 ? "col-span-2 aspect-[16/9]" : "aspect-[4/5]"}`}>
                <RevealImage src={g} alt={p.name} delay={i * 0.08} className="absolute inset-0" imgClass="transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105" />
                {i === 0 && printOn && (pName || pNum) && (
                  <div className="pointer-events-none absolute inset-0 grid place-items-center">
                    <div className="text-center text-white [text-shadow:0_2px_14px_rgba(0,0,0,.5)]">
                      <p className="text-3xl font-semibold uppercase tracking-[0.3em]">{pName}</p>
                      <p className="display text-[11rem] leading-none">{pNum}</p>
                    </div>
                  </div>
                )}
                {i === 0 && p.tag && <span className="absolute left-5 top-5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm">{p.tag}</span>}
              </button>
            ))}
          </div>

          {/* buy box */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-start justify-between gap-4">
              <div>
                {collection && <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red">{collection.name}</p>}
                {!collection && <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red">Mahindra Genuine Accessory</p>}
                <h1 className="display mt-3 text-5xl sm:text-6xl"><MaskLines lines={[p.name]} delay={0.1} /></h1>
              </div>
              <button onClick={() => setLiked(!liked)} aria-label="Save to wishlist" className="press mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white shadow-sm">
                <Heart size={20} weight={liked ? "fill" : "regular"} className={liked ? "text-red" : ""} />
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-mute">
              <span className="flex text-bone">{[0, 1, 2, 3, 4].map((k) => <Star key={k} size={15} weight="fill" />)}</span> 4.8 from 212 owners
            </div>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-semibold tracking-tight tabular-nums">{inr(p.price)}</span>
              <span className="text-sm text-mute">MRP incl. taxes</span>
            </div>
            {p.price >= 3000 && <p className="mt-1 text-sm text-mute">or {inr(p.price / 6)}/month, 6-month no-cost EMI</p>}
            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-bone/80">{p.blurb}</p>

            {p.fit && (
              <div className="mt-6">
                {vehicle ? <FitBadge product={p} vehicle={vehicle} /> : (
                  <button onClick={openPicker} className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left text-sm shadow-sm"><Warning size={20} className="text-red" /> Add your vehicle to confirm this fits.</button>
                )}
                {blocked && <p className="mt-3 rounded-2xl bg-red/[0.07] p-4 text-sm">This does not fit your {m.name}. <Link to="/shop" className="text-red hover:underline">See what does</Link></p>}
              </div>
            )}

            {p.colors && (
              <div className="mt-8">
                <p className="text-sm text-mute">Colour</p>
                <div className="mt-2 flex gap-2">
                  {p.colors.map((c) => <button key={c} onClick={() => setColor(c)} aria-label={c} className={`h-10 w-10 rounded-full ring-offset-2 ring-offset-ink ${color === c ? "ring-2 ring-bone" : "ring-1 ring-black/15"}`} style={{ background: c }} />)}
                </div>
              </div>
            )}

            {p.sizes && (
              <div className="mt-8">
                <div className="flex justify-between text-sm"><span className="text-mute">Size</span><button className="text-mute underline underline-offset-4 hover:text-bone">Size guide</button></div>
                <div className="mt-2 grid grid-cols-6 gap-2">
                  {p.sizes.map((s) => <button key={s} onClick={() => setSize(s)} className={`press h-12 rounded-xl text-sm font-medium transition ${size === s ? "bg-bone text-white" : "bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,.08)] hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,.4)]"}`}>{s}</button>)}
                </div>
              </div>
            )}

            {p.personalise && (
              <div className="card mt-8 p-5">
                <div className="flex items-center justify-between">
                  <span><span className="block font-medium">Your name and number</span><span className="text-sm text-mute">Printed like the drivers, +{inr(PRINT_FEE)}</span></span>
                  <button role="switch" aria-checked={printOn} aria-label="Add printing" onClick={() => setPrintOn(!printOn)} className={`relative h-7 w-12 rounded-full transition ${printOn ? "bg-red" : "bg-slab"}`}>
                    <motion.span layout className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${printOn ? "right-1" : "left-1"}`} />
                  </button>
                </div>
                <AnimatePresence>
                  {printOn && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-4 grid grid-cols-[1fr_96px] gap-3">
                        <div><label htmlFor="pn" className="text-xs text-mute">Name (max 10)</label><input id="pn" value={pName} onChange={(e) => setPName(e.target.value.toUpperCase().replace(/[^A-Z ]/g, "").slice(0, 10))} className="field mt-1.5" placeholder="KULKARNI" /></div>
                        <div><label htmlFor="pnum" className="text-xs text-mute">Number</label><input id="pnum" inputMode="numeric" value={pNum} onChange={(e) => setPNum(e.target.value.replace(/\D/g, "").slice(0, 2))} className="field mt-1.5 text-center" placeholder="21" /></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {p.kind === "accessory" && (
              <div className="mt-8">
                <p className="text-sm text-mute">How do you want it fitted?</p>
                <div className="mt-3 space-y-2">
                  {["ship", "dealer", "doorstep"].map((mid) => {
                    const meta = MODE_META[mid];
                    const avail = p.modes.includes(mid);
                    return (
                      <button key={mid} disabled={!avail} onClick={() => setMode(mid)}
                        className={`press flex w-full items-center gap-4 rounded-2xl p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-35 ${mode === mid ? "bg-white shadow-[inset_0_0_0_2px_#1c1c1c]" : "bg-white/60 shadow-[inset_0_0_0_1px_rgba(0,0,0,.06)] hover:bg-white"}`}>
                        <meta.icon size={22} className={mode === mid ? "text-red" : "text-mute"} />
                        <span className="flex-1"><span className="block text-sm font-medium">{meta.title}</span><span className="block text-xs text-mute">{avail ? meta.sub : "Not available for this item"}</span></span>
                        <span className={`h-5 w-5 rounded-full ${mode === mid ? "border-[6px] border-red" : "border-2 border-line"}`} />
                      </button>
                    );
                  })}
                </div>
                <AnimatePresence initial={false}>
                  {mode === "dealer" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="card mt-3 p-5">
                        <label htmlFor="dealer" className="text-xs text-mute">Dealer near you</label>
                        <select id="dealer" value={dealer} onChange={(e) => setDealer(e.target.value)} className="field mt-2">
                          {DEALERS.map((d) => <option key={d.id} value={d.id}>{d.name}, {d.km} km</option>)}
                        </select>
                        <p className="mt-4 text-xs text-mute">Pick a slot</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {SLOTS.map((s) => <button key={s} onClick={() => setSlot(s)} className={`press rounded-full px-3.5 py-2 text-xs ${slot === s ? "bg-bone text-white" : "bg-slab text-mute hover:text-bone"}`}>{s}</button>)}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="mt-8 flex gap-2">
              <label htmlFor="pin" className="sr-only">Pincode</label>
              <input id="pin" inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Delivery pincode" className="field" />
              <Btn variant="ghost" onClick={checkPin} className="bg-white"><MapPin size={16} /> Check</Btn>
            </div>
            {pinRes && <p className={`mt-2 text-sm ${pinRes.err ? "text-red" : "text-fit"}`}>{pinRes.err || pinRes.ok}</p>}

            <div ref={buyRef}>
              <Btn className="mt-6 w-full py-4 text-base disabled:opacity-40" disabled={blocked || needsSize} onClick={addToBag}>
                {added ? <CheckCircle size={18} weight="fill" /> : <ShoppingBag size={18} />} {cta}
              </Btn>
            </div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-mute"><Medal size={16} className="text-red" /> Earn {Math.floor(p.price / 10).toLocaleString("en-IN")} Basecamp Pass points</p>

            <div className="mt-8 grid grid-cols-3 gap-2 text-center text-xs text-mute">
              <p className="card flex flex-col items-center gap-2 p-4"><Truck size={22} className="text-bone" /> Free over ₹1,499</p>
              <p className="card flex flex-col items-center gap-2 p-4"><ArrowsCounterClockwise size={22} className="text-bone" /> 15-day returns</p>
              <p className="card flex flex-col items-center gap-2 p-4"><ShieldCheck size={22} className="text-bone" /> {p.kind === "accessory" ? "Warranty intact" : "100% official"}</p>
            </div>
            <div className="mt-6">
              <Accordion title="Delivery and returns">Free delivery on orders over ₹1,499. UPI, cards, no-cost EMI and cash on delivery accepted. Return unworn items within 15 days. Personalised items cannot be returned.</Accordion>
              {p.kind === "accessory" && <Accordion title="Fitment and warranty">Genuine Mahindra accessory. Dealer and doorstep fitment by trained technicians keeps your vehicle warranty intact.</Accordion>}
            </div>
          </div>
        </div>
      </div>

      {/* feature band */}
      <section className="mx-3 mt-32 overflow-hidden rounded-[40px] bg-[#0e0f11] text-white sm:mx-5">
        <div className="mx-auto max-w-[1600px] px-6 py-20 sm:px-12 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red">{p.kind === "accessory" ? "Engineered by Mahindra" : "Designed by Basecamp"}</p>
          <h2 className="display mt-5 max-w-4xl text-5xl sm:text-7xl"><MaskLines lines={[p.kind === "accessory" ? "Made for the trail." : "Made to be worn hard."]} inView /></h2>
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {features.map(([k, v], i) => (
              <motion.div key={k} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.8, ease: EASE }}
                className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7">
                <p className="text-sm text-white/50">{k}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight">{v}</p>
              </motion.div>
            ))}
          </div>
          {fitModels.length > 0 && (
            <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-10 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-white/50">Fits these Mahindras</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {fitModels.map((x) => <span key={x.id} className={`rounded-full px-4 py-2 text-sm ${vehicle?.model === x.id ? "bg-red text-white" : "bg-white/10"}`}>{x.name}</span>)}
                </div>
              </div>
              {in3d && <Btn as={Link} to="/build" variant="bone" className="!bg-white py-4 !text-bone"><Cube size={18} /> See it fitted in 3D</Btn>}
            </div>
          )}
        </div>
      </section>

      {/* reviews */}
      <section className="mx-auto mt-32 max-w-[1600px] px-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="display text-5xl sm:text-7xl"><MaskLines lines={["Trail-tested", "by owners."]} inView /></h2>
          <div className="flex items-end gap-3"><span className="text-7xl font-semibold tracking-[-0.05em]">4.8</span><span className="mb-2 text-mute">from 212 reviews</span></div>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <motion.div key={r.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.8, ease: EASE }} className="card p-7">
              <div className="flex items-center justify-between">
                <span className="flex">{[0, 1, 2, 3, 4].map((k) => <Star key={k} size={16} weight="fill" className={k < r.stars ? "text-bone" : "text-line"} />)}</span>
                <span className="rounded-full bg-slab px-3 py-1 text-xs">{r.place}</span>
              </div>
              <p className="mt-5 text-lg leading-snug">{r.text}</p>
              <p className="mt-6 text-sm text-mute">{r.name}, {r.car} owner</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* related */}
      {related.length > 0 && (
        <section className="mx-auto mt-32 max-w-[1600px] px-5 sm:px-8">
          <div className="flex items-end justify-between">
            <h2 className="display text-5xl sm:text-7xl"><MaskLines lines={[p.kind === "accessory" ? "Complete the build." : collection ? `More ${collection.name}.` : "You might like."]} inView /></h2>
            <Link to={back[0]} className="hidden items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] hover:text-red sm:flex">View all <ArrowUpRight size={16} /></Link>
          </div>
          <Rail className="mt-10">
            {related.map((r, i) => <div key={r.id} className="w-[64vw] shrink-0 snap-start sm:w-[320px]"><ProductCard p={r} i={i} /></div>)}
          </Rail>
        </section>
      )}

      {/* sticky add bar */}
      <AnimatePresence>
        {!buyVisible && (
          <motion.div initial={{ y: 120 }} animate={{ y: 0 }} exit={{ y: 120 }} transition={{ duration: 0.5, ease: EASE }}
            className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-3xl items-center gap-4 rounded-full bg-white/90 p-2 pl-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,.35)] backdrop-blur-xl">
            <Photo src={p.image} className="h-12 w-12 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{p.name}</p>
              <p className="text-sm text-mute tabular-nums">{inr(p.price + fee)}{size && `, ${size}`}</p>
            </div>
            <button onClick={addToBag} className="press flex shrink-0 items-center gap-2 rounded-full bg-red px-6 py-3.5 text-sm font-semibold text-white hover:bg-red-deep">
              {added ? <CheckCircle size={18} weight="fill" /> : <ShoppingBag size={18} />} {needsSize ? "Choose size" : added ? "Added" : "Add to bag"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* zoom */}
      <AnimatePresence>
        {zoom && (
          <motion.div className="fixed inset-0 z-[70] grid place-items-center bg-black/90 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setZoom(null)}>
            <motion.img initial={{ scale: 0.92 }} animate={{ scale: 1 }} src={img(zoom)} alt="" className="max-h-[90vh] max-w-full rounded-2xl object-contain" />
            <button aria-label="Close" className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white"><X size={20} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
