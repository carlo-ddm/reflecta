import { prisma } from './prisma.js';

export interface CreateEntryInput {
  authorId: string;
  content: string;
  snippet: string;
}

export async function createEntry(input: CreateEntryInput) {
  return prisma.entry.create({
    data: {
      authorId: input.authorId,
      content: input.content,
      snippet: input.snippet,
    },
  });
}

export async function getEntries() {
  return prisma.entry.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      snippet: true,
      authorId: true,
      analysis: {
        select: { id: true },
      },
    },
  });
}

export async function getEntryById(id: string) {
  return prisma.entry.findUnique({
    where: { id },
    include: {
      analysis: {
        include: { metrics: true },
      },
    },
  });
}

export async function deleteEntryById(id: string) {
  const entry = await prisma.entry.findUnique({
    where: { id },
    include: {
      analysis: {
        select: { id: true },
      },
    },
  });

  if (!entry) {
    return null;
  }

  await prisma.$transaction(async (tx) => {
    if (entry.analysis) {
      await tx.metricScore.deleteMany({ where: { analysisId: entry.analysis.id } });
      await tx.analysis.delete({ where: { id: entry.analysis.id } });
    }

    await tx.entry.delete({ where: { id } });
  });

  return entry;
}
