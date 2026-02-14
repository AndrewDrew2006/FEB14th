# Visual Direction & Ambient Design
## Pixelated, High-Quality, Well-Animated Game Aesthetic

**Reference vibe:** Cozy pixel-art games (Stardew Valley, Coffee Talk, A Short Hike) meets detective noir (but warm, not bleak). High polish. Intentional animation. Atmospheric.

---

## PIXEL ART STYLE

### Resolution & Scale
- **Base canvas:** 320×568 (iPhone SE portrait) or 390×844 (iPhone 14) — design for mobile first.
- **Pixel scale:** 2× or 4× for crisp display on retina. No blurry upscale.
- **Pixel size:** 2px or 4px base unit. Consistent grid. No mixed pixel densities.
- **Style:** "Hi-bit" or "modern pixel" — detailed enough to read expressions and mood, not 8-bit chunky.

### Character / Scene Detail
- **Characters (if shown):** Simple silhouettes or back-view only. Focus on environment, not faces.
- **Environments:** Layered parallax where possible (foreground, midground, background).
- **Objects:** Clarity over minimalism. Books, mugs, notes should be readable at a glance.

### Consistency Rules
- Same lighting logic in every scene (soft, diffused).
- Same snow particle system throughout.
- Same font family for all UI (pixel font + one clean sans for accessibility if needed).

---

## COLOR PALETTE

### Winter Clarkson — Primary
| Use          | Hex       | Description                    |
|--------------|-----------|--------------------------------|
| Snow white   | `#F5F5F0` | Slightly warm, not pure white  |
| Sky gray     | `#8B9AAA` | Soft overcast winter sky       |
| Night blue   | `#4A5568` | Deeper shadows, evening        |
| Window glow  | `#FFE4B5` | Amber from indoor lights       |
| Paper        | `#F0E6D3` | Manila folder, aged paper      |

### Accents
| Use          | Hex       | Description                    |
|--------------|-----------|--------------------------------|
| Valentine    | `#C45C6A` | Soft rose/coral — sparingly    |
| Golden Knight| `#C9A227` | Mascot gold, highlights        |
| Envelope seal| `#8B4513` | Dark brown, wax stamp feel     |
| Text dark    | `#2D3748` | Readable, not harsh black      |

### Scene-Specific Shifts
- **Library:** Warmer. More `#E8DCC8`, `#C4B59A`.
- **Arena:** Cooler. More `#6B7B8C`, ice blue `#A8C5D4`.
- **Café:** Cozy. `#D4A574`, `#8B7355`, cream.
- **River:** Desaturated. `#7A8A9A`, `#5A6A7A`, misty.

---

## ANIMATION SPECIFICATIONS

### Snow Particles
- **Count:** 15–25 on screen at once.
- **Size:** 2×2 or 3×3 px. Slight variation.
- **Speed:** Very slow fall. 0.3–0.8 px/frame.
- **Opacity:** 60–90%. Subtle.
- **Wobble:** Slight horizontal drift (sine wave, low amplitude).
- **Layers:** Some in front of scene, some behind. Depth.

### Transitions
- **Scene change:** 0.6–1.0s crossfade. Optional: soft wipe (left-to-right like turning a page).
- **Text appear:** Fade in 0.2s. Optional: letter-by-letter for case file (slower).
- **Object highlight:** Gentle pulse — scale 1.0 → 1.05 → 1.0 over 1.5s, looped.
- **Tap feedback:** Brief scale down (0.95) on tap, spring back. 0.1s.

### Micro-Animations
- **Note/envelope:** Slight sway when "found" (2° rotation, 0.5s ease).
- **Steam (café):** 2–3 pixel wisps, slow rise, fade out at top.
- **Footprints:** Fade in one by one, left then right. 0.3s each.
- **QR code reveal:** Scale from 0 to 1, 0.5s ease-out. Optional soft glow expand.

### "Breathing" Effect
- **Background:** Very subtle brightness pulse. 100% → 102% → 100% over 4s. Slow, calming.
- **Use:** Title screen, pause moments, emotional beats.

---

## TYPOGRAPHY

### Pixel Font (Headings, Case File Headers)
- **Style:** Chunky pixel, readable. Not retro-8bit illegible.
- **Examples:** "Press Start 2P" (small sizes), "Silkscreen", "VT323", or custom pixel.
- **Size:** 14–18px base. Scale for headers.

