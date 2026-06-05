import { prisma } from './prisma.js';

export interface CreateEntryInput {
  authorId: string;
  title: string;
  date: Date;
  content: string;
  snippet: string;
}

export async function createEntry(input: CreateEntryInput) {
  return prisma.entry.create({
    data: {
      authorId: input.authorId,
      title: input.title,
      date: input.date,
      content: input.content,
      snippet: input.snippet,
    },
  });
}

export interface GetEntriesOptions {
  authorId?: string;
  query?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

export async function getEntries(options: GetEntriesOptions = {}) {
  const { authorId, query, dateFrom, dateTo, page = 1, limit = 20 } = options;

  const where: {
    authorId?: string;
    title?: { contains: string };
    date?: { gte?: Date; lte?: Date };
  } = {};

  if (authorId) {
    where.authorId = authorId;
  }

  if (query) {
    where.title = { contains: query };
  }

  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) where.date.gte = dateFrom;
    if (dateTo) where.date.lte = dateTo;
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.entry.findMany({
      where,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      skip,
      take: limit,
      select: {
        id: true,
        authorId: true,
        createdAt: true,
        date: true,
        title: true,
        snippet: true,
      },
    }),
    prisma.entry.count({ where }),
  ]);

  return { data, total, page, limit };
}

export async function getEntryById(id: string) {
  return prisma.entry.findUnique({
    where: { id },
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
