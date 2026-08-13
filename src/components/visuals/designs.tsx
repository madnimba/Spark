"use client";

/* =============================================================================
   Spark card designs. Each entry is a complete skin — face art, ink colours
   and the swatch shown in the picker — so adding a seventh design means adding
   one object here and nothing else.
   ============================================================================= */

export type Design = {
  id: string;
  name: string;
  tag: string;
  /** Two colours for the picker swatch. */
  swatch: [string, string];
  /** CSS background for the card face. */
  bg: string;
  /** Art layered over the background. */
  art: React.ReactNode;
  ink: string;
  inkSoft: string;
  /** Colour of the small Spark bolt on the face. */
  bolt: string;
  chip: "gold" | "steel";
};

const Bolt = ({ className, fill, opacity = 1 }: { className?: string; fill: string; opacity?: number }) => (
  <svg viewBox="0 0 40 64" className={className} aria-hidden style={{ opacity }}>
    <path d="M24 0 2 36h13L14 64 38 26H24l6-26Z" fill={fill} />
  </svg>
);

const Burst = ({ className, fill, opacity = 1 }: { className?: string; fill: string; opacity?: number }) => {
  const pts: string[] = [];
  for (let i = 0; i < 24; i++) {
    const rad = i % 2 === 0 ? 100 : 58;
    const deg = (i / 24) * 360 - 90;
    const x = 100 + Math.cos((deg * Math.PI) / 180) * rad;
    const y = 100 + Math.sin((deg * Math.PI) / 180) * rad;
    pts.push(`${Math.round(x * 100) / 100},${Math.round(y * 100) / 100}`);
  }
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden style={{ opacity }}>
      <polygon points={pts.join(" ")} fill={fill} />
    </svg>
  );
};

const Dots = ({ color, opacity = 0.5 }: { color: string; opacity?: number }) => (
  <div
    className="absolute inset-0"
    style={{
      opacity,
      backgroundImage: `radial-gradient(${color} 1.4px, transparent 1.5px)`,
      backgroundSize: "9px 9px",
    }}
  />
);

export const DESIGNS: Design[] = [
  {
    id: "voltage",
    name: "Voltage",
    tag: "The original",
    swatch: ["#1f6fea", "#ffe01b"],
    bg: "linear-gradient(135deg,#2b7cff 0%,#1450c8 55%,#0c3aa0 100%)",
    ink: "#ffffff",
    inkSoft: "rgba(255,255,255,0.72)",
    bolt: "#ffe01b",
    chip: "gold",
    art: (
      <>
        <Bolt className="absolute -right-[6%] top-[-14%] h-[125%] w-auto" fill="#ffe01b" opacity={0.22} />
        <div className="absolute inset-0 [background:repeating-linear-gradient(115deg,rgba(70,224,255,0.16)_0_2px,transparent_2px_16px)]" />
      </>
    ),
  },
  {
    id: "bubblegum",
    name: "Bubblegum",
    tag: "Loud on purpose",
    swatch: ["#ee1b7c", "#ffe01b"],
    bg: "linear-gradient(145deg,#ff3d96 0%,#ee1b7c 48%,#a80f57 100%)",
    ink: "#ffffff",
    inkSoft: "rgba(255,255,255,0.75)",
    bolt: "#ffe01b",
    chip: "gold",
    art: (
      <>
        <Dots color="rgba(255,255,255,0.55)" opacity={0.35} />
        <Burst className="absolute -left-[18%] -top-[42%] h-[190%] w-auto" fill="#ffe01b" opacity={0.16} />
      </>
    ),
  },
  {
    id: "sunburst",
    name: "Sunburst",
    tag: "Impossible to lose",
    swatch: ["#ffe01b", "#1f6fea"],
    bg: "linear-gradient(135deg,#fff06b 0%,#ffe01b 45%,#f5b800 100%)",
    ink: "#041f5c",
    inkSoft: "rgba(4,31,92,0.66)",
    bolt: "#1f6fea",
    chip: "steel",
    art: (
      <>
        <Burst className="absolute -right-[24%] -top-[52%] h-[210%] w-auto" fill="#1f6fea" opacity={0.14} />
        <Dots color="rgba(4,31,92,0.45)" opacity={0.22} />
      </>
    ),
  },
  {
    id: "midnight",
    name: "Midnight",
    tag: "Quietly expensive",
    swatch: ["#041f5c", "#46e0ff"],
    bg: "linear-gradient(150deg,#0b2a6e 0%,#041f5c 55%,#020f33 100%)",
    ink: "#ffffff",
    inkSoft: "rgba(255,255,255,0.62)",
    bolt: "#46e0ff",
    chip: "steel",
    art: (
      <>
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(70,224,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(70,224,255,0.14)_1px,transparent_1px)] [background-size:26px_26px]" />
        <div className="absolute inset-0 [background:radial-gradient(circle_at_78%_18%,rgba(70,224,255,0.4),transparent_46%)]" />
      </>
    ),
  },
  {
    id: "comic",
    name: "Comic",
    tag: "Pow.",
    swatch: ["#ffffff", "#ee1b7c"],
    bg: "linear-gradient(135deg,#ffffff 0%,#eef4ff 60%,#dbe7ff 100%)",
    ink: "#041f5c",
    inkSoft: "rgba(4,31,92,0.6)",
    bolt: "#ee1b7c",
    chip: "gold",
    art: (
      <>
        <Dots color="rgba(238,27,124,0.6)" opacity={0.3} />
        <Burst className="absolute -left-[14%] -bottom-[62%] h-[190%] w-auto" fill="#ffe01b" opacity={0.55} />
        <div className="absolute inset-0 border-[3px] border-[#041f5c]/85" style={{ borderRadius: "inherit" }} />
      </>
    ),
  },
  {
    id: "heatwave",
    name: "Heatwave",
    tag: "Runs hot",
    swatch: ["#ff7a1a", "#ee1b7c"],
    bg: "linear-gradient(140deg,#ffb020 0%,#ff7a1a 42%,#ee1b7c 100%)",
    ink: "#ffffff",
    inkSoft: "rgba(255,255,255,0.75)",
    bolt: "#ffffff",
    chip: "gold",
    art: (
      <>
        <div className="absolute inset-0 [background:repeating-linear-gradient(-28deg,rgba(255,255,255,0.14)_0_10px,transparent_10px_30px)]" />
        <Bolt className="absolute -left-[4%] top-[8%] h-[95%] w-auto" fill="#ffffff" opacity={0.18} />
      </>
    ),
  },
];

export const DEFAULT_DESIGN = 0;
