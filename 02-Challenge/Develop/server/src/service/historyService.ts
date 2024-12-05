import fs from "fs";

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  async read() {
    try {
      const cities = await fs.promises.readFile("./db/db.json", "utf8");
      return JSON.parse(cities);
    } catch (err) {
      console.log("Error reading file:", err);
      return []; // Return an empty array if there's an error reading the file
    }
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  async write(cities: City[]) {
    try {
      await fs.promises.writeFile("./db/db.json", JSON.stringify(cities));
    } catch (err) {
      console.log("Error writing to file:", err);
    }
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    try {
      const cities = await this.read();
      return cities; // Return the cities read from the file
    } catch (err) {
      console.log("Error:", err);
      return err;
    }
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string): Promise<boolean> {
    try {
      // Simulate adding the city, e.g., write to the file or database
      const cities = await this.read(); // Assuming read method loads current cities
      cities.push(new City(city, Date.now())); // Add the city to the list
      await this.write(cities); // Save back to the file
      return true; // Return true to indicate success
    } catch (error) {
      console.error("Error adding city:", error);
      return false; // Return false if an error occurs
    }
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
async removeCity(id: string): Promise<boolean> {
  try {
    let cities = await this.read(); // Read the existing cities
    const initialLength = cities.length;
    cities = cities.filter((city: City) => city.id !== Number(id)); // Remove the city by ID
    await this.write(cities); // Write the updated list back

    return cities.length !== initialLength; // Return true if a city was removed
  } catch (error) {
    console.error("Error removing city:", error);
    return false; // Return false if an error occurs
  }
  }
}

export default new HistoryService();
