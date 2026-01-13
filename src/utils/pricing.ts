export type FeatureKey =
  | 'Autocomplete'
  | 'ReverseGeocoding'
  | 'Direction'
  | 'Matrix'
  | 'ONM'
  | 'RouteOptimization'
  | 'FleetRouting'
  | 'Tile'

const pricingTiers: Record<
  FeatureKey,
  Array<{ range: [number, number]; price: number }>
> = {
  Autocomplete: [
    { range: [0, 100], price: 2 },
    { range: [100, 500], price: 1.589 },
    { range: [500, 1000], price: 1.19 },
    { range: [1000, 5000], price: 0.595 },
    { range: [5000, 10000], price: 0.147 },
  ],
  ReverseGeocoding: [
    { range: [0, 100], price: 3.6 },
    { range: [100, 500], price: 2.48 },
    { range: [500, 1000], price: 1.86 },
    { range: [1000, 5000], price: 0.93 },
    { range: [5000, 10000], price: 0.2356 },
  ],
  Direction: [
    { range: [0, 100], price: 3.6 },
    { range: [100, 500], price: 2.48 },
    { range: [500, 1000], price: 1.86 },
    { range: [1000, 5000], price: 0.93 },
    { range: [5000, 10000], price: 0.2356 },
  ],
  Matrix: [
    { range: [0, 100], price: 3.6 },
    { range: [100, 500], price: 2.2 },
    { range: [500, 1000], price: 1.65 },
    { range: [1000, 5000], price: 0.825 },
    { range: [5000, 10000], price: 0.209 },
  ],
  ONM: [
    { range: [0, 100], price: 3.6 },
    { range: [100, 500], price: 2.2 },
    { range: [500, 1000], price: 1.65 },
    { range: [1000, 5000], price: 0.825 },
    { range: [5000, 10000], price: 0.209 },
  ],
  RouteOptimization: [
    { range: [0, 100], price: 6 },
    { range: [100, 500], price: 2.2 },
    { range: [500, 1000], price: 1.1 },
    { range: [1000, 5000], price: 0.44 },
    { range: [5000, 10000], price: 0.385 },
  ],
  FleetRouting: [
    { range: [0, 100], price: 17 },
    { range: [100, 500], price: 7.7 },
    { range: [500, 1000], price: 3.3 },
    { range: [1000, 5000], price: 1.32 },
    { range: [5000, 10000], price: 1.155 },
  ],
  Tile: [
    { range: [0, 50], price: 0 },
    { range: [50, 100], price: 0.45 },
    { range: [100, 500], price: 0.45 },
    { range: [500, 1000], price: 0.45 },
    { range: [1000, 5000], price: 0.336 },
    { range: [5000, 10000], price: 0.252 },
    { range: [10000, 50000], price: 0.126 },
    { range: [50000, 100000], price: 0.0315 },
  ],
}

const specialConditions: Partial<
  Record<FeatureKey, { threshold: number; adjustedPrice: number }>
> = {
  Autocomplete: { threshold: 150, adjustedPrice: 1.981 },
  ReverseGeocoding: { threshold: 150, adjustedPrice: 3.1 },
  Direction: { threshold: 150, adjustedPrice: 3.1 },
  Matrix: { threshold: 150, adjustedPrice: 2.75 },
  ONM: { threshold: 150, adjustedPrice: 2.75 },
  RouteOptimization: { threshold: 150, adjustedPrice: 5.5 },
  FleetRouting: { threshold: 150, adjustedPrice: 16.5 },
  Tile: { threshold: 1500, adjustedPrice: 0.42 },
}

const first20kPricing: Record<FeatureKey, number> = {
  Autocomplete: 2.0,
  ReverseGeocoding: 3.6,
  Direction: 3.6,
  Matrix: 3.6,
  ONM: 3.6,
  RouteOptimization: 6.0,
  FleetRouting: 17.0,
  Tile: 0.45,
}

export const calculatePrice = (feature: FeatureKey, rawCalls: number) => {
  if (!Number.isFinite(rawCalls) || rawCalls <= 0) return 0

  const unitsOf1000 = rawCalls / 1000

  if (rawCalls <= 20_000) {
    if (feature === 'Tile') {
      if (rawCalls <= 50_000) return 0
    } else {
      return first20kPricing[feature] * 20
    }
  }

  let totalCost = 0
  let remainingUnits = unitsOf1000

  if (
    specialConditions[feature] &&
    unitsOf1000 > (specialConditions[feature]?.threshold ?? 0)
  ) {
    const firstTier = pricingTiers[feature][0]
    const tierRange = firstTier.range[1] - firstTier.range[0]
    const unitsInTier = Math.min(remainingUnits, tierRange)
    totalCost += unitsInTier * (specialConditions[feature]?.adjustedPrice ?? 0)
    remainingUnits -= unitsInTier
  }

  for (let i = 0; i < pricingTiers[feature].length && remainingUnits > 0; i++) {
    const tier = pricingTiers[feature][i]

    if (
      i === 0 &&
      specialConditions[feature] &&
      unitsOf1000 > (specialConditions[feature]?.threshold ?? 0)
    ) {
      continue
    }

    const tierMin = tier.range[0]
    const tierMax = tier.range[1]
    const tierRange = tierMax - tierMin
    const unitsInTier = Math.min(remainingUnits, tierRange)

    if (unitsInTier > 0) {
      totalCost += unitsInTier * tier.price
      remainingUnits -= unitsInTier
    }
  }

  return totalCost
}

export const resolveFeatureKey = (
  calltype?: string | null
): FeatureKey | null => {
  if (!calltype) return null
  const normalized = calltype.replace(/\s+/g, '').toLowerCase()
  const keys = Object.keys(pricingTiers) as FeatureKey[]
  return keys.find((k) => k.toLowerCase() === normalized) ?? null
}
