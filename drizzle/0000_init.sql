CREATE TABLE `downloads_history` (
	`id` text PRIMARY KEY NOT NULL,
	`thumbnail` text NOT NULL,
	`title` text NOT NULL,
	`format` text NOT NULL,
	`download_progress` text NOT NULL,
	`download_progress_string` text NOT NULL,
	`downloaded_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`download_status` text NOT NULL,
	`command` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `extra_commands_history` (
	`id` text PRIMARY KEY NOT NULL,
	`command` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `url_history` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`thumbnail` text NOT NULL,
	`title` text NOT NULL,
	`added_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
