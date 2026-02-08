export const COMMISSION_LEVELS = [
  { level: 1, percentage: 5 },
  { level: 2, percentage: 3 },
  { level: 3, percentage: 1 },
] as const;

export const ADVANCE_FEE_PERCENTAGE = 5;

export const JOURNEY_LEVELS = [
  { name: 'Aprendiz', slug: 'aprendiz', minSales: 15_000, order: 1 },
  { name: 'Executor', slug: 'executor', minSales: 50_000, order: 2 },
  { name: 'Alquimista', slug: 'alquimista', minSales: 100_000, order: 3 },
  { name: 'Mestre', slug: 'mestre', minSales: 250_000, order: 4 },
  { name: 'Mago', slug: 'mago', minSales: 500_000, order: 5 },
  { name: 'Lenda', slug: 'lenda', minSales: 1_000_000, order: 6 },
  { name: 'Campeão', slug: 'campeao', minSales: 5_000_000, order: 7 },
] as const;
