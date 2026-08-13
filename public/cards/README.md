# Card artwork

Drop the six vertical card faces here, using **exactly** these filenames:

| File | Design | Description |
|---|---|---|
| `brunch.jpg` | Brunch | Yellow, coffee cup and croissant |
| `asterisk.jpg` | Asterisk | Lilac with the orange asterisk |
| `bolt.jpg` | Bolt | Blue with cyan lightning |
| `aurora.jpg` | Aurora | Dark navy into blue/purple gradient |
| `blush.jpg` | Blush | Pink into purple waves |
| `sprout.jpg` | Sprout | Lime green with yellow leaves |

`.png` or `.webp` are fine too — just update the `image` path for that design
in `src/components/visuals/designs.tsx` to match.

## Requirements

- **Portrait, 1290 × 2048** (or any 1290:2048 multiple). The card renders at
  `aspect-ratio: 1290 / 2048`, so a different ratio will be cropped by
  `object-fit: cover`.
- The artwork is the complete card face. Chip, contactless mark, Spark lockup
  and the Mastercard discs are all part of the image — nothing is drawn over
  it except the holder's name, which sits bottom-left.
- Keep the bottom-left corner reasonably clear so that name stays readable.

## Missing files are safe

Each design carries a `fallback` gradient tuned to its artwork. If a file isn't
here, the gradient renders instead and the picker keeps working — you'll just
see flat colour rather than the illustration.

## The back of each card

Backs are **generated in code**, not supplied as images — see the `back`,
`ink`, `inkSoft` and `bolt` fields in `designs.tsx`. They're coloured to match
each front. Adjust those values if a back doesn't sit right against its face.
