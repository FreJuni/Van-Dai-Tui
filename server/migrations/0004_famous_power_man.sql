CREATE TABLE "productVariantOption" (
	"id" text PRIMARY KEY NOT NULL,
	"productVariantId" text NOT NULL,
	"storage" text NOT NULL,
	"price" real NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "productVariantPrice" CASCADE;--> statement-breakpoint
DROP TABLE "productVariantStorage" CASCADE;--> statement-breakpoint
ALTER TABLE "productVariantOption" ADD CONSTRAINT "productVariantOption_productVariantId_productVariant_id_fk" FOREIGN KEY ("productVariantId") REFERENCES "public"."productVariant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productVariant" DROP COLUMN "price";