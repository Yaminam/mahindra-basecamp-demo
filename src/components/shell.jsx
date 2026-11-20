import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { ShoppingBag, Garage, X, Minus, Plus, ArrowRight, List, Medal, CheckCircle, InstagramLogo, YoutubeLogo, XLogo, ArrowUpRight } from "@phosphor-icons/react";
import { useStore, cartTotal, cartCount } from "../store";
import { MODELS, VARIANTS, modelById, inr, img } from "../data";
import { Photo, Btn } from "./ui";
import Logo from "./Logo";
import { MaskLines } from "./premium";

const EASE = [0.16, 1, 0.3, 1];
export const MODE_LABEL = { ship: "Ship home (DIY)", dealer: "Fit at dealer", doorstep: "Doorstep fitment" };

const LINKS = [
  ["/merch", "Merch", "racing.jpg"],
  ["/build", "Build in 3D", "thar-red.jpg"],
  ["/shop", "Accessories", "hero-thar.jpg"],
  ["/worlds", "Worlds", "scorpio-spiti.jpg"],
  ["/drops", "Drops", "jacket.jpg"],
  ["/trails", "Trails", "trail-ladakh.jpg"],
];

export function Nav() {
  const { vehicle, openPicker, openCart, cart, points } = useStore();
  const [menu, setMenu] = useState(false);
  const [hover, setHover] = useState(LINKS[0][2]);
  const [top, setTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const loc = useLocation();
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() || 0;
    setTop(y < 60);
    setHidden(y > 240 && y > prev && !menu);
  });
  useEffect(() => { setMenu(false); }, [loc.pathname]);
  const m = vehicle && modelById(vehicle.model);
  const count = cartCount(cart);
  const overHero = loc.pathname === "/" && top && !menu;
  const tone = overHero ? "text-white" : "text-bone";

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${overHero ? "bg-transparent" : "border-b border-black/[0.06] bg-white/80 backdrop-blur-2xl backdrop-saturate-150"}`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center gap-3 px-4 sm:gap-8 sm:px-8 2xl:gap-10">
          <Link to="/" aria-label="Mahindra Basecamp home" className="shrink-0"><Logo invert={overHero} /></Link>
          <nav className="hidden items-center gap-5 xl:flex 2xl:gap-7">
            {LINKS.map(([to, label]) => (
              <NavLink key={to} to={to} className={`group relative whitespace-nowrap py-2 text-[12px] font-semibold uppercase tracking-[0.12em] 2xl:text-[12.5px] 2xl:tracking-[0.14em] ${tone}`}>
                {({ isActive }) => (
                  <>
                    <span className={`transition-opacity ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>{label}</span>
                    {to === "/merch" && <span className="ml-1.5 inline-block -translate-y-1.5 rounded-full bg-red px-1.5 py-0.5 align-top text-[9px] font-bold tracking-[0.08em] text-white">NEW</span>}
                    {isActive && <motion.span layoutId="navline" className="absolute -bottom-0.5 left-0 h-[2px] w-full bg-red" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className={`ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1 ${tone}`}>
            <button onClick={openPicker} className={`press hidden items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium transition sm:flex ${overHero ? "bg-white/15 backdrop-blur hover:bg-white/25" : "bg-slab hover:bg-[#dfe0e3]"}`}>
              <Garage size={17} className={m ? "text-red" : ""} />
              {m ? <span>{m.name} <span className="opacity-60">{vehicle.variant}</span></span> : <span className="opacity-80">Add your vehicle</span>}
            </button>
            <Link to="/pass" className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-[13px] tabular-nums opacity-80 hover:opacity-100 md:flex">
              <Medal size={17} /> {points.toLocaleString("en-IN")}
            </Link>
            <button onClick={openCart} aria-label="Open bag" className="press relative grid h-11 w-11 place-items-center rounded-full hover:bg-black/5">
              <ShoppingBag size={21} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span key={count} initial={{ scale: 0.4 }} animate={{ scale: 1 }} className="absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-red px-1 text-[11px] font-semibold text-white">{count}</motion.span>
                )}
              </AnimatePresence>
            </button>
            <button onClick={() => setMenu(!menu)} aria-label="Menu" aria-expanded={menu} className="press flex items-center gap-2.5 rounded-full py-2 pl-3 pr-1 text-[12.5px] font-semibold uppercase tracking-[0.14em]">
              <span className="hidden sm:inline">{menu ? "Close" : "Menu"}</span>
              <span className="relative grid h-9 w-9 place-items-center">
                <motion.span animate={menu ? { rotate: 45, y: 0 } : { rotate: 0, y: -3.5 }} className="absolute h-[1.5px] w-5 bg-current" />
                <motion.span animate={menu ? { rotate: -45, y: 0 } : { rotate: 0, y: 3.5 }} className="absolute h-[1.5px] w-5 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            data-lenis-prevent className="fixed inset-0 z-[35] overflow-y-auto overscroll-contain bg-white pt-[72px]"
            initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="mx-auto grid h-full max-w-[1600px] gap-8 px-5 pb-8 sm:px-8 lg:grid-cols-[1.1fr_1fr]">
              <nav className="flex flex-col justify-center">
                {[...LINKS, ["/pass", "Basecamp Pass", "camp.jpg"]].map(([to, label, pic], i) => (
                  <div key={to} className="overflow-hidden">
                    <motion.div initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ delay: 0.25 + i * 0.05, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
                      <NavLink to={to} onMouseEnter={() => setHover(pic)} className={({ isActive }) => `group flex items-baseline gap-5 py-1 text-[11vw] font-semibold leading-[1.02] tracking-[-0.05em] transition-colors sm:text-7xl lg:text-[5.5rem] ${isActive ? "text-red" : "text-bone hover:text-red"}`}>
                        <span className="text-sm font-medium tracking-normal text-dim tabular-nums">0{i + 1}</span>
                        <span className="transition-transform duration-500 group-hover:translate-x-3">{label}</span>
                      </NavLink>
                    </motion.div>
                  </div>
                ))}
              </nav>
              <div className="relative hidden overflow-hidden rounded-[32px] lg:block">
                <AnimatePresence mode="popLayout">
                  <motion.img key={hover} src={img(hover)} alt="" className="absolute inset-0 h-full w-full object-cover" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: EASE }} />
                </AnimatePresence>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-8 text-white">
                  <p className="text-sm text-white/70">Need help with fitment?</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">1800 209 6006</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const PICKER_IMG = { thar: "thar-red.jpg", roxx: "hero-thar.jpg", scorpion: "scorpio-spiti.jpg", scorpioc: "person-trail.jpg" };
