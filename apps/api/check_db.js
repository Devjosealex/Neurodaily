const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const microActions = await prisma.microAction.findMany();
  console.log('--- ALL MICROACTIONS ---');
  console.dir(microActions, { depth: null });
}

main().catch(console.error).finally(() => prisma.$disconnect());
