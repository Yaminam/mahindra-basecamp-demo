import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { QrCode, CreditCard, HandCoins, Money, CheckCircle, Info, CircleNotch, Lock } from "@phosphor-icons/react";
import { useStore, cartTotal } from "../store";
import { inr } from "../data";
import { Photo, Btn } from "../components/ui";
import { MODE_LABEL } from "../components/shell";

const COD_LIMIT = 10000;
const field = "mt-2 field ";

function Step({ n, title, done, children }) {
  return (
    <section className="card p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className={`grid h-8 w-8 place-items-center rounded-full font-mono text-sm ${done ? "bg-fit text-ink" : "bg-slab text-bone"}`}>{done ? <CheckCircle size={18} weight="bold" /> : n}</span>
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function Checkout() {
  const { cart, points, addPoints, clearCart, setLastOrder } = useStore();
  const nav = useNavigate();
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [addr, setAddr] = useState({ name: "", pin: "", line: "", city: "" });
  const [pay, setPay] = useState("upi");
  const [upiApp, setUpiApp] = useState("GPay");
  const [emi, setEmi] = useState(6);
  const [redeem, setRedeem] = useState(false);
  const [placing, setPlacing] = useState(false);

  const sub = cartTotal(cart);
  const ptsValue = redeem ? Math.min(Math.floor(points / 4), Math.floor(sub * 0.2)) : 0;
  const total = Math.max(0, sub - ptsValue);
  const hasFitment = cart.some((l) => l.mode === "dealer" || l.mode === "doorstep" || l.kind === "pack");
  const codBlocked = hasFitment ? "Fitment orders are paid at the dealer instead" : total > COD_LIMIT ? `COD is available up to ${inr(COD_LIMIT)}` : "";
  const verified = otpSent && otp.length === 4;
  const addrOk = addr.name && /^\d{6}$/.test(addr.pin) && addr.line;
  const ready = verified && addrOk && !(pay === "cod" && codBlocked);

  if (cart.length === 0)
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="display text-5xl">Your cart is empty</h1>
        <Btn as={Link} to="/shop" className="mt-8">Shop accessories</Btn>
      </div>
    );

  const place = () => {
    setPlacing(true);
    setTimeout(() => {
      const earned = Math.floor(total / 10);
      setLastOrder({ id: "BC" + Math.floor(100000 + Math.random() * 899999), lines: cart, total, pay, earned, phone, city: addr.city || "Pune", at: Date.now(), redeemed: ptsValue });
      addPoints(earned - (redeem ? ptsValue * 4 : 0));
      clearCart();
      nav("/order");
    }, 1600);
  };

  const PAY = [
    { id: "upi", icon: QrCode, title: "UPI", sub: "GPay, PhonePe, Paytm or any UPI ID" },
    { id: "card", icon: CreditCard, title: "Credit or debit card", sub: "Visa, Mastercard, RuPay" },
    { id: "emi", icon: HandCoins, title: "No-cost EMI", sub: `From ${inr(total / 9)}/month on cards and cardless EMI` },
    { id: "cod", icon: Money, title: "Cash on delivery", sub: codBlocked || "Pay when it arrives" },
  ];

  return (
    <div className="mx-auto grid max-w-[1400px] gap-8 px-4 pt-10 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-4">
        <h1 className="display text-5xl sm:text-6xl">Checkout</h1>

        <Step n="1" title="Mobile number" done={verified}>
          <div className="flex gap-2">
            <div className="flex flex-1 items-center rounded-2xl bg-white shadow-[inset_0_0_0_1px_rgba(12,13,15,.08)] focus-within:shadow-[inset_0_0_0_2px_#1c1c1c]">
              <span className="pl-4 font-mono text-sm text-mute">+91</span>
              <input aria-label="Mobile number" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Mobile number" className="w-full bg-transparent px-3 py-3 font-mono text-sm placeholder:text-mute focus:outline-none" />
            </div>
            <Btn variant="ghost" disabled={!/^[6-9]\d{9}$/.test(phone)} className="disabled:opacity-40" onClick={() => setOtpSent(true)}>{otpSent ? "Resend" : "Send OTP"}</Btn>
          </div>
          <AnimatePresence>
            {otpSent && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="overflow-hidden">
                <label htmlFor="otp" className="mt-4 block text-xs text-mute">Enter the 4-digit OTP (any 4 digits in this demo)</label>
                <input id="otp" inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))} className={`${field} w-40 text-center font-mono tracking-[0.5em]`} />
              </motion.div>
            )}
          </AnimatePresence>
        </Step>

        <Step n="2" title="Delivery address" done={addrOk}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="nm" className="text-xs text-mute">Full name</label>
              <input id="nm" value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} className={field} />
            </div>
            <div>
              <label htmlFor="pc" className="text-xs text-mute">Pincode</label>
              <input id="pc" inputMode="numeric" value={addr.pin}
                onChange={(e) => { const pin = e.target.value.replace(/\D/g, "").slice(0, 6); setAddr({ ...addr, pin, city: pin.length === 6 ? (pin.startsWith("411") ? "Pune" : pin.startsWith("400") ? "Mumbai" : pin.startsWith("110") ? "New Delhi" : pin.startsWith("560") ? "Bengaluru" : "Your city") : "" }); }}
                className={field} />
            </div>
            <div>
              <label htmlFor="ct" className="text-xs text-mute">City</label>
              <input id="ct" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} className={field} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="ln" className="text-xs text-mute">House, street, area</label>
              <input id="ln" value={addr.line} onChange={(e) => setAddr({ ...addr, line: e.target.value })} className={field} />
            </div>
          </div>
          {hasFitment && <p className="mt-4 flex items-start gap-2 text-sm text-mute"><Info size={18} className="shrink-0 text-red" /> Fitment items go to your chosen dealer or technician. We will confirm your slot on WhatsApp.</p>}
        </Step>

        <Step n="3" title="Payment" done={false}>
          <div className="space-y-2">
            {PAY.map((p) => {
              const dis = p.id === "cod" && !!codBlocked;
              return (
                <button key={p.id} disabled={dis} onClick={() => setPay(p.id)}
                  className={`press flex w-full items-center gap-4 rounded-2xl p-4 text-left disabled:cursor-not-allowed disabled:opacity-40 ${pay === p.id ? "bg-white shadow-[inset_0_0_0_2px_#1c1c1c]" : "bg-white/60 shadow-[inset_0_0_0_1px_rgba(0,0,0,.06)] hover:bg-white"}`}>
                  <p.icon size={24} className={pay === p.id ? "text-red" : "text-mute"} />
                  <span className="flex-1"><span className="block text-sm font-medium">{p.title}</span><span className="block text-xs text-mute">{p.sub}</span></span>
                  <span className={`h-5 w-5 rounded-full border-2 ${pay === p.id ? "border-[6px] border-red" : "border-line"}`} />
                </button>
              );
            })}
          </div>
          {pay === "upi" && (
            <div className="mt-4 flex flex-wrap gap-2">
              {["GPay", "PhonePe", "Paytm", "BHIM", "Other UPI ID"].map((a) => (
                <button key={a} onClick={() => setUpiApp(a)} className={`press rounded-full border px-4 py-2 text-sm ${upiApp === a ? "border-red bg-red/10" : "border-line text-mute"}`}>{a}</button>
              ))}
            </div>
          )}
          {pay === "emi" && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[3, 6, 9].map((n) => (
                <button key={n} onClick={() => setEmi(n)} className={`press rounded-2xl border p-4 text-left ${emi === n ? "border-red bg-red/10" : "border-line"}`}>
                  <span className="block font-mono text-sm">{inr(total / n)}/mo</span>
                  <span className="text-xs text-mute">{n} months, no cost</span>
                </button>
              ))}
            </div>
          )}
        </Step>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-medium">Order summary</h2>
          <ul className="mt-6 space-y-4">
            {cart.map((l) => (
              <li key={l.id + l.mode + (l.size || "")} className="flex gap-3">
                <Photo src={l.image} className="h-16 w-14 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{l.name} <span className="text-mute">x{l.qty}</span></p>
                  <p className="text-xs text-mute">{l.kind === "experience" ? l.date : MODE_LABEL[l.mode]}{l.slot ? `, ${l.slot}` : ""}</p>
                </div>
                <span className="font-mono text-sm">{inr(l.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <label className="mt-6 flex cursor-pointer items-center justify-between rounded-xl bg-slab p-4 text-sm">
            <span>Use {points.toLocaleString("en-IN")} Pass points<span className="block text-xs text-mute">Up to 20% of your order</span></span>
            <input type="checkbox" checked={redeem} onChange={(e) => setRedeem(e.target.checked)} className="h-5 w-5 accent-[#e0262f]" />
          </label>
          <div className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
            <div className="flex justify-between text-mute"><span>Subtotal</span><span className="font-mono">{inr(sub)}</span></div>
            {ptsValue > 0 && <div className="flex justify-between text-fit"><span>Points redeemed</span><span className="font-mono">-{inr(ptsValue)}</span></div>}
            <div className="flex justify-between text-mute"><span>Shipping</span><span className="font-mono">Free</span></div>
            <div className="flex items-baseline justify-between pt-2"><span>Total</span><span className="display text-4xl">{inr(total)}</span></div>
          </div>
          <Btn className="mt-6 w-full py-4 text-base disabled:opacity-40" disabled={!ready || placing} onClick={place}>
            {placing ? <><CircleNotch size={18} className="animate-spin" /> Confirming payment</> : pay === "cod" ? "Place order" : `Pay ${inr(total)}`}
          </Btn>
          {!ready && <p className="mt-3 text-center text-xs text-mute">{!verified ? "Verify your mobile number to continue" : !addrOk ? "Add your delivery address to continue" : codBlocked}</p>}
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-mute"><Lock size={13} /> Secure checkout. Demo only, no real payment is taken.</p>
        </div>
      </aside>
    </div>
  );
}
