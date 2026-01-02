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
