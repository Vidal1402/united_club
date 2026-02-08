import { PrismaClient } from '@prisma/client';

const JOURNEY_LEVELS = [
  { name: 'Aprendiz', slug: 'aprendiz', minSales: 15_000, order: 1 },
  { name: 'Executor', slug: 'executor', minSales: 50_000, order: 2 },
  { name: 'Alquimista', slug: 'alquimista', minSales: 100_000, order: 3 },
  { name: 'Mestre', slug: 'mestre', minSales: 250_000, order: 4 },
  { name: 'Mago', slug: 'mago', minSales: 500_000, order: 5 },
  { name: 'Lenda', slug: 'lenda', minSales: 1_000_000, order: 6 },
  { name: 'Campeao', slug: 'campeao', minSales: 5_000_000, order: 7 },
];

const prisma = new PrismaClient();

async function main() {
  for (const level of JOURNEY_LEVELS) {
    await prisma.journeyLevel.upsert({
      where: { slug: level.slug },
      create: level,
      update: { minSales: level.minSales, order: level.order, name: level.name },
    });
  }
  console.log('Journey levels seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
