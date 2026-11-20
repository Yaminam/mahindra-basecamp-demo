import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "motion/react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Nav, Footer, CartDrawer, VehiclePicker } from "./components/shell";
import { Curtain } from "./components/fx";
import { Preloader, DemoBadge } from "./components/premium";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import { Worlds, World } from "./pages/Worlds";
import Drops from "./pages/Drops";
import Trails from "./pages/Trails";
import Pass from "./pages/Pass";
import Checkout from "./pages/Checkout";
import Order from "./pages/Order";
import Build from "./pages/Build";
import Merch from "./pages/Merch";

gsap.registerPlugin(ScrollTrigger);
let lenis = null;

function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t) => { lenis.raf(t * 1000); };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(raf); lenis.destroy(); lenis = null; };
  }, []);
}

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    const t = setTimeout(() => { ScrollTrigger.refresh(); }, 400);
    return () => { clearTimeout(t); };
  }, [pathname]);
  return null;
}

export default function App() {
  useSmoothScroll();
  const { pathname } = useLocation();
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-[100dvh]">
        <Preloader />
        <Nav />
        <ScrollTop />
        <Curtain id={pathname} />
        <DemoBadge />
        <main className={pathname === "/" ? "" : "pt-[72px]"}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/build" element={<Build />} />
            <Route path="/merch" element={<Merch />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/p/:id" element={<Product />} />
            <Route path="/worlds" element={<Worlds />} />
            <Route path="/worlds/:id" element={<World />} />
            <Route path="/drops" element={<Drops />} />
            <Route path="/trails" element={<Trails />} />
            <Route path="/pass" element={<Pass />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order" element={<Order />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
        <VehiclePicker />
      </div>
    </MotionConfig>
  );
}
