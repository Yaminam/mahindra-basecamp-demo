import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle, WhatsappLogo, Medal, Package, Storefront, Wrench, Flag } from "@phosphor-icons/react";
import { useStore } from "../store";
import { inr } from "../data";
import { Btn, Photo } from "../components/ui";

const EASE = [0.16, 1, 0.3, 1];

function timeline(l) {
  if (l.kind === "experience") return { icon: Flag, steps: ["Seat confirmed", "Trail briefing on WhatsApp", l.date] };
  if (l.mode === "dealer" || l.kind === "pack") return { icon: Storefront, steps: ["Order confirmed", "Part reserved at dealer", l.slot ? `Fitment ${l.slot}` : "Dealer will call to book a slot"] };
  if (l.mode === "doorstep") return { icon: Wrench, steps: ["Order confirmed", "Technician assigned", "Visit within 3 days"] };
  return { icon: Package, steps: ["Order confirmed", "Packed", "Out for delivery in 2 to 4 days"] };
}

export default function Order() {
  const o = useStore((s) => s.lastOrder);
  if (!o)
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="display text-5xl">No recent orders</h1>
        <Btn as={Link} to="/shop" className="mt-8">Shop accessories</Btn>
      </div>
    );
  return (
    <div className="mx-auto max-w-3xl px-4 pt-14 sm:px-6">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
        <CheckCircle size={64} weight="fill" className="text-fit" />
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.8, ease: EASE }} className="display mt-6 text-6xl sm:text-7xl">You are all set</motion.h1>
      <p className="mt-3 text-mute">Order <span className="font-mono text-bone">{o.id}</span>, {inr(o.total)} paid by {o.pay === "upi" ? "UPI" : o.pay === "emi" ? "no-cost EMI" : o.pay === "cod" ? "cash on delivery" : "card"}.</p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-4 card p-5">
          <WhatsappLogo size={30} weight="fill" className="text-fit" />
          <p className="text-sm">Updates are coming to <span className="font-mono">+91 {o.phone || "your number"}</span> on WhatsApp.</p>
        </div>
        <div className="flex items-center gap-4 card p-5">
          <Medal size={30} className="text-red" />
          <p className="text-sm"><span className="font-mono">+{o.earned.toLocaleString("en-IN")}</span> Basecamp Pass points earned.</p>
        </div>
      </div>

      <ul className="mt-10 space-y-3">
        {o.lines.map((l, i) => {
          const t = timeline(l);
          return (
            <motion.li key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08, ease: EASE }} className="card p-5">
              <div className="flex items-center gap-4">
                <Photo src={l.image} className="h-16 w-14 shrink-0 rounded-lg" />
                <div className="flex-1">
                  <p className="font-medium">{l.name} <span className="text-mute">x{l.qty}</span></p>
                  {l.dealer && <p className="text-xs text-mute">{l.dealer}</p>}
                </div>
                <t.icon size={22} className="text-mute" />
              </div>
              <ol className="mt-5 grid grid-cols-3 gap-2">
                {t.steps.map((s, k) => (
                  <li key={s} className="text-xs">
                    <div className={`h-1 rounded-full ${k === 0 ? "bg-fit" : "bg-line"}`} />
                    <p className={`mt-2 ${k === 0 ? "text-bone" : "text-mute"}`}>{s}</p>
                  </li>
                ))}
              </ol>
            </motion.li>
          );
        })}
      </ul>
      <div className="mt-10 flex flex-wrap gap-3">
        <Btn as={Link} to="/shop">Keep shopping</Btn>
        <Btn as={Link} to="/pass" variant="ghost">View my Pass</Btn>
      </div>
    </div>
  );
}
