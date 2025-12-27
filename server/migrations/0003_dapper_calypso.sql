CREATE TABLE "productVariant" (
	"id" text PRIMARY KEY NOT NULL,
	"productId" text NOT NULL,
	"variantName" text NOT NULL,
	"price" real NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "productVariantColor" (
	"id" text PRIMARY KEY NOT NULL,
	"productVariantId" text NOT NULL,
	"color" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "productVariantImage" (
	"id" text PRIMARY KEY NOT NULL,
	"productVariantId" text NOT NULL,
	"image_url" text NOT NULL,
	"name" text NOT NULL,
	"size" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "productVariantPrice" (
	"id" text PRIMARY KEY NOT NULL,
	"productVariantId" text NOT NULL,
	"price" real NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "productVariantStorage" (
	"id" text PRIMARY KEY NOT NULL,
	"productVariantId" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "productVariant" ADD CONSTRAINT "productVariant_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productVariantColor" ADD CONSTRAINT "productVariantColor_productVariantId_productVariant_id_fk" FOREIGN KEY ("productVariantId") REFERENCES "public"."productVariant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productVariantImage" ADD CONSTRAINT "productVariantImage_productVariantId_productVariant_id_fk" FOREIGN KEY ("productVariantId") REFERENCES "public"."productVariant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productVariantPrice" ADD CONSTRAINT "productVariantPrice_productVariantId_productVariant_id_fk" FOREIGN KEY ("productVariantId") REFERENCES "public"."productVariant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productVariantStorage" ADD CONSTRAINT "productVariantStorage_productVariantId_productVariant_id_fk" FOREIGN KEY ("productVariantId") REFERENCES "public"."productVariant"("id") ON DELETE cascade ON UPDATE no action;