import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de microacciones...');

  const dataPath = path.join(__dirname, '../../../seed/micro-actions.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const microActions = JSON.parse(rawData);

  for (const action of microActions) {
    await prisma.microAction.upsert({
      where: { slug: action.slug },
      update: {
        title: action.title,
        category: action.category,
        goal: action.goal,
        description: action.description,
        durationSeconds: action.durationSeconds,
        difficulty: action.difficulty,
        energyRequired: action.energyRequired,
        recommendedContexts: action.recommendedContexts,
        anxietyLevels: action.anxietyLevels,
        cognitiveLoadMatch: action.cognitiveLoadMatch,
        instructions: action.instructions,
        contraindications: action.contraindications,
        isPremium: action.isPremium,
      },
      create: {
        slug: action.slug,
        title: action.title,
        category: action.category,
        goal: action.goal,
        description: action.description,
        durationSeconds: action.durationSeconds,
        difficulty: action.difficulty,
        energyRequired: action.energyRequired,
        recommendedContexts: action.recommendedContexts,
        anxietyLevels: action.anxietyLevels,
        cognitiveLoadMatch: action.cognitiveLoadMatch,
        instructions: action.instructions,
        contraindications: action.contraindications,
        isPremium: action.isPremium,
      },
    });
    console.log(`✅ Upserted micro-action: ${action.slug}`);
  }

  console.log('✅ Seed completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
