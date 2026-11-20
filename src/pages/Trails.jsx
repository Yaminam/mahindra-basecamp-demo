import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Calendar, Flag, Medal, CheckCircle, ArrowRight, Mountains, Drop, Tent } from "@phosphor-icons/react";
import { useStore } from "../store";
import { EXPERIENCES, inr, modelById } from "../data";
import { Btn, Reveal } from "../components/ui";
import { PageHero, MaskLines, RevealImage } from "../components/premium";

export default function Trails() {
  const { vehicle, add, openPicker } = useStore();
  const [booked, setBooked] = useState("");
  const m = vehicle && modelById(vehicle.model);
  return (
    <div>
      <PageHero image="trail-ladakh.jpg" kicker="Trails" title={["Go where the", "road gives up."]} sub="Great Escape weekends, the Off-road Academy and Himalayan expeditions. Book a seat next to your gear." tall>
        <Btn onClick={() => document.getElementById("trips")?.scrollIntoView({ behavior: "smooth" })} variant="bone" className="!bg-white py-4 !text-bone">See the trips <ArrowRight size={16} weight="bold" /></Btn>
      </PageHero>

      <div id="trips" className="mx-auto max-w-[1600px] scroll-mt-24 space-y-32 px-5 pt-32 sm:px-8">
        {EXPERIENCES.map((e, i) => {
          const needs = e.needs4x4 && !(m && m.fourByFour);
          const flip = i % 2 === 1;
          return (
            <section key={e.id} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
              <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
                <RevealImage src={e.image} alt={e.name} className="aspect-[4/3] rounded-[36px]" />
              </div>
              <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red">{e.level}</p>
                <h2 className="display mt-4 text-5xl sm:text-7xl"><MaskLines lines={[e.name.replace(": ", ": ")]} inView /></h2>
                <p className="mt-6 max-w-md text-lg text-mute">{e.blurb}</p>
                <div className="mt-8 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-2xl bg-line">
                  {[[Calendar, e.date], [Users, `${e.seats} seats left`], [Medal, `+${Math.floor(e.price / 10)} pts`]].map(([I, t]) => (
                    <div key={t} className="bg-white p-4 text-sm"><I size={18} className="text-mute" /><p className="mt-2 font-medium">{t}</p></div>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <span className="text-4xl font-semibold tracking-tight tabular-nums">{inr(e.price)}<span className="ml-2 text-sm font-normal text-mute">per vehicle</span></span>
                  {needs ? (
                    <button onClick={openPicker} className="text-sm text-mute underline-offset-4 hover:text-bone hover:underline">Needs a Mahindra 4x4. {m ? `Your ${m.name} is not eligible.` : "Add your vehicle."}</button>
                  ) : (
                    <Btn className="py-4" onClick={() => { add({ id: e.id, name: e.name, price: e.price, image: e.image, mode: "ship", kind: "experience", date: e.date }); setBooked(e.id); }}>
                      {booked === e.id ? <><CheckCircle size={18} weight="fill" /> Seat in your bag</> : "Book a seat"}
                    </Btn>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="mx-3 mt-40 overflow-hidden rounded-[40px] bg-[#0e0f11] text-white sm:mx-5">
        <div className="mx-auto grid max-w-[1600px] gap-14 px-6 py-20 sm:px-12 sm:py-24 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <Flag size={34} className="text-red" />
            <h2 className="display mt-6 text-6xl sm:text-8xl"><MaskLines lines={["Earned,", "not bought."]} inView /></h2>
            <p className="mt-6 max-w-md text-lg text-white/60">Finish a trail or an Academy level and your Pass unlocks a patch, tee or badge that is never for sale.</p>
            <Btn as={Link} to="/pass" variant="bone" className="mt-10 !bg-white py-4 !text-bone">See your badges</Btn>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[[Mountains, "Western Ghats", true], [Drop, "River Crossing", true], [Tent, "First Night Out", false]].map(([I, t, got]) => (
              <Reveal key={t} className={`flex aspect-square flex-col items-center justify-center rounded-[28px] text-center ${got ? "bg-red" : "bg-white/5"}`}>
                <I size={40} weight={got ? "fill" : "regular"} className={got ? "text-white" : "text-white/30"} />
                <p className={`mt-3 text-sm font-medium ${got ? "" : "text-white/40"}`}>{t}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
