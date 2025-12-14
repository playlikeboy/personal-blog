CREATE TABLE `follows` (
	`id` text PRIMARY KEY NOT NULL,
	`follower_id` text NOT NULL,
	`following_id` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`follower_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`following_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `unique_follow` ON `follows` (`follower_id`,`following_id`);--> statement-breakpoint
CREATE TABLE `post_views` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`user_id` text,
	`fingerprint` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `post_views_post_idx` ON `post_views` (`post_id`);--> statement-breakpoint
CREATE INDEX `post_views_user_idx` ON `post_views` (`user_id`);--> statement-breakpoint
CREATE INDEX `post_views_fingerprint_idx` ON `post_views` (`fingerprint`);--> statement-breakpoint
ALTER TABLE `posts` ADD `staff_pick` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `username` text;--> statement-breakpoint
ALTER TABLE `users` ADD `is_banned` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `show_followers_count` integer DEFAULT false;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);