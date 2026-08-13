"use client";

/* =============================================================================
   Spark card designs.

   The front of each card is supplied artwork — a full vertical face with the
   chip, contactless mark, Spark lockup and Mastercard already drawn in. Drop
   the files into `public/cards/` using the `image` filenames below.

   Until a file exists the `fallback` gradient renders in its place, so the
   picker is never broken while art is still being produced.

   The back of each card is generated here to match its front.
   ============================================================================= */

export type Design = {
  id: string;
  name: string;
  tag: string;
  /** Artwork path under /public. */
  image: string;
  /** CSS background shown until the artwork loads (or if it's missing). */
  fallback: string;
  /** Back-of-card field, tuned to the front. */
  back: string;
  /** Ink used on the back. */
  ink: string;
  inkSoft: string;
  /** Colour of the Spark bolt on the back. */
  bolt: string;
  /** Two colours representing the card in compact UI. */
  swatch: [string, string];
};

export const DESIGNS: Design[] = [
  {
    id: "brunch",
    name: "Brunch",
    tag: "Runs on caffeine",
    image: "/cards/brunch.jpg",
    fallback: "linear-gradient(160deg,#FFD400 0%,#FFC400 55%,#F5A300 100%)",
    back: "linear-gradient(160deg,#FFD400 0%,#F26DA8 78%,#E0357F 100%)",
    ink: "#2B1206",
    inkSoft: "rgba(43,18,6,0.62)",
    bolt: "#2B1206",
    swatch: ["#FFD400", "#EE3D8F"],
  },
  {
    id: "asterisk",
    name: "Asterisk",
    tag: "Impossible to ignore",
    image: "/cards/asterisk.jpg",
    fallback: "linear-gradient(160deg,#A99BF5 0%,#9B8BF0 50%,#F4551A 100%)",
    back: "linear-gradient(160deg,#A99BF5 0%,#8C7BEC 60%,#F4551A 100%)",
    ink: "#ffffff",
    inkSoft: "rgba(255,255,255,0.72)",
    bolt: "#ffffff",
    swatch: ["#A99BF5", "#F4551A"],
  },
  {
    id: "bolt",
    name: "Bolt",
    tag: "The original",
    image: "/cards/bolt.jpg",
    fallback: "linear-gradient(160deg,#3B2BF0 0%,#3326E0 55%,#22D6B4 100%)",
    back: "linear-gradient(160deg,#3B2BF0 0%,#2A1FD4 60%,#22D6B4 100%)",
    ink: "#ffffff",
    inkSoft: "rgba(255,255,255,0.7)",
    bolt: "#2EE7C4",
    swatch: ["#3B2BF0", "#2EE7C4"],
  },
  {
    id: "aurora",
    name: "Aurora",
    tag: "Quietly expensive",
    image: "/cards/aurora.jpg",
    fallback: "linear-gradient(165deg,#0A0A2E 0%,#3E6BFF 45%,#A855F7 100%)",
    back: "linear-gradient(165deg,#0A0A2E 0%,#2A2E7A 55%,#8B4FE0 100%)",
    ink: "#ffffff",
    inkSoft: "rgba(255,255,255,0.62)",
    bolt: "#61B6FF",
    swatch: ["#0A0A2E", "#A855F7"],
  },
  {
    id: "blush",
    name: "Blush",
    tag: "Soft launch",
    image: "/cards/blush.jpg",
    fallback: "linear-gradient(160deg,#F472A8 0%,#8B5CF6 55%,#6D4DE8 100%)",
    back: "linear-gradient(160deg,#F472A8 0%,#8B5CF6 55%,#5B3FE0 100%)",
    ink: "#ffffff",
    inkSoft: "rgba(255,255,255,0.72)",
    bolt: "#ffffff",
    swatch: ["#F472A8", "#7C5CF5"],
  },
  {
    id: "sprout",
    name: "Sprout",
    tag: "Fresh money",
    image: "/cards/sprout.jpg",
    fallback: "linear-gradient(160deg,#B6F24A 0%,#7EE87F 55%,#3FD9A4 100%)",
    back: "linear-gradient(160deg,#DCF94A 0%,#7EE87F 55%,#31C79B 100%)",
    ink: "#0C3A1E",
    inkSoft: "rgba(12,58,30,0.6)",
    bolt: "#0C3A1E",
    swatch: ["#B6F24A", "#3FD9A4"],
  },
];

export const DEFAULT_DESIGN = 2;
