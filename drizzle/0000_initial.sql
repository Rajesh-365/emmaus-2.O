CREATE TYPE "public"."application_status" AS ENUM('pending', 'reviewed', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."church_status" AS ENUM('active', 'construction');--> statement-breakpoint
CREATE TYPE "public"."course_level" AS ENUM('Foundation', 'Intermediate', 'Advanced', 'Mastery');--> statement-breakpoint
CREATE TYPE "public"."education" AS ENUM('10th', '12th', 'diploma', 'bachelor', 'master', 'other');--> statement-breakpoint
CREATE TYPE "public"."gallery_category" AS ENUM('Gospel Crusades', 'JGF Activities', 'Churches');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."result_category" AS ENUM('Distinction', '1st Class', '2nd Class', 'Pass', 'Absent');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"first_name" varchar(80) NOT NULL,
	"last_name" varchar(80) NOT NULL,
	"email" varchar(160) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"date_of_birth" varchar(32) NOT NULL,
	"gender" "gender" NOT NULL,
	"address" text NOT NULL,
	"city" varchar(80) NOT NULL,
	"state" varchar(80) NOT NULL,
	"pincode" varchar(6) NOT NULL,
	"course_slug" varchar(80) NOT NULL,
	"previous_education" "education" NOT NULL,
	"church_affiliation" varchar(160) NOT NULL,
	"pastor_reference" varchar(160) NOT NULL,
	"testimony" text NOT NULL,
	"motivation" text NOT NULL,
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"notes" text,
	"reviewed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "churches" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(160) NOT NULL,
	"location" varchar(160) NOT NULL,
	"pastor" varchar(160) NOT NULL,
	"phone" varchar(32) NOT NULL,
	"status" "church_status" NOT NULL,
	"image" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "council_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(160) NOT NULL,
	"role" varchar(160) NOT NULL,
	"phone" varchar(32) NOT NULL,
	"whatsapp" varchar(32),
	"image" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(80) NOT NULL,
	"code" varchar(16) NOT NULL,
	"name" varchar(160) NOT NULL,
	"duration" varchar(32) NOT NULL,
	"semesters" smallint NOT NULL,
	"level" "course_level" NOT NULL,
	"tier" smallint NOT NULL,
	"summary" text NOT NULL,
	"description" text NOT NULL,
	"highlights" text[] DEFAULT '{}' NOT NULL,
	"eligibility" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "courses_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "gallery_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"src" varchar(255) NOT NULL,
	"alt" varchar(255) NOT NULL,
	"category" "gallery_category" NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programmes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(16) NOT NULL,
	"name" varchar(160) NOT NULL,
	"year" varchar(8) NOT NULL,
	"semester_max" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"programme_id" integer NOT NULL,
	"admission_no" varchar(32) NOT NULL,
	"name" varchar(160) NOT NULL,
	"location" varchar(120) NOT NULL,
	"first_sem" smallint,
	"second_sem" smallint,
	"percentage" smallint,
	"result" "result_category",
	"rank" smallint
);
--> statement-breakpoint
ALTER TABLE "student_results" ADD CONSTRAINT "student_results_programme_id_programmes_id_fk" FOREIGN KEY ("programme_id") REFERENCES "public"."programmes"("id") ON DELETE cascade ON UPDATE no action;