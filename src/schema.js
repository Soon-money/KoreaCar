import { integer, json, pgTable, serial, varchar, boolean } from "drizzle-orm/pg-core"; // Use boolean for boolean columns
import { drizzle } from "drizzle-orm/neon-http";

export const CarListing = pgTable("car_listing", {
  id: serial("id").primaryKey(), // Primary key
  sellingPrice: varchar("selling_price", 255), // Matches formData.sellingPrice
  fuelType: varchar("fuel_type", 255), // Matches formData.fuelType
  make: varchar("make", 255), // Matches formData.make

  year: integer("year"), // Matches formData.year
  mileage: integer("mileage"), // Matches formData.mileage
  category: varchar("category", 255), // Matches formData.category
  pictures: json("pictures"), // JSON array to store image URLs
  videos: json("videos"), // JSON array to store video URLs
  soldOut: boolean("sold_out").default(false), // Use boolean for boolean columns
  createdAt: varchar("created_at", 255), // Timestamp for record creation
  updatedAt: varchar("updated_at", 255), // Timestamp for record updates
}); // Closing brace for CarListing

export const Image = pgTable("images", {
  id: serial("id").primaryKey(),
  carListingId: integer("car_listing_id"),
  url: varchar("url", 500),
});

export const Video = pgTable("videos", {
  id: serial("id").primaryKey(),
  carListingId: integer("car_listing_id"),
  url: varchar("url", 500),
});

export const db = drizzle(
  "postgresql://neondb_owner:npg_Mv52VZHBFRjr@ep-snowy-cake-a1vstnv2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
);