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
import LifestyleOrbit from "@/components/sections/LifestyleOrbit";
import Lifestyle from "@/components/sections/Lifestyle";
import HowTo from "@/components/sections/HowTo";
import Everywhere from "@/components/sections/Everywhere";
import KeepGoing from "@/components/sections/KeepGoing";
import Trust from "@/components/sections/Trust";
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
        {/* Follow ur Spark */}
        <Hero />
        {/* 01 — why you'd want another card at all */}
        <Intro />
        {/* 02 — the card itself: pick a design, throw it around */}
        <CardStudio />
        {/* the lifestyle ring, straight off the back of the floating card */}
        <LifestyleOrbit />
        {/* 03 — travel / everyday / plans. Deliberately after the card, so the
            product is on screen before the reasons to carry it. */}
        <Lifestyle />
        {/* 04 — apply from home */}
        <HowTo />
        {/* 05 — activate, set PIN, reload */}
        <Everywhere />
        {/* 06 — reasons to keep using it */}
        <KeepGoing />
        {/* 07 — who issues it */}
        <Trust />
        {/* Follow ur Spark → */}
        <FinalCta />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
