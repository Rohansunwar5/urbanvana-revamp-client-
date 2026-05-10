export type Category = "Towers" | "Bundles" | "Nutrients" | "Accessories"

export type ProductSpec = { label: string; value: string }

export type Product = {
  id: string
  slug: string
  supplyLabel: string
  categoryLine1: string
  categoryLine2: string
  category: Category
  name: string
  description: string
  longDescription: string
  features: string[]
  specs: ProductSpec[]
  price: number
  originalPrice?: number
  image: string
  images: string[]
  imageAlt: string
  badge?: "Bestseller" | "New" | "Low Stock" | "Sale"
  rating: number
  reviewCount: number
}

export const PRODUCTS: Product[] = [
  // ── Towers ──────────────────────────────────────────────────────────────
  {
    id: "tower-pro-30",
    slug: "aeroponic-tower-pro-30",
    supplyLabel: "30-PORT TOWER",
    categoryLine1: "FLAGSHIP",
    categoryLine2: "AEROPONIC",
    category: "Towers",
    name: "TOWER PRO 30",
    description: "Grow 30 plants at once — herbs, greens & vegetables. The complete indoor farm.",
    longDescription:
      "The Tower Pro 30 is our flagship aeroponic growing system, designed to replace your weekly grocery run with a continuous harvest of fresh herbs, salad greens, and vegetables. Using fine-mist aeroponics, roots receive up to 98% more oxygen than soil — resulting in growth rates 3× faster than conventional gardening. The unit stands 120 cm tall and fits comfortably in any kitchen corner, living room, or balcony. All components are BPA-free, food-safe, and easy to disassemble for cleaning. The smart pump timer handles watering automatically.",
    features: [
      "30 growing ports — herbs, greens, vegetables and more",
      "Aeroponic mist delivery — 90% less water than soil",
      "Grows 3× faster than conventional soil gardening",
      "Zero chemicals — clean, food-safe BPA-free materials",
      "Built-in smart pump timer, no manual watering needed",
      "Fits on any counter or floor — only 35 cm footprint",
    ],
    specs: [
      { label: "Growing Ports",    value: "30" },
      { label: "Tower Height",     value: "120 cm" },
      { label: "Footprint",        value: "35 × 35 cm" },
      { label: "Water Reservoir",  value: "8 litres" },
      { label: "Pump Timer",       value: "Smart auto-cycle" },
      { label: "Power",            value: "12W, 220V adapter" },
      { label: "Material",         value: "Food-safe PVC, BPA-free" },
      { label: "Weight",           value: "3.2 kg (empty)" },
    ],
    price: 7999,
    originalPrice: 10999,
    image: "/mock1.webp",
    images: ["/mock1.webp", "/mock2.webp", "/mock3.webp", "/mock4.webp"],
    imageAlt: "Urbanvana Aeroponic Tower Pro 30",
    badge: "Bestseller",
    rating: 4.9,
    reviewCount: 847,
  },
  {
    id: "tower-lite-16",
    slug: "aeroponic-tower-lite-16",
    supplyLabel: "16-PORT TOWER",
    categoryLine1: "COMPACT",
    categoryLine2: "AEROPONIC",
    category: "Towers",
    name: "TOWER LITE 16",
    description: "Counter-top sized. Grow 16 plants in under 30 cm of space. Ideal for apartments.",
    longDescription:
      "The Tower Lite 16 packs all the aeroponic performance of our flagship tower into a compact, counter-top footprint — perfect for studio apartments, small kitchens, and beginner growers. At just 72 cm tall, it fits under most kitchen cabinets and holds 16 plants in individual growing ports. The whisper-quiet pump cycles automatically on a 15-minute timer, requiring zero daily attention. Start with the included basil and spinach seed pods and harvest your first leaves in as little as 18 days.",
    features: [
      "16 growing ports — ideal starter size",
      "Fits on any kitchen counter, under cabinets",
      "Whisper-quiet pump — under 30dB",
      "18-day first harvest for fast-growing herbs",
      "All-in-one kit: tower + pump + timer included",
      "Dishwasher-safe growing pods",
    ],
    specs: [
      { label: "Growing Ports",    value: "16" },
      { label: "Tower Height",     value: "72 cm" },
      { label: "Footprint",        value: "28 × 28 cm" },
      { label: "Water Reservoir",  value: "4.5 litres" },
      { label: "Pump Timer",       value: "15-min auto-cycle" },
      { label: "Power",            value: "8W, 220V adapter" },
      { label: "Material",         value: "Food-safe PVC, BPA-free" },
      { label: "Weight",           value: "1.8 kg (empty)" },
    ],
    price: 4999,
    originalPrice: 6499,
    image: "/mock2.webp",
    images: ["/mock2.webp", "/mock1.webp", "/mock3.webp", "/mock4.webp"],
    imageAlt: "Urbanvana Aeroponic Tower Lite 16",
    badge: "New",
    rating: 4.7,
    reviewCount: 312,
  },
  {
    id: "aeroponic-tower-max-50",
    slug: "aeroponic-tower-max-50",
    supplyLabel: "50-PORT TOWER",
    categoryLine1: "PRO",
    categoryLine2: "SERIES",
    category: "Towers",
    name: "TOWER MAX 50",
    description: "For serious home farmers. 50 ports, dual-pump system, smart humidity sensor.",
    longDescription:
      "The Tower Max 50 is built for growers who want to produce a serious volume of fresh food at home. With 50 growing ports, a dual-pump aeroponic delivery system, and a built-in humidity sensor, this is the most capable home growing tower we make. The digital display shows reservoir level, nutrient concentration, and pump cycle status. Comes with a premium LED grow light attachment (sold separately or as part of the Pro Bundle) to enable year-round growing in any light condition.",
    features: [
      "50 growing ports — maximum home-farm output",
      "Dual-pump aeroponic system for even mist coverage",
      "Built-in humidity and reservoir level sensor",
      "Digital status display (reservoir, nutrients, pump)",
      "LED grow light attachment compatible",
      "Year-round growing, any light condition",
    ],
    specs: [
      { label: "Growing Ports",    value: "50" },
      { label: "Tower Height",     value: "160 cm" },
      { label: "Footprint",        value: "40 × 40 cm" },
      { label: "Water Reservoir",  value: "14 litres" },
      { label: "Pump System",      value: "Dual-pump, smart cycle" },
      { label: "Sensor",           value: "Humidity + TDS monitor" },
      { label: "Power",            value: "22W, 220V adapter" },
      { label: "Weight",           value: "5.4 kg (empty)" },
    ],
    price: 12499,
    originalPrice: 15999,
    image: "/mock3.webp",
    images: ["/mock3.webp", "/mock1.webp", "/mock4.webp", "/mock2.webp"],
    imageAlt: "Urbanvana Aeroponic Tower Max 50",
    badge: "Sale",
    rating: 4.8,
    reviewCount: 194,
  },
  // ── Bundles ─────────────────────────────────────────────────────────────
  {
    id: "starter-bundle",
    slug: "starter-bundle",
    supplyLabel: "STARTER KIT",
    categoryLine1: "TOWER +",
    categoryLine2: "SEEDS + NUTRIENTS",
    category: "Bundles",
    name: "STARTER BUNDLE",
    description: "Everything to start growing on day one. Tower Lite 16 + 6 seed varieties + 1-month nutrients.",
    longDescription:
      "The Starter Bundle removes every excuse not to start growing. It pairs our Tower Lite 16 with 6 pre-selected seed pod varieties (basil, mint, spinach, coriander, fenugreek, lettuce) and a 1-month supply of our Complete Grow Pack nutrients. Unbox, fill the reservoir, drop in the pods, and plug in. Your first leaves will be ready to harvest in under 3 weeks. No separate purchases, no guessing which nutrients to buy — just grow.",
    features: [
      "Tower Lite 16 aeroponic tower included",
      "6 seed pod varieties — herbs + salad greens",
      "1-month Complete Grow Pack nutrients",
      "Setup in under 20 minutes, harvest in 18 days",
      "Full printed quick-start guide included",
      "Best value entry point to aeroponic growing",
    ],
    specs: [
      { label: "Includes",         value: "Tower Lite 16 + 6 seed pods + nutrients" },
      { label: "Seed Varieties",   value: "Basil, Mint, Spinach, Coriander, Fenugreek, Lettuce" },
      { label: "Nutrients Supply", value: "1 month (500 ml)" },
      { label: "First Harvest",    value: "18–25 days" },
      { label: "Tower Ports",      value: "16" },
      { label: "Box Weight",       value: "2.4 kg" },
    ],
    price: 5999,
    originalPrice: 7599,
    image: "/mock4.webp",
    images: ["/mock4.webp", "/mock2.webp", "/mock1.webp", "/mock3.webp"],
    imageAlt: "Urbanvana Starter Bundle",
    badge: "Bestseller",
    rating: 4.9,
    reviewCount: 1203,
  },
  {
    id: "family-bundle",
    slug: "family-bundle",
    supplyLabel: "FAMILY KIT",
    categoryLine1: "TOWER +",
    categoryLine2: "HERBS & GREENS",
    category: "Bundles",
    name: "FAMILY BUNDLE",
    description: "Tower Pro 30 + 12 seed varieties + 3-month nutrient supply. Feeds a family of four.",
    longDescription:
      "Designed for families who want to replace a significant portion of their grocery basket with homegrown produce, the Family Bundle combines the Tower Pro 30 with 12 seed varieties and a 3-month nutrient supply. From daily salad greens to fresh herbs for cooking, this setup keeps a family of four stocked with fresh produce year-round. The 12 seed varieties include both fast-growing greens (ready in 18–22 days) and longer-cycle plants like cherry tomatoes and peppers.",
    features: [
      "Tower Pro 30 — 30 growing ports",
      "12 seed varieties including greens, herbs, and fruiting plants",
      "3-month Complete Grow Pack nutrient supply",
      "Enough output to serve a family of four",
      "Includes growing schedule and harvest guide",
      "Save ₹3,500 vs. buying each item separately",
    ],
    specs: [
      { label: "Includes",         value: "Tower Pro 30 + 12 seed pods + 3-mo nutrients" },
      { label: "Seed Varieties",   value: "12 varieties (herbs, greens, fruiting)" },
      { label: "Nutrients Supply", value: "3 months (1.5 litres)" },
      { label: "Tower Ports",      value: "30" },
      { label: "First Harvest",    value: "18–30 days (variety dependent)" },
      { label: "Box Weight",       value: "5.1 kg" },
    ],
    price: 10499,
    originalPrice: 13999,
    image: "/mock1.webp",
    images: ["/mock1.webp", "/mock4.webp", "/mock3.webp", "/mock2.webp"],
    imageAlt: "Urbanvana Family Bundle",
    badge: "Sale",
    rating: 4.8,
    reviewCount: 568,
  },
  {
    id: "pro-grower-bundle",
    slug: "pro-grower-bundle",
    supplyLabel: "PRO KIT",
    categoryLine1: "DUAL TOWER",
    categoryLine2: "FULL SETUP",
    category: "Bundles",
    name: "PRO GROWER BUNDLE",
    description: "Two towers + full LED kit + 6-month nutrients. For serious home growers.",
    longDescription:
      "The Pro Grower Bundle is for those who want to go all-in on home aeroponics. Two Tower Pro 30 units give you 60 growing ports total — enough to keep a household fully stocked and have surplus to share. The bundle includes a full-spectrum LED grow light panel (45W), a 6-month nutrient supply, and an advanced seed collection of 20 varieties including microgreens, strawberries, and cherry tomatoes. Everything arrives pre-configured and calibrated.",
    features: [
      "Two Tower Pro 30 units — 60 ports total",
      "45W full-spectrum Smart LED Panel included",
      "6-month Complete Grow Pack nutrients",
      "20 seed varieties including microgreens + fruiting plants",
      "pH + TDS meter included for water monitoring",
      "Save ₹7,000 vs. buying each component separately",
    ],
    specs: [
      { label: "Includes",         value: "2× Tower Pro 30 + LED Panel + 6-mo nutrients + 20 seed pods + pH meter" },
      { label: "Total Ports",      value: "60" },
      { label: "LED Power",        value: "45W full spectrum" },
      { label: "Nutrients Supply", value: "6 months (3 litres)" },
      { label: "Seed Varieties",   value: "20 varieties" },
      { label: "Box Weight",       value: "9.8 kg" },
    ],
    price: 19999,
    originalPrice: 26999,
    image: "/mock2.webp",
    images: ["/mock2.webp", "/mock3.webp", "/mock1.webp", "/mock4.webp"],
    imageAlt: "Urbanvana Pro Grower Bundle",
    badge: "New",
    rating: 4.9,
    reviewCount: 89,
  },
  // ── Nutrients ────────────────────────────────────────────────────────────
  {
    id: "nutrient-pack-3mo",
    slug: "complete-grow-pack-3mo",
    supplyLabel: "3-MONTH SUPPLY",
    categoryLine1: "NUTRIENTS",
    categoryLine2: "FORMULA",
    category: "Nutrients",
    name: "COMPLETE GROW PACK",
    description: "pH-balanced, non-toxic nutrient formula. Everything your tower needs for 3 months.",
    longDescription:
      "The Complete Grow Pack is a two-part nutrient formula (Part A + Part B) that provides everything aeroponic plants need from seedling to harvest. The formula is pH-balanced at 5.8–6.2, free from heavy metals and synthetic hormones, and certified food-safe. A single 500 ml dosing cycle treats 8 litres of water — compatible with all Urbanvana tower models. Each pack contains 3 months of full-program nutrition at standard dosing.",
    features: [
      "Two-part formula (Part A + Part B) — complete nutrition",
      "pH pre-balanced at 5.8–6.2 for optimal uptake",
      "Free from heavy metals, hormones, and synthetic additives",
      "Certified food-safe — safe to use on edible plants",
      "Compatible with all Urbanvana tower models",
      "Includes dosing syringe for precise measurement",
    ],
    specs: [
      { label: "Format",           value: "2-part liquid concentrate" },
      { label: "Volume",           value: "500 ml Part A + 500 ml Part B" },
      { label: "Dosing Rate",      value: "5 ml/L each part" },
      { label: "Treats",           value: "100 litres of water" },
      { label: "Supply Duration",  value: "~3 months at standard use" },
      { label: "pH Range",         value: "5.8 – 6.2 (pre-balanced)" },
      { label: "Certification",    value: "Food-safe, heavy-metal-free" },
    ],
    price: 1299,
    originalPrice: 1599,
    image: "/mock3.webp",
    images: ["/mock3.webp", "/mock4.webp", "/mock1.webp", "/mock2.webp"],
    imageAlt: "Urbanvana Complete Grow Nutrient Pack",
    badge: "Bestseller",
    rating: 4.8,
    reviewCount: 732,
  },
  {
    id: "seedling-booster",
    slug: "seedling-booster",
    supplyLabel: "60-DAY SUPPLY",
    categoryLine1: "SEEDLING",
    categoryLine2: "BOOSTER",
    category: "Nutrients",
    name: "SEEDLING BOOSTER",
    description: "Accelerates germination and root development. Use in first 4 weeks of growth.",
    longDescription:
      "The Seedling Booster is a high-phosphorus germination accelerator designed to maximise root mass and early vegetative growth in the critical first 4 weeks. Combined with our Complete Grow Pack, it can reduce time-to-first-harvest by up to 30%. The concentrated formula uses only naturally derived amino acids and seaweed extract — no synthetic growth hormones. Suitable for all edible plants grown in aeroponic systems.",
    features: [
      "High-phosphorus formula — accelerates root mass",
      "Cuts time-to-harvest by up to 30% in trials",
      "100% naturally derived — amino acids + seaweed extract",
      "No synthetic hormones or growth regulators",
      "Use alongside Complete Grow Pack for full nutrition",
      "One bottle = 60-day supply for a single tower",
    ],
    specs: [
      { label: "Format",           value: "Single-part liquid concentrate" },
      { label: "Volume",           value: "250 ml" },
      { label: "Dosing Rate",      value: "2 ml/L" },
      { label: "Use Phase",        value: "Seedling (weeks 1–4)" },
      { label: "Supply Duration",  value: "~60 days at standard use" },
      { label: "Key Ingredients",  value: "Amino acids, seaweed extract" },
    ],
    price: 599,
    image: "/mock4.webp",
    images: ["/mock4.webp", "/mock3.webp", "/mock2.webp", "/mock1.webp"],
    imageAlt: "Urbanvana Seedling Booster Nutrient",
    badge: "New",
    rating: 4.6,
    reviewCount: 281,
  },
  {
    id: "bloom-formula",
    slug: "bloom-formula",
    supplyLabel: "2-MONTH SUPPLY",
    categoryLine1: "BLOOM",
    categoryLine2: "FORMULA",
    category: "Nutrients",
    name: "BLOOM FORMULA",
    description: "Triggers flowering for fruiting plants. Tomatoes, peppers, strawberries & more.",
    longDescription:
      "Bloom Formula is a bloom-switch nutrient designed for the flowering and fruiting stage of plant development. Switching from vegetative nutrients to Bloom Formula increases phosphorus and potassium levels, signaling plants to produce flowers and fruit. Ideal for cherry tomatoes, bell peppers, strawberries, and chillies grown in aeroponic towers. Begin dosing when the first flower buds appear — typically 4–6 weeks after seeding.",
    features: [
      "High P-K formula — signals flowering and fruiting",
      "For tomatoes, peppers, strawberries, chillies",
      "Swap from vegetative nutrients at first bud",
      "Improves fruit set, size, and flavour",
      "pH-balanced, food-safe concentrate",
      "One bottle = 2-month supply for a single tower",
    ],
    specs: [
      { label: "Format",           value: "Single-part liquid concentrate" },
      { label: "Volume",           value: "400 ml" },
      { label: "Dosing Rate",      value: "4 ml/L" },
      { label: "Use Phase",        value: "Flowering + Fruiting (week 4 onward)" },
      { label: "Supply Duration",  value: "~2 months at standard use" },
      { label: "Best For",         value: "Tomatoes, peppers, strawberries, chillies" },
    ],
    price: 849,
    originalPrice: 999,
    image: "/mock1.webp",
    images: ["/mock1.webp", "/mock3.webp", "/mock4.webp", "/mock2.webp"],
    imageAlt: "Urbanvana Bloom Formula Nutrient",
    rating: 4.7,
    reviewCount: 156,
  },
  // ── Accessories ──────────────────────────────────────────────────────────
  {
    id: "seed-pod-refills",
    slug: "seed-pod-refills",
    supplyLabel: "50-PACK PODS",
    categoryLine1: "SEED",
    categoryLine2: "PODS",
    category: "Accessories",
    name: "SEED POD REFILLS",
    description: "Biodegradable growing pods — compatible with all Urbanvana towers. 50-pod pack.",
    longDescription:
      "Our biodegradable growing pods are the consumable heart of every Urbanvana tower. Each pod is pre-filled with a coir-perlite growing medium, designed to hold seeds and support root development in aeroponic conditions. Pods are plant-once, compost-after — simply remove spent pods, add fresh ones, and restart a new crop cycle. The 50-pod pack provides 1–3 full crop cycles depending on your tower size. Available in blank pods (for your own seeds) or seeded varieties.",
    features: [
      "100% biodegradable coir-perlite blend",
      "Compatible with Tower Lite 16, Pro 30, and Max 50",
      "Plant-once, compost-after — zero plastic waste",
      "50-pod pack = 1–3 full crop cycles",
      "Available blank or pre-seeded (select below)",
      "No soaking or preparation required — drop and grow",
    ],
    specs: [
      { label: "Quantity",         value: "50 pods per pack" },
      { label: "Material",         value: "Coir + perlite blend" },
      { label: "Biodegradable",    value: "Yes — fully compostable" },
      { label: "Pod Diameter",     value: "37 mm (standard Urbanvana fit)" },
      { label: "Compatibility",    value: "All Urbanvana towers" },
      { label: "Shelf Life",       value: "18 months (sealed, dry storage)" },
    ],
    price: 349,
    originalPrice: 449,
    image: "/mock2.webp",
    images: ["/mock2.webp", "/mock4.webp", "/mock3.webp", "/mock1.webp"],
    imageAlt: "Urbanvana Seed Pod Refills 50-pack",
    badge: "Bestseller",
    rating: 4.9,
    reviewCount: 1847,
  },
  {
    id: "ph-meter",
    slug: "ph-meter",
    supplyLabel: "DIGITAL METER",
    categoryLine1: "WATER",
    categoryLine2: "QUALITY",
    category: "Accessories",
    name: "pH + TDS METER",
    description: "Two-in-one digital meter for pH and total dissolved solids. Calibrated, waterproof.",
    longDescription:
      "Maintaining the right pH and nutrient concentration in your reservoir is critical for optimal plant growth — and this two-in-one digital meter makes monitoring both effortless. The waterproof probe reads pH from 0–14 and TDS from 0–9999 ppm in seconds. Comes factory-calibrated with calibration solution included for verification. The auto-temperature compensation ensures accurate readings regardless of water temperature.",
    features: [
      "Measures pH (0–14) and TDS (0–9,999 ppm)",
      "Waterproof IP67 probe — fully submersible",
      "Auto temperature compensation (ATC)",
      "Factory calibrated, recalibration solution included",
      "Large backlit display, one-handed operation",
      "Automatic sleep mode — saves battery life",
    ],
    specs: [
      { label: "pH Range",         value: "0.00 – 14.00" },
      { label: "pH Accuracy",      value: "± 0.01 pH" },
      { label: "TDS Range",        value: "0 – 9,999 ppm" },
      { label: "TDS Accuracy",     value: "± 2%" },
      { label: "Temperature Comp", value: "Automatic (ATC)" },
      { label: "Waterproofing",    value: "IP67" },
      { label: "Battery",          value: "2× LR44 (included)" },
    ],
    price: 899,
    originalPrice: 1199,
    image: "/mock3.webp",
    images: ["/mock3.webp", "/mock2.webp", "/mock4.webp", "/mock1.webp"],
    imageAlt: "Urbanvana pH and TDS Meter",
    badge: "Sale",
    rating: 4.6,
    reviewCount: 423,
  },
  {
    id: "led-grow-light",
    slug: "led-grow-light",
    supplyLabel: "FULL SPECTRUM",
    categoryLine1: "GROW",
    categoryLine2: "LIGHTING",
    category: "Accessories",
    name: "SMART LED PANEL",
    description: "Full-spectrum 45W grow light with timer. Clips directly onto all tower models.",
    longDescription:
      "The Smart LED Panel brings full-spectrum grow lighting to any Urbanvana tower, enabling year-round growing in rooms without direct sunlight. The 45W panel covers the red (660nm) and blue (450nm) wavelengths essential for photosynthesis, alongside far-red (730nm) for flowering promotion. The built-in 16-channel programmable timer lets you set custom light schedules — most growers use 16 hours on / 8 hours off for vegetative growth. The clip-arm mounts tool-free onto all tower column sizes.",
    features: [
      "45W full-spectrum LEDs (450nm + 660nm + 730nm)",
      "Enables year-round growing in any room",
      "16-channel programmable timer built-in",
      "Tool-free clip mount — fits all Urbanvana towers",
      "Heat-dissipating aluminum housing — silent operation",
      "Energy-efficient: replaces 200W equivalent output",
    ],
    specs: [
      { label: "Power",            value: "45W" },
      { label: "Spectrum",         value: "Full (450nm, 660nm, 730nm)" },
      { label: "Coverage",         value: "Up to 60 cm tower diameter" },
      { label: "Timer",            value: "16-channel programmable" },
      { label: "Lifespan",         value: "50,000 hours" },
      { label: "Housing",          value: "Aluminum heatsink" },
      { label: "Voltage",          value: "220V, 50Hz" },
      { label: "Weight",           value: "680 g" },
    ],
    price: 2499,
    originalPrice: 3499,
    image: "/mock4.webp",
    images: ["/mock4.webp", "/mock1.webp", "/mock2.webp", "/mock3.webp"],
    imageAlt: "Urbanvana Smart LED Grow Light Panel",
    badge: "New",
    rating: 4.8,
    reviewCount: 267,
  },
]

export const CATEGORIES: Category[] = ["Towers", "Bundles", "Nutrients", "Accessories"]

export const SORT_OPTIONS = [
  { label: "Featured",     value: "featured" },
  { label: "Price: Low",   value: "price-asc" },
  { label: "Price: High",  value: "price-desc" },
  { label: "Top Rated",    value: "rating" },
  { label: "Most Reviews", value: "reviews" },
] as const

export type SortOption = (typeof SORT_OPTIONS)[number]["value"]

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function getRelatedProducts(product: Product, count = 3): Product[] {
  return PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, count)
}

export function filterAndSort(
  products: Product[],
  category: Category | "All",
  sort: SortOption,
): Product[] {
  const result = category === "All" ? products : products.filter((p) => p.category === category)
  switch (sort) {
    case "price-asc":  return [...result].sort((a, b) => a.price - b.price)
    case "price-desc": return [...result].sort((a, b) => b.price - a.price)
    case "rating":     return [...result].sort((a, b) => b.rating - a.rating)
    case "reviews":    return [...result].sort((a, b) => b.reviewCount - a.reviewCount)
    default:           return result
  }
}
