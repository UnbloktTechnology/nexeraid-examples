CREATE TABLE IF NOT EXISTS "customer_status" (
	"address" text PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