const GROUPS = ["Thar", "Scorpio", "XUV", "Bolero", "Born Electric"];
const META = {
  thar: { tag: "Explore the impossible.", specs: ["3-door", "4x4", "Petrol / Diesel", "4 seats"] },
  roxx: { tag: "The Thar, grown up.", specs: ["5-door", "4x4", "Petrol / Diesel", "5 seats"] },
  scorpion: { tag: "The Big Daddy of SUVs.", specs: ["5-door", "4XPLOR 4x4", "Petrol / Diesel", "6-7 seats"] },
  scorpioc: { tag: "The original legend.", specs: ["5-door", "2WD", "Diesel", "7-9 seats"] },
  xuv700: { tag: "Tech-loaded family SUV.", specs: ["5-door", "AWD option", "Petrol / Diesel", "5-7 seats"] },
  xuv3xo: { tag: "Compact. Quick. Clever.", specs: ["5-door", "2WD", "Petrol / Diesel", "5 seats"] },
  boleroneo: { tag: "Tough as they come.", specs: ["5-door", "2WD", "Diesel", "7 seats"] },
  be6: { tag: "Born Electric. Built for thrill.", specs: ["Electric", "RWD", "Fast charging", "5 seats"] },
  xev9e: { tag: "Born Electric. Built for space.", specs: ["Electric", "RWD", "Fast charging", "5 seats"] },
  xev9s: { tag: "Born Electric. Room for seven.", specs: ["Electric", "RWD", "Fast charging", "7 seats"] },
};

