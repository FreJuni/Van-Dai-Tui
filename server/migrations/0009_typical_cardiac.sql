CREATE TYPE "public"."condition" AS ENUM('New', 'Used', 'Refurbished');--> statement-breakpoint
CREATE TABLE "productVariantCondition" (
	"id" text PRIMARY KEY NOT NULL,
	"productVariantId" text NOT NULL,
	"condition" "condition" DEFAULT 'New',
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "productVariantCondition" ADD CONSTRAINT "productVariantCondition_productVariantId_productVariant_id_fk" FOREIGN KEY ("productVariantId") REFERENCES "public"."productVariant"("id") ON DELETE cascade ON UPDATE no action;