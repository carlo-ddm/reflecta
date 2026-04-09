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

export interface GetEntriesOptions {
  authorId?: string;
  page?: number;
  limit?: number;
}

export async function getEntries(options: GetEntriesOptions = {}) {
  const { authorId, page = 1, limit = 20 } = options;
  const where = authorId ? { authorId } : {};
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.entry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        createdAt: true,
        snippet: true,
        authorId: true,
        analysis: {
          select: { id: true },
        },
      },
    }),
    prisma.entry.count({ where }),
  ]);

  return { data, total, page, limit };
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
    select: { id: true },
  });

  if (!entry) {
    return null;
  }

  await prisma.entry.delete({ where: { id } });

  return entry;
}
