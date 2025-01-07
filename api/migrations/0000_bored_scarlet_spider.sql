CREATE TABLE `reports` (
	`id` integer PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`day` integer NOT NULL,
	`month` integer NOT NULL,
	`year` integer NOT NULL,
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
