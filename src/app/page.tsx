import SmoothScroll from "@/components/core/SmoothScroll";
import Atmosphere from "@/components/core/Atmosphere";
import Preloader from "@/components/core/Preloader";
import Cursor from "@/components/core/Cursor";
import ScrollProgress from "@/components/core/ScrollProgress";
import Nav from "@/components/core/Nav";
import Footer from "@/components/core/Footer";

import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import CardStudio from "@/components/sections/CardStudio";
import Trust from "@/components/sections/Trust";
import Perks from "@/components/sections/Perks";
import HowTo from "@/components/sections/HowTo";
import Everywhere from "@/components/sections/Everywhere";
import FinalCta from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <SmoothScroll>
      {/* The page's only background — one colour field that shifts across the
          whole scroll, so no section boundary is ever visible. */}
      <Atmosphere />

      <Preloader />
      <Cursor />
      <ScrollProgress />
      <Nav />

      <main className="relative">
        {/* the campaign moment */}
        <Hero />
        {/* 01 — what the card actually is, in three beats */}
        <Intro />
        {/* 02 — the card itself: pick a design, throw it around */}
        <CardStudio />
        {/* 03 — why you'd carry it */}
        <Perks />
        {/* 04 — how to get one */}
        <HowTo />
        {/* 05 — where it works */}
        <Everywhere />
        {/* 06 — who issues it. Late on purpose: the card sells first, the
            bank reassures afterwards. */}
        <Trust />
        {/* go */}
        <FinalCta />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
