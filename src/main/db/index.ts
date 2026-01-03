import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { DB_PATH, MIGRATIONS_FOLDER } from '..';
import * as schema from './schema';
import logger from '@shared/logger';

export let db: ReturnType<typeof drizzle>;

export function initDatabase() {
  try {
    const sqlite = new Database(DB_PATH);
    sqlite.pragma('journal_mode = WAL');

    db = drizzle(sqlite, { schema });
    logger.info('Database initialized');
  } catch (error: unknown) {
    logger.error('Database initialization failed: ' + String(error));
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

export function runMigrations() {
  try {
    if (!db) {
      throw new Error('DB not initialized');
    }
    migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
    logger.info('Database migrations applied');
  } catch (error: unknown) {
    logger.error('Database migrations failed: ' + String(error));
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

export { schema };