export function VehiclePicker() {
  const { pickerOpen, closePicker, vehicle, setVehicle, clearVehicle } = useStore();
  const [model, setModel] = useState(vehicle?.model || "roxx");
  const [variant, setVariant] = useState(vehicle?.variant || "");
  const [year, setYear] = useState(vehicle?.year || "");
  const [vinOpen, setVinOpen] = useState(false);
  const [vin, setVin] = useState("");
  const m = modelById(model);
  useEffect(() => {
    if (pickerOpen) {
      setModel(vehicle?.model || "roxx");
      setVariant(vehicle?.variant || "");
      setYear(vehicle?.year || "");
      setVinOpen(false);
    }
  }, [pickerOpen]);
  useEffect(() => {
    const k = (e) => { if (e.key === "Escape") closePicker(); };
    if (pickerOpen) window.addEventListener("keydown", k);
    return () => { window.removeEventListener("keydown", k); };
  }, [pickerOpen]);
  const v = variant || VARIANTS[model].at(-1);
  const y = year || m.years.at(-1);
  const save = () => { setVehicle({ model, variant: v, year: y }); closePicker(); };
  const fromVin = () => { setModel("roxx"); setVariant("AX7L 4x4"); setYear(2025); setVinOpen(false); };
  const pic = PICKER_IMG[model];

  return (
    <AnimatePresence>
      {pickerOpen && (
        <motion.div
          role="dialog" aria-label="My Garage" data-lenis-prevent
          className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-white"
          initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(100% 0 0 0)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="grid min-h-full lg:grid-cols-[1fr_1.15fr]">
            <div className="flex flex-col px-6 pb-10 pt-6 sm:px-12">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-mute">My Garage</span>
                <button onClick={closePicker} aria-label="Close" className="press grid h-12 w-12 place-items-center rounded-full bg-slab hover:bg-[#dfe0e3]"><X size={20} /></button>
              </div>
              <h2 className="display mt-12 text-5xl sm:text-7xl">What do<br />you drive?</h2>
              <div className="mt-12 space-y-9">
                {GROUPS.map((g, gi) => (
                  <motion.div key={g} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + gi * 0.06, duration: 0.7, ease: EASE }}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-dim">{g}</p>
                    <div className="mt-2 flex flex-wrap gap-x-9 gap-y-1">
                      {MODELS.filter((x) => x.line === g).map((x) => (
                        <button key={x.id} onClick={() => { setModel(x.id); setVariant(""); setYear(""); }}
                          className={`relative py-1 text-left text-4xl font-semibold tracking-[-0.04em] transition-colors sm:text-[3.25rem] ${model === x.id ? "text-bone" : "text-[#c4c6ca] hover:text-bone"}`}>
                          {x.name}
                          {model === x.id && <motion.span layoutId="pick" className="absolute -bottom-0.5 left-0 h-[3px] w-full rounded-full bg-red" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative m-3 min-h-[660px] overflow-hidden rounded-[32px] bg-slab lg:sticky lg:top-3 lg:h-[calc(100dvh-1.5rem)]">
              <AnimatePresence mode="popLayout">
                <motion.div key={model} className="absolute inset-0" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: EASE }}>
                  {pic ? (
                    <img src={img(pic)} alt={m.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className={`relative h-full w-full overflow-hidden ${m.ev ? "bg-[radial-gradient(120%_90%_at_20%_10%,#bdeee4,#e8f4f1_45%,#eef0f2)]" : "bg-[radial-gradient(120%_90%_at_20%_10%,#ffffff,#e6e8eb_55%,#dcdfe3)]"}`}>
                      <div className="absolute inset-x-0 top-[12%] px-8 sm:px-12">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red">{META[model].tag}</p>
                        <p className="display mt-4 select-none whitespace-nowrap text-[13vw] leading-[0.85] text-transparent [-webkit-text-stroke:2px_rgba(28,28,28,.85)] lg:text-[8.5rem]">{m.name}</p>
                        <div className="mt-8 flex flex-wrap gap-2">
                          {META[model].specs.map((sp) => <span key={sp} className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">{sp}</span>)}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              {pic && <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />}

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.8, ease: EASE }}
                className="absolute inset-x-3 bottom-3 rounded-[26px] bg-white/90 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,.5)] backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-mute">{m.line}</p>
                    <AnimatePresence mode="wait">
                      <motion.p key={model} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }} className="display mt-1 text-4xl sm:text-5xl">{m.name}</motion.p>
                    </AnimatePresence>
                  </div>
                  <span className="text-right text-sm text-mute">{m.fourByFour ? "4x4 capable" : m.ev ? "Born Electric" : "2WD"}</span>
                </div>
                <p className="mt-6 text-xs text-mute">Variant</p>
                <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto">
                  {VARIANTS[model].map((x) => (
                    <button key={x} onClick={() => setVariant(x)} className={`press shrink-0 rounded-full px-4 py-2 text-sm transition ${v === x ? "bg-bone text-white" : "bg-slab text-mute hover:text-bone"}`}>{x}</button>
                  ))}
                </div>
                <p className="mt-4 text-xs text-mute">Year</p>
                <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto">
                  {m.years.map((x) => (
                    <button key={x} onClick={() => setYear(x)} className={`press shrink-0 rounded-full px-4 py-2 text-sm tabular-nums transition ${y === x ? "bg-bone text-white" : "bg-slab text-mute hover:text-bone"}`}>{x}</button>
                  ))}
                </div>
                <AnimatePresence initial={false}>
                  {vinOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-4 flex gap-2">
                        <label htmlFor="vin" className="sr-only">VIN</label>
                        <input id="vin" value={vin} onChange={(e) => setVin(e.target.value.toUpperCase().slice(0, 17))} placeholder="17-character VIN from your RC" className="field font-mono tracking-wider" />
                        <Btn variant="ghost" onClick={fromVin} disabled={vin.length !== 17} className="bg-white disabled:opacity-40">Look up</Btn>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex gap-4 text-sm text-mute">
                    <button onClick={() => setVinOpen(!vinOpen)} className="underline-offset-4 hover:text-bone hover:underline">{vinOpen ? "Hide VIN" : "Use my VIN"}</button>
                    {vehicle && <button onClick={() => { clearVehicle(); closePicker(); }} className="underline-offset-4 hover:text-bone hover:underline">Remove vehicle</button>}
                  </div>
                  <Btn onClick={save} className="py-4">Save {m.name} <ArrowRight size={16} weight="bold" /></Btn>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CartDrawer() {
  const { cartOpen, closeCart, cart, setQty } = useStore();
  const nav = useNavigate();
  const total = cartTotal(cart);
  const freeShip = 1499;
  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeCart}>
          <motion.aside
            role="dialog" aria-label="Bag"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.55, ease: EASE }}
            className="absolute bottom-2 right-2 top-2 flex w-[calc(100%-1rem)] max-w-md flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between px-7 pb-4 pt-6">
              <h2 className="display text-4xl">Your bag</h2>
              <button onClick={closeCart} aria-label="Close bag" className="grid h-10 w-10 place-items-center rounded-full bg-slab"><X size={18} /></button>
            </div>
            {cart.length > 0 && (
              <div className="mx-7 rounded-2xl bg-ink p-3 text-xs text-mute">
                {total >= freeShip ? <span className="text-fit">You have free shipping.</span> : <>Add {inr(freeShip - total)} more for free shipping.</>}
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-slab"><motion.div className="h-full bg-red" initial={{ width: 0 }} animate={{ width: `${Math.min(100, (total / freeShip) * 100)}%` }} /></div>
              </div>
            )}
            {cart.length === 0 ? (
              <div className="grid flex-1 place-items-center p-10 text-center">
                <div>
                  <ShoppingBag size={44} className="mx-auto text-dim" />
                  <p className="mt-4 text-lg font-medium">Nothing packed yet.</p>
                  <p className="mt-1 text-sm text-mute">Start with gear that fits your vehicle.</p>
                  <div className="mt-6 flex justify-center gap-2">
                    <Btn onClick={() => { closeCart(); nav("/shop"); }}>Accessories</Btn>
                    <Btn variant="ghost" onClick={() => { closeCart(); nav("/merch"); }}>Merch</Btn>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <ul data-lenis-prevent className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-7 py-6">
                  {cart.map((l) => (
                    <motion.li layout key={l.id + l.mode + (l.size || "")} className="flex gap-4">
                      <Photo src={l.image} className="h-24 w-20 shrink-0 rounded-2xl bg-[#e9eaec]" />
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-2">
                          <p className="font-medium leading-snug">{l.name}</p>
                          <p className="text-sm tabular-nums">{inr(l.price * l.qty)}</p>
                        </div>
                        <p className="mt-1 text-xs text-mute">
                          {l.kind === "experience" ? l.date : l.kind === "merch" ? "Ships in 2 to 4 days" : MODE_LABEL[l.mode]}
                          {l.size && `, size ${l.size}`}
                          {l.slot && `, ${l.slot}`}
                        </p>
                        <div className="mt-3 inline-flex items-center rounded-full bg-slab">
                          <button aria-label="Decrease" onClick={() => setQty(l, l.qty - 1)} className="grid h-8 w-8 place-items-center"><Minus size={14} /></button>
                          <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                          <button aria-label="Increase" onClick={() => setQty(l, l.qty + 1)} className="grid h-8 w-8 place-items-center"><Plus size={14} /></button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
                <div className="border-t border-black/5 px-7 py-6">
                  <div className="flex justify-between text-sm text-mute"><span>Pass points on this order</span><span className="text-bone">+{Math.floor(total / 10).toLocaleString("en-IN")}</span></div>
                  <div className="mt-2 flex items-baseline justify-between"><span className="font-medium">Subtotal</span><span className="text-3xl font-semibold tracking-tight tabular-nums">{inr(total)}</span></div>
                  <p className="mt-1 text-xs text-mute">or from {inr(total / 6)}/month on no-cost EMI</p>
                  <Btn className="mt-5 w-full py-4" onClick={() => { closeCart(); nav("/checkout"); }}>Checkout <ArrowRight size={16} weight="bold" /></Btn>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Footer() {
  const [mail, setMail] = useState("");
  const [done, setDone] = useState(false);
  const openPicker = useStore((s) => s.openPicker);
  const TRIBE = ["thar-red.jpg", "trail-ladakh.jpg", "camp.jpg", "thar-splash.jpg", "scorpio-spiti.jpg", "dog.jpg"];
  return (
    <footer className="mx-3 mb-3 mt-40 overflow-hidden rounded-[40px] bg-[#0b0c0e] text-white sm:mx-5">
      {/* call to action */}
      <div className="relative mx-auto max-w-[1600px] px-6 pt-20 sm:px-12">
        <div className="absolute -top-40 left-1/3 h-[420px] w-[620px] rounded-full bg-red/20 blur-[140px]" />
        <div className="relative grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <h2 className="display text-6xl sm:text-8xl"><MaskLines lines={["Your next trail", "starts here."]} inView /></h2>
          <div>
            <form onSubmit={(e) => { e.preventDefault(); if (/\S+@\S+\.\S+/.test(mail)) setDone(true); }}>
              <label htmlFor="news" className="text-sm text-white/55">Drops, trails and members-only offers. No spam.</label>
              {done ? (
                <p className="mt-4 flex items-center gap-2 text-[#5fe0a0]"><CheckCircle size={20} weight="fill" /> You are on the list.</p>
              ) : (
                <div className="mt-3 flex items-center rounded-full border border-white/15 bg-white/5 p-1.5 pl-5 backdrop-blur focus-within:border-white/50">
                  <input id="news" type="email" value={mail} onChange={(e) => setMail(e.target.value)} placeholder="you@example.com" className="w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none" />
                  <button type="submit" className="press shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-bone hover:bg-red hover:text-white">Subscribe</button>
                </div>
              )}
            </form>
            <button onClick={openPicker} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-white/80 hover:text-white"><Garage size={18} /> Set up My Garage <ArrowRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* tribe strip */}
      <div className="mx-auto mt-20 max-w-[1600px] px-6 sm:px-12">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/55">#BasecampTribe</p>
          <p className="text-sm text-white/40">Tag your trail to be featured</p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {TRIBE.map((t, i) => (
            <motion.div key={t} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.8, ease: EASE }}
              className="group relative aspect-square overflow-hidden rounded-2xl">
              <img src={img(t)} alt="" loading="lazy" className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-110 group-hover:opacity-100" />
              <InstagramLogo size={18} className="absolute right-3 top-3 opacity-0 transition group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* links */}
      <div className="mx-auto mt-20 grid max-w-[1600px] grid-cols-2 gap-10 border-t border-white/10 px-6 pt-14 sm:px-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Logo invert />
          <p className="mt-6 max-w-xs text-sm text-white/50">Genuine accessories, official merch and trail experiences for every Mahindra owner.</p>
          <div className="mt-6 flex gap-2">
            {[InstagramLogo, YoutubeLogo, XLogo].map((I, i) => <span key={i} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-white hover:text-white"><I size={18} /></span>)}
          </div>
        </div>
        {[
          ["Shop", [["Build in 3D", "/build"], ["Accessories", "/shop"], ["Merch", "/merch"], ["Drops", "/drops"]]],
          ["Owners", [["My Garage", "/shop"], ["Trails", "/trails"], ["Basecamp Pass", "/pass"], ["Worlds", "/worlds"]]],
          ["Help", [["Fitment and warranty", "/shop"], ["Track an order", "/order"], ["Find a dealer", "/shop"], ["1800 209 6006", "/shop"]]],
        ].map(([h, items]) => (
          <div key={h}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">{h}</h3>
            <ul className="mt-5 space-y-3">
              {items.map(([l, to]) => (
                <li key={l}><Link to={to} className="group inline-flex items-center gap-1.5 text-white/75 transition hover:text-white">{l}<ArrowUpRight size={13} className="opacity-0 transition group-hover:opacity-100" /></Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* photo-filled wordmark */}
      <div
        className="mt-16 overflow-hidden px-3 sm:px-6"
        onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const t = e.currentTarget.querySelector("p"); if (t) t.style.backgroundPosition = ((e.clientX - r.left) / r.width) * 100 + "% 50%"; }}
        aria-hidden
      >
        <motion.p
          initial={{ y: "55%" }} whileInView={{ y: "0%" }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
          className="select-none whitespace-nowrap bg-cover bg-clip-text text-center text-[19vw] font-semibold leading-[0.8] tracking-[-0.065em] text-transparent transition-[background-position] duration-700 ease-out"
          style={{ backgroundImage: `url(${img("hero-thar.jpg")})`, backgroundPosition: "50% 50%" }}
        >
          BASECAMP
        </motion.p>
      </div>

      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 border-t border-white/10 px-6 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-12">
        <p>Concept demo prepared for Mahindra &amp; Mahindra. Products, prices, dealers and dates are illustrative. Photography under the Unsplash and Pexels licences.</p>
        <p>Made in India</p>
      </div>
    </footer>
  );
}

export function SavedTick({ children }) {
  return <span className="inline-flex items-center gap-1.5 text-sm text-fit"><CheckCircle weight="fill" size={16} />{children}</span>;
}
