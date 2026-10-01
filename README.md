# BRONX LUGGAGE — Modernist Aerospace Travel Platform

An animated, modernist e-commerce and interactive engineering showcase for **Bronx Luggage**, built with **GSAP 3**, **ScrollTrigger**, **HTML5/CSS3**, and **Vite**.

---

## 🌟 Key Highlights & Features

### 1. 🧳 Patented Clamshell Bag Opening & Unpacking Animation
- **Scroll-Triggered Sequence**: As you scroll through the *Bag Anatomy* section, the suitcase automatically hinges open 180°, disengages dual TSA biometric locks with visual state changes, and unpacks internal modules into 3D space.
- **Interactive Mechanical Simulator**:
  - **`OPEN LUGGAGE / SEAL & LOCK CHASSIS`** toggle with realistic mechanical timing.
  - **`X-RAY EXPLODED VIEW`** expanding the dual shells and floating compartments.
  - **`TEST HAPTIC LATCH CLICK`** triggering synthesized mechanical audio feedback.
- **5 Modular Floating Compartments**:
  1. *16" Aerogel Shockproof Tech Sleeve*
  2. *Fidlock® Magnetic Compression Pad*
  3. *Watertight TPU Toiletry Capsule*
  4. *Silver-Ion Expandable Laundry Pouch*
  5. *Embedded AirTag / GPS Tracker Vault*

---

### 2. ☀️ / 🌙 Day & Night Color Theme System
- **Night Mode (Default)**: Ultra-luxury deep space obsidian (`#07080c`, `#131622`), brushed gunmetal accents, subtle electric cyan HUD glow (`#00f2fe`), and amber indicators.
- **Day Mode**: Architectural gallery alabaster (`#f5f6f9`, `#ffffff`), deep graphite typography, warm champagne bronze accents, and crisp tactile borders.
- **Instant Persistence**: Smooth GSAP button flip transition, saves preference to `localStorage`.

---

### 3. 🛡️ The Online Shopper's Sanctuary (All Luggage Issues Solved)
Interactive tools specifically engineered to solve the biggest online luggage buying frustrations:
1. **Airline Size Compliance Checker**:
   - Live dropdown covering 40+ international airlines (*Delta, United, American, Ryanair, EasyJet, British Airways, Lufthansa, Emirates, Singapore Airlines, Southwest, Air France, Qatar*).
   - Real-time comparison against the exact Bronx X1 dimensions with animated progress bars and compliance guarantee.
2. **Durability Lab & Honest Comparison Matrix**:
   - Head-to-head comparison table: *Bronx Luggage vs. $160 High-Street Brands vs. $1,450 Luxury Brands*.
   - Explains the zipper-free aluminum interlocking channel, Japanese Hinomoto Lisof® silent casters, and unconditional lifetime warranty.
3. **Smart Packing Weight Estimator**:
   - Select trip duration (*Weekend 2-3 days, Business 5-7 days, Expedition 10-14 days*).
   - Toggle gear options (*Laptops, boots, winter coats, drones, toiletries*).
   - Real-time digital scale readout with instant alerts for airline 7kg and 10kg carry-on thresholds.
4. **100-Day In-Flight Trial & Free Global Returns**:
   - Take it on real flights, roll it over cobblestones. 100% full refund guarantee with prepaid worldwide return labels.

---

### 4. 🚀 Super Modernist Hero Section
- Dual-tone kinetic typography with GSAP staggered reveals.
- Real-time flight telemetry HUD (*3.4 kg Ultra-Light, 100% Bin Fit, ∞ Lifetime Warranty*).
- Interactive 3D perspective luggage stage responding to mouse movement with smooth damping.
- 4 interactive pulsing radar hotspots detailing the handle, corner armor, TSA locks, and Hinomoto casters.

---

### 5. 🎒 Featured Products Fleet
- Filterable product grid (*All, Carry-On Series, Check-In Heavy, Modular Packs*).
- **Interactive Color Swatches**: Real-time SVG shell tinting (*Midnight Obsidian, Aerospace Titanium, Mojave Dune, Deep Cobalt*).
- **Quick View Modal**: 360 detailed inspection and direct add-to-cart.
- **Add to Bag**: Flying interaction into the Cart Drawer.

---

### 6. 🛒 Slide-Out Shopping Bag Drawer & Luggage Quiz
- **Dynamic Cart**: Quantity updates, removal, subtotal, and total calculation.
- **Free Worldwide Shipping Progress Bar** ($200 threshold).
- **Promo Code Engine**: Codes like `BRONX20`, `TRAVEL20`, and `BRONXVIP` apply an instant 20% discount with celebratory confetti!
- **30-Second Interactive Quiz**: Step-by-step traveler questionnaire that recommends the perfect luggage.

---

### 7. 🔊 Web Audio API Synthesizer
- Built with standard browser `AudioContext` — zero external MP3/WAV files required.
- Synthesizes crisp metallic latch clicks, lock snaps, and interface chimes.
- Built-in mute toggle with preference saved in `localStorage`.

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation & Development
```bash
# Install dependencies
npm install

# Run the local development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open **`http://localhost:5173/`** in your browser.
