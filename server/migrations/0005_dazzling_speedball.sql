CREATE TYPE "public"."product_type" AS ENUM('Phone', 'Tablet', 'Laptop', 'Other');--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "type" "product_type" DEFAULT 'Other';