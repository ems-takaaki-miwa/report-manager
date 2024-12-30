CREATE TABLE `files` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`fileDate` integer,
	`uploaderId` text NOT NULL,
	`updatedAt` integer,
	`createdAt` integer,
	FOREIGN KEY (`uploaderId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`hashedPassword` text NOT NULL,
	`updatedAt` integer,
	`createdAt` integer
);
