import dotenv from "dotenv";
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
class Weather {
  city: string;
  tempF: number;
  humidity: number;
  windSpeed: number;
  icon: string;
  iconDescription: string;
  date: string;

  constructor(
    city: string,
    tempF: number,
    humidity: number,
    windSpeed: number,
    icon: string,
    iconDescription: string,
    date: string
  ) {
    this.city = city;
    this.tempF = tempF;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.date = date;
  }
}

// Complete the WeatherService class
class WeatherService {
  baseURL: string;
  apiKey: string;
  cityName: string;

  constructor() {
    this.baseURL = "https://api.openweathermap.org/data/2.5/";
    this.apiKey = process.env.API_KEY || "";
    this.cityName = "";
  }

  // Fetch location data (geocode) by city name
  async fetchLocationData(query: string) {
    const response = await fetch(
      `${this.baseURL}weather?q=${query}&units=imperial&appid=${this.apiKey}`
    );
    const locationData = await response.json();
    return locationData;
  }

  // Destructure location data to get coordinates
  destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData.coord;
    return { lat, lon };
  }

  // Build the weather query using coordinates
  buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }

  // Fetch and destructure location data by city
  async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.cityName);
    if (locationData.cod !== 200) {
      throw new Error("City not found");
    }
    const coordinates = this.destructureLocationData(locationData);
    return coordinates;
  }

  // Fetch weather data for the given coordinates
  async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    const weatherData = await response.json();
    return weatherData;
  }

  // Parse the current weather data
  parseCurrentWeather(response: any): Weather {
    const { main, weather, wind } = response;
    const currentWeather = new Weather(
      this.cityName,
      main.temp,
      main.humidity,
      wind.speed,
      weather[0].icon,
      weather[0].description, // Handle UV Index gracefully
      new Date().toLocaleDateString()
    );

    return currentWeather;
  }

  // Build the forecast array from weather data
  buildForecastArray(weatherData: any[]) {
    const forecastArray: Weather[] = [];
    for (let i = 0; i < weatherData.length; i += 8) {
      const forecast = new Weather(
        this.cityName,
        weatherData[i].main.temp,
        weatherData[i].main.humidity,
        weatherData[i].wind.speed,
        weatherData[i].weather[0]?.icon || "",
        weatherData[i].weather[0]?.description || 0, // Handle UV Index gracefully
        weatherData[i].dt_txt
      );

      forecastArray.push(forecast);
    }
    return forecastArray;
  }

  // Get weather for a given city
  async getWeatherForCity(city: string) {
    this.cityName = city;
    try {
      const coordinates = await this.fetchAndDestructureLocationData();
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData.list[0]);
      const forecastArray = this.buildForecastArray(weatherData.list);
      return { currentWeather, forecastArray };
    } catch (error) {
      console.error("Error getting weather:", error);
      throw error; // Propagate the error
    }
  }
}

export default new WeatherService();
