import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { downloadHistory, extraCommandsHistory, urlHistory } from '@main/db/schema';

export type UrlHistoryItem = InferSelectModel<typeof urlHistory>;
export type NewUrlHistoryItem = InferInsertModel<typeof urlHistory>;
export type UrlHistory = UrlHistoryItem[];

export type DownloadHistoryItem = InferSelectModel<typeof downloadHistory>;
export type NewDownloadHistoryItem = InferInsertModel<typeof downloadHistory>;
export type DownloadsHistory = DownloadHistoryItem[];

export type ExtraCommandsHistoryItem = InferSelectModel<typeof extraCommandsHistory>;
export type NewExtraCommandsHistoryItem = InferInsertModel<typeof extraCommandsHistory>;
export type ExtraCommandsHistory = ExtraCommandsHistoryItem[];
