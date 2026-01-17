CREATE TABLE "contactMessages" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "discounts" (
	"id" text PRIMARY KEY NOT NULL,
	"minPrice" real NOT NULL,
	"maxPrice" real NOT NULL,
	"discount" real NOT NULL,
	"startDate" timestamp NOT NULL,
	"endDate" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
