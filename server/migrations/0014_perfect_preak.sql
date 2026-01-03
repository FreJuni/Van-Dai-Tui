CREATE TYPE "public"."status" AS ENUM('Pending', 'Shipped', 'Delivered', 'Completed', 'Cancelled');--> statement-breakpoint
CREATE TABLE "order_products" (
	"id" text PRIMARY KEY NOT NULL,
	"orderId" text NOT NULL,
	"productVariantId" text NOT NULL,
	"productId" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"quantity" integer NOT NULL,
	"status" "status" DEFAULT 'Pending',
	"totalPrice" real NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "price" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_productVariantId_productVariant_id_fk" FOREIGN KEY ("productVariantId") REFERENCES "public"."productVariant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;