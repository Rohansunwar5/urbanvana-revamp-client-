import { Leaf, Star, Droplets, Clock } from "lucide-react"
import { Container } from "@/components/layout/container"

/* ── TrustBar ────────────────────────────────────────────────────────────
   Conversion function: Immediate social proof right below hero fold.
   White bg, 4 trust signals with large numbers + icons.
   Server Component — pure static markup, zero JS.
───────────────────────────────────────────────────────────────────────── */

const TRUST_ITEMS = [
  {
    icon: Leaf,
    value: "12,000+",
    label: "Satisfied Growers",
    sublabel: "across India",
  },
  {
    icon: Star,
    value: "4.9 / 5",
    label: "Average Rating",
    sublabel: "from 3,200+ reviews",
  },
  {
    icon: Droplets,
    value: "90%",
    label: "Less Water",
    sublabel: "vs traditional growing",
  },
  {
    icon: Clock,
    value: "30 min",
    label: "Setup Time",
    sublabel: "plug-in and grow",
  },
]

function TrustBar() {
  return (
    <section
      aria-label="Why growers trust Urbanvana"
      className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-14"
    >
      <Container>
        <ul
          role="list"
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {TRUST_ITEMS.map(({ icon: Icon, value, label, sublabel }) => (
            <li
              key={label}
              className="flex flex-col items-center gap-3 text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-light)]">
                <Icon
                  size={22}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="text-[var(--color-primary)]"
                />
              </span>
              <div>
                <p className="font-heading text-2xl font-bold tabular-nums text-[var(--color-text-primary)] md:text-3xl">
                  {value}
                </p>
                <p className="mt-0.5 font-body text-sm font-semibold text-[var(--color-text-primary)]">
                  {label}
                </p>
                <p className="font-body text-xs text-[var(--color-text-muted)]">
                  {sublabel}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export { TrustBar }
