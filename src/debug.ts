import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const latestRun = await prisma.run.findFirst({
    orderBy: { startedAt: 'desc' },
    include: { nodeExecutions: true }
  });
  console.log(JSON.stringify(latestRun, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