### Body Text (Clues, Notes, Dialogue)
- **Option A:** Same pixel font, larger size — full consistency.
- **Option B:** Clean sans (e.g., Nunito, Quicksand) — better readability on mobile.
- **Size:** 16–18px. Line height 1.5. Max width ~280px for comfortable reading.

### Case File Styling
- **Headers:** ALL CAPS, tracked out. `CASE FILE #0214`
- **Labels:** Italic or lighter weight. `[LOCATION LOG — ENTRY 1]`
- **Clue verses:** Slight indent. Italic or different color.
- **Case notes:** Lighter, playful. Maybe a different color (gray or accent).

---

## SOUND DESIGN

### Ambient Loops (Low Volume, Layered)
- **Wind:** Constant, very soft. Vary by scene (stronger outdoors).
- **Indoor:** Hum, distant chatter, pages. Muted.
- **Café:** Steam, mug clink, muffled voices. Cozy.
- **River:** Water flow, occasional breeze.

### One-Shot SFX
- **Tap/advance:** Soft paper rustle or gentle "pop." Not harsh.
- **Clue found:** Single piano note (C5 or E5) or chime. Pleasant.
- **Scene transition:** Page turn, or soft "swoosh."
- **Case closed:** Stamp sound. Satisfying.
- **QR reveal:** Gentle "sparkle" or chime. Reward feeling.

### Music
- **Overall:** Sparse. Piano or acoustic. Slow tempo (60–80 BPM).
- **Mood:** Nostalgic, hopeful, tender. Not sad.
- **Loudness:** Background. Never overpowering dialogue.
- **Peak:** Scene 6 (river) — subtle swell. Scene 7 — sustained chord, resolve.

---

## UI / HUD ELEMENTS

### Case File Interface
- **Frame:** Pixel border, manila color. Slight shadow.
- **Stamps:** `CONFIDENTIAL`, `APPROVED`, `CASE CLOSED` — pixel-art stamps.
- **Paper texture:** Subtle noise or scan-line overlay. 5–10% opacity.

### Tap Prompts
- **"[ TAP TO CONTINUE ]"** — centered bottom. Subtle bounce (translate Y, 2px, 0.8s loop).
- **Fade in** after text settles. Don't show until content has been read (optional delay).

### Progress (Optional)
- **Dots or icons:** 7 dots for 7 scenes. Current = filled. Past = dim. Future = outline.
- **Position:** Top or bottom. Minimal. Doesn't distract.

---

## PERFORMANCE NOTES (Mobile)

- **Particles:** Cap at 25. Reduce on low-end devices.
- **Animations:** Use CSS transforms/opacity. GPU-accelerated.
- **Images:** Sprites or small PNGs. Consider sprite sheets.
- **Audio:** Preload. Keep files small (MP3/OGG). No long loops.

---

## REFERENCE MOOD BOARD (Descriptive)

- **Stardew Valley:** Cozy pixel, warm lighting, seasonal feel.
- **Coffee Talk:** Interior warmth, steam, intimate spaces.
- **A Short Hike:** Outdoor calm, nature, gentle exploration.
- **Return of the Obra Dinn:** Case file, document, mystery tone (but ours is warm).
- **Firewatch:** Color palette, outdoor atmosphere, solitude-with-care.

---

## SCENE-SPECIFIC VISUAL NOTES

| Scene    | Key visuals                                      | Animation focus              |
|----------|--------------------------------------------------|------------------------------|
| Title    | Snow, breathing pulse, clean layout              | Letter-by-letter, snow       |
| Case file| Paper texture, stamps, typed feel                | Folder open/close            |
| Quad     | Footprints, bench, note, bare trees              | Snow fall, footprints        |
| Library  | Bookshelves, lamp, windows, bookmark             | Steam from tea, dust motes   |
| Arena    | Ice, seats, silhouette of Knight                 | Echo, reverb feel            |
| Café     | Mugs, steam, warm light                          | Steam rise, cozy glow        |
| River    | Water, bench, envelope, stillness                | Slow snow, water shimmer     |
| Reveal   | QR code, frame, minimal                          | QR scale-in, subtle glow     |
