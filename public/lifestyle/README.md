# Lifestyle ring images

The five circular nodes on the lifestyle ring
(`src/components/sections/LifestyleOrbit.tsx`). Drop the images here using
**exactly** these filenames:

| File | Label | Image |
|---|---|---|
| `netflix.jpg` | Streaming | Netflix logo |
| `amazon.jpg` | Shopping | Amazon logo |
| `gre.jpg` | Study abroad | GRE logo |
| `openai.jpg` | AI tools | ChatGPT / OpenAI mark |
| `lounge.jpg` | Lounge | Balaka Executive Lounge photo |

## Requirements

- **Square**, ideally 400 × 400 or larger. They render inside a circular mask
  with `object-fit: cover`, so anything non-square gets centre-cropped.
- Keep the subject centred — the outer edge is clipped by the circle.
- Logos on a solid background read far better at this size than transparent
  PNGs, which will show the page colour through and lose contrast.

## Missing files are safe

Each node falls back to its brand-tinted initials (`N`, `a`, `GRE`, `AI`,
`BEL`), so the ring renders and animates correctly with no images present.

## Before this goes public

Netflix, Amazon, GRE, ETS and OpenAI are third-party trademarks. Showing them
as "places your card works" is a common marketing pattern, but it implies a
partnership — **get written permission, or swap them for generic category
icons** (a play button, a shopping bag, a graduation cap, and so on). The
Balaka Executive Lounge image needs the same clearance unless Dhaka Bank owns
the photograph.
