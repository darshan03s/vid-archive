PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_url_history` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`source` text NOT NULL,
	`thumbnail` text NOT NULL,
	`thumbnail_local` text NOT NULL,
	`uploader` text NOT NULL,
	`uploader_url` text NOT NULL,
	`duration` text NOT NULL,
	`created_at` text NOT NULL,
	`added_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_url_history`("id", "title", "url", "source", "thumbnail", "thumbnail_local", "uploader", "uploader_url", "duration", "created_at", "added_at") SELECT "id", "title", "url", "source", "thumbnail", "thumbnail_local", "uploader", "uploader_url", "duration", "created_at", "added_at" FROM `url_history`;--> statement-breakpoint
DROP TABLE `url_history`;--> statement-breakpoint
ALTER TABLE `__new_url_history` RENAME TO `url_history`;--> statement-breakpoint
PRAGMA foreign_keys=ON;