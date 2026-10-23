/** Shared timings; transform/opacity only for entrance and navigation motion. */
export const motion = {
  page: 300,
  reveal: 700,
  revealDistance: 24,
  icon: 220,
  press: 120,
  indicator: 340,
  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  spring: "cubic-bezier(0.22, 0.85, 0.25, 1.08)",
} as const;
