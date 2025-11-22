CREATE TABLE "generate_password_reset_token" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"token" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "generate_password_reset_token" ADD CONSTRAINT "generate_password_reset_token_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;