import { db } from '@main/db';
import { downloadHistory, urlHistory } from '@main/db/schema';
import {
  DownloadHistoryItem,
  NewDownloadHistoryItem,
  NewUrlHistoryItem,
  UrlHistoryItem
} from '@main/types/db';
import { eq, desc, asc, or, like } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

export const urlHistoryOperations = {
  getById: async (id: string) => {
    return db
      ?.select()
      .from(urlHistory)
      .where(eq(urlHistory.id, id))
      .then((rows) => rows[0] ?? null);
  },

  getByUrl: async (url: string) => {
    return db
      ?.select()
      .from(urlHistory)
      .where(eq(urlHistory.url, url))
      .then((rows) => rows[0] ?? null);
  },

  getAllByAddedAtDesc: async () => {
    return db?.select().from(urlHistory).orderBy(desc(urlHistory.added_at));
  },

  getAllByAddedAtAsc: async () => {
    return db?.select().from(urlHistory).orderBy(asc(urlHistory.added_at));
  },

  deleteById: async (id: string) => {
    return db?.delete(urlHistory).where(eq(urlHistory.id, id));
  },

  deleteByUrl: async (url: string) => {
    return db?.delete(urlHistory).where(eq(urlHistory.url, url));
  },

  deleteAll: async () => {
    return db?.delete(urlHistory);
  },

  updateById: async (id: string, data: Partial<Omit<UrlHistoryItem, 'id' | 'added_at'>>) => {
    return db?.update(urlHistory).set(data).where(eq(urlHistory.id, id));
  },

  updateByUrl: async (url: string, data: Partial<Omit<UrlHistoryItem, 'id' | 'added_at'>>) => {
    return db?.update(urlHistory).set(data).where(eq(urlHistory.url, url));
  },

  addNew: async (data: Omit<UrlHistoryItem, 'id' | 'added_at'>) => {
    const completeData: NewUrlHistoryItem = {
      ...data,
      id: randomUUID(),
      added_at: new Date().toISOString()
    };
    return db?.insert(urlHistory).values(completeData);
  },
  upsertByUrl: async (url: string, data: Omit<UrlHistoryItem, 'id' | 'added_at'>) => {
    const existing = await db?.select().from(urlHistory).where(eq(urlHistory.url, url));

    if (existing && existing.length > 0) {
      await db?.delete(urlHistory).where(eq(urlHistory.url, url));
    }

    return urlHistoryOperations.addNew(data);
  },
  search: async (input: string) => {
    const pattern = `%${input}%`;

    const results = await db
      ?.select()
      .from(urlHistory)
      .where(
        or(
          like(urlHistory.title, pattern),
          like(urlHistory.url, pattern),
          like(urlHistory.source, pattern),
          like(urlHistory.uploader, pattern),
          like(urlHistory.uploader_url, pattern)
        )
      )
      .orderBy(desc(urlHistory.added_at));

    return results;
  }
};

export const downloadHistoryOperations = {
  getById: async (id: string) => {
    return db
      ?.select()
      .from(downloadHistory)
      .where(eq(downloadHistory.id, id))
      .then((rows) => rows[0] ?? null);
  },

  getByUrl: async (url: string) => {
    return db
      ?.select()
      .from(downloadHistory)
      .where(eq(downloadHistory.url, url))
      .then((rows) => rows[0] ?? null);
  },

  getAllByAddedAtDesc: async () => {
    return db?.select().from(downloadHistory).orderBy(desc(downloadHistory.added_at));
  },

  getAllByAddedAtAsc: async () => {
    return db?.select().from(downloadHistory).orderBy(asc(downloadHistory.added_at));
  },

  getAllByCompletedAtDesc: async () => {
    return db?.select().from(downloadHistory).orderBy(desc(downloadHistory.download_completed_at));
  },

  getAllByCompletedAtAsc: async () => {
    return db?.select().from(downloadHistory).orderBy(asc(downloadHistory.download_completed_at));
  },

  deleteById: async (id: string) => {
    return db?.delete(downloadHistory).where(eq(downloadHistory.id, id));
  },

  deleteByUrl: async (url: string) => {
    return db?.delete(downloadHistory).where(eq(downloadHistory.url, url));
  },

  deleteAll: async () => {
    return db?.delete(downloadHistory);
  },

  updateById: async (id: string, data: Partial<Omit<DownloadHistoryItem, 'id' | 'added_at'>>) => {
    return db?.update(downloadHistory).set(data).where(eq(downloadHistory.id, id));
  },

  updateByUrl: async (url: string, data: Partial<Omit<DownloadHistoryItem, 'id' | 'added_at'>>) => {
    return db?.update(downloadHistory).set(data).where(eq(downloadHistory.url, url));
  },

  addNew: async (data: NewDownloadHistoryItem) => {
    return db?.insert(downloadHistory).values(data);
  },

  search: async (input: string) => {
    const pattern = `%${input}%`;

    const results = await db
      ?.select()
      .from(downloadHistory)
      .where(
        or(
          like(downloadHistory.title, pattern),
          like(downloadHistory.url, pattern),
          like(downloadHistory.source, pattern),
          like(downloadHistory.uploader, pattern),
          like(downloadHistory.uploader_url, pattern)
        )
      )
      .orderBy(desc(downloadHistory.added_at));

    return results;
  }
};
