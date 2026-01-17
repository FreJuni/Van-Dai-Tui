CREATE TABLE "locations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"openingHours" text NOT NULL,
	"googleMapsEmbed" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
