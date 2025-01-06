CREATE TABLE `annualReports` (
	`id` integer PRIMARY KEY NOT NULL,
	`reportId` integer NOT NULL,
	`year` integer NOT NULL,
	FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `dailyReports` (
	`id` integer PRIMARY KEY NOT NULL,
	`reportId` integer NOT NULL,
	`day` integer NOT NULL,
	`month` integer NOT NULL,
	`year` integer NOT NULL,
	FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `monthlyReports` (
	`id` integer PRIMARY KEY NOT NULL,
	`reportId` integer NOT NULL,
	`month` integer NOT NULL,
	`year` integer NOT NULL,
	FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` integer PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
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
