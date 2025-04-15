import express from "express";
import cors from "cors"; // Import the CORS middleware
import { db } from "./src/db.js";
import { CarListing } from "./src/schema.js";
import { eq } from "drizzle-orm";

const app = express();

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// API endpoint to handle form submissions (store data)
app.post("/api/add-listing", async (req, res) => {
  try {
    const { pictures, videos, make, year, mileage, sellingPrice, fuelType, category } = req.body;

    // Insert data into the database using Drizzle ORM
    await db.insert(CarListing).values({
      pictures,
      videos,
      make,
      year: year ? parseInt(year) : null,
      mileage: mileage ? parseInt(mileage) : null,
      sellingPrice,
      fuelType,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      soldOut: false, // Default to not sold out
    });

    res.status(200).json({ message: "Listing added successfully!" });
  } catch (error) {
    console.error("Error adding listing:", error);
    res.status(500).json({ error: "Failed to add listing." });
  }
});

// API endpoint to fetch all car listings
app.get("/api/cars", async (req, res) => {
  try {
    // Fetch all car listings from the database, sorted by createdAt in descending order
    const listings = await db
      .select()
      .from(CarListing)
      .where(eq(CarListing.soldOut, false)) // Ensure `soldOut` is a valid column
      .orderBy(CarListing.createdAt, "desc"); // Use the correct syntax for `orderBy`

    res.status(200).json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: "Failed to fetch listings." });
  }
});

// API endpoint to fetch a car by ID
app.get("/api/cars/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid car ID." });
    }

    const cars = await db
      .select()
      .from(CarListing)
      .where(eq(CarListing.id, parsedId))
      .limit(1);

    if (cars.length === 0) {
      return res.status(404).json({ error: "Car not found." });
    }

    const carDetails = cars[0];

    res.status(200).json({
      id: carDetails.id,
      make: carDetails.make,
      model: carDetails.model,
      year: carDetails.year,
      mileage: carDetails.mileage,
      sellingPrice: carDetails.sellingPrice,
      fuelType: carDetails.fuelType,
      pictures: carDetails.pictures,
      videos: carDetails.videos,
      category: carDetails.category,
    });
  } catch (error) {
    console.error("Error fetching car by ID:", error);
    res.status(500).json({ error: "Failed to fetch car by ID." });
  }
});

// API endpoint to update car details
app.put("/api/cars/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid car ID." });
    }

    const { make, model, year, mileage, sellingPrice, fuelType, pictures, videos, category } = req.body;

    const updatedRows = await db
      .update(CarListing)
      .set({
        make,
        model,
        year: year ? parseInt(year) : null,
        mileage: mileage ? parseInt(mileage) : null,
        sellingPrice,
        fuelType,
        pictures,
        videos,
        category,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(CarListing.id, parsedId));

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Car not found or no changes made." });
    }

    res.status(200).json({ message: "Car details updated successfully!" });
  } catch (error) {
    console.error("Error updating car details:", error);
    res.status(500).json({ error: "Failed to update car details." });
  }
});

// API endpoint to mark a car as sold out
app.put("/api/cars/:id/soldout", async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid car ID." });
    }

    const updatedRows = await db
      .update(CarListing)
      .set({ soldOut: true, updatedAt: new Date().toISOString() })
      .where(eq(CarListing.id, parsedId));

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Car not found or already marked as sold out." });
    }

    res.status(200).json({ message: "Car marked as sold out successfully!" });
  } catch (error) {
    console.error("Error marking car as sold out:", error);
    res.status(500).json({ error: "Failed to mark car as sold out." });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});