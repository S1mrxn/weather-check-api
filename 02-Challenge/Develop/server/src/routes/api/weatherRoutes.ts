import { Router, type Request, type Response } from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();
import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";

// Define __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// POST: Retrieve weather data for a city
router.post("/", async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body;
    if (!cityName) {
      return res.status(400).json({ message: "City name is required" });
    }

    const weatherData = await WeatherService.getWeatherForCity(cityName);

    if (weatherData) {
      await HistoryService.addCity(cityName);
      return res.status(200).json({
        message: `Weather data for ${cityName} retrieved successfully`,
        data: weatherData,
      });
    } else {
      return res.status(404).json({
        message: `Weather data for ${cityName} not found`,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Error retrieving weather data",
        error: error.message,
      });
    }
    return res.status(500).json({
      message: "Error retrieving weather data",
      error: "Unknown error",
    });
  }
});

// GET: Search history
router.get("/history", async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities(); // Retrieve the cities history from the service
    return res.status(200).json(history); // Return the history as a JSON response
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Error fetching search history" });
  }
});

// DELETE: Remove a city from search history
router.delete("/history/:id", async (req: Request, res: Response) => {
  try {
    const cityId = req.params.id;
    if (!cityId) {
      return res.status(400).json({ message: "City ID is required" });
    }

    const result = await HistoryService.removeCity(cityId);
    if (result) {
      return res.status(200).json({
        message: `City with ID ${cityId} deleted successfully`,
      });
    }
    return res.status(404).json({
      message: `City with ID ${cityId} not found`,
    });
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Error deleting city from history",
        error: error.message,
      });
    }
    return res.status(500).json({
      message: "Error deleting city from history",
      error: "Unknown error",
    });
  }
});

// Serve static client files
router.get("/history/ui", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../../client/dist/index.html"));
});

export default router;
