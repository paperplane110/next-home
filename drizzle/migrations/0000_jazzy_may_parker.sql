CREATE TABLE "photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255),
	"creator" varchar(255),
	"description" text,
	"location" varchar(255),
	"captured_at" varchar(20),
	"tags" text[],
	"url" text NOT NULL,
	"pathname" text NOT NULL,
	"content_type" varchar(50),
	"size" integer,
	"width" integer,
	"height" integer,
	"aspect_ratio" varchar(20),
	"is_vertical" boolean DEFAULT true,
	"md5" varchar(32) NOT NULL,
	"blurhash" varchar(255),
	"priority" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "photos_md5_unique" UNIQUE("md5")
);
--> statement-breakpoint
CREATE INDEX "md5_idx" ON "photos" USING btree ("md5");