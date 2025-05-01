import express from "express";
import cors from "cors";
import { db } from "./src/db.js"; // Import the database connection
import { CarListing } from "./src/schema.js"; // Import the schema
import { eq } from "drizzle-orm";

const app = express();

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// ✅ Root route to confirm server is working
app.get("/", (req, res) => {
  res.send("Server is working 🚀");
});

// ✅ API endpoint to fetch all car listings
app.get("/api/cars", async (req, res) => {
  try {
    console.log("Fetching all car listings...");

    const listings = await db
      .select()
      .from(CarListing)
      .where(eq(CarListing.soldOut, false))
      .orderBy(CarListing.createdAt, "desc");

    console.log("Listings fetched successfully:", listings);

    res.status(200).json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: "Failed to fetch listings." });
  }
});

// ✅ API endpoint to fetch a car by ID
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

    console.log("Car Details fetched successfully:", carDetails);

    res.status(200).json(carDetails);
  } catch (error) {
    console.error("Error fetching car by ID:", error);
    res.status(500).json({ error: "Failed to fetch car by ID." });
  }
});

// ✅ API endpoint to add a new car listing
app.post("/api/add-listing", async (req, res) => {
  try {
    const { pictures, make, year, comment, mileage, sellingPrice, fuelType, category } = req.body;

    await db.insert(CarListing).values({
      pictures,
      make,
      year: year ? parseInt(year, 10) : null,
      mileage: mileage ? parseInt(mileage, 10) : null,
      sellingPrice,
      fuelType,
      category,
      comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      soldOut: false,
    });

    console.log("New car listing added successfully!");

    res.status(200).json({ message: "Listing added successfully!" });
  } catch (error) {
    console.error("Error adding listing:", error);
    res.status(500).json({ error: "Failed to add listing." });
  }
});

// ✅ API endpoint to update car details
app.put("/api/cars/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid car ID." });
    }

    const { make, year, mileage, sellingPrice, fuelType, comment, pictures, category } = req.body;

    const updatedRows = await db
      .update(CarListing)
      .set({
        make,
        year: year ? parseInt(year, 10) : null,
        mileage: mileage ? parseInt(mileage, 10) : null,
        sellingPrice,
        fuelType,
        pictures,
        category,
        comment,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(CarListing.id, parsedId));

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Car not found or no changes made." });
    }

    console.log("Car details updated successfully!");

    res.status(200).json({ message: "Car details updated successfully!" });
  } catch (error) {
    console.error("Error updating car details:", error);
    res.status(500).json({ error: "Failed to update car details." });
  }
});

// ✅ API endpoint to mark a car as sold out
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

    console.log("Car marked as sold out successfully!");

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