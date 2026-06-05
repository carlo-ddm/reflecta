export interface EntryListItemDto {
  id: string;
  authorId: string;
  createdAt: Date;
  date: Date;
  title: string;
  snippet: string;
}

export interface EntryDetailDto extends EntryListItemDto {
  content: string;
}

export const toEntryListItemDto = (entry: {
  id: string;
  authorId: string;
  createdAt: Date;
  date: Date;
  title: string;
  snippet: string;
}): EntryListItemDto => ({
  id: entry.id,
  authorId: entry.authorId,
  createdAt: entry.createdAt,
  date: entry.date,
  title: entry.title,
  snippet: entry.snippet,
});

export const toEntryDetailDto = (entry: {
  id: string;
  authorId: string;
  createdAt: Date;
  date: Date;
  title: string;
  snippet: string;
  content: string;
}): EntryDetailDto => ({
  id: entry.id,
  authorId: entry.authorId,
  createdAt: entry.createdAt,
  date: entry.date,
  title: entry.title,
  snippet: entry.snippet,
  content: entry.content,
});
