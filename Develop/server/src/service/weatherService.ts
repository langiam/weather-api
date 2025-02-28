import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  icon: string;
  iconDescription: string;

  constructor(city: string, date: string, temperature: number, humidity: number, windSpeed: number, icon: string, iconDescription: string) {
    this.city = city;
    this.date = date;
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.icon = icon;
    this.iconDescription = iconDescription;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL: string = 'https://api.openweathermap.org/data/2.5/';
  private apiKey: string = process.env.API_KEY || '';

  constructor() {
    if (!this.apiKey) {
      console.error('❌ Error: OpenWeather API key missing');
      throw new Error('Add an API_KEY to your .env file');
    }
  }

  private async fetchLocationData(city: string): Promise<any> {
    const geocodeQuery = this.buildGeocodeQuery(city); // ✅ Now using it!
    console.log("🔎 Fetching Location Data:", geocodeQuery);

    try {
      const response = await fetch(geocodeQuery);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch location data: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error(`❌ Location not found for "${city}". Please try again.`);
      }

      return data[0]; // Return first location result
    } catch (error) {
      console.error('❌ fetchLocationData error:', error);
      throw error;
    }
  }

  private buildGeocodeQuery(city: string): string {
    return `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`;
  }

  private destructureLocationData(locationData: any): Coordinates {
    return { lat: locationData.lat, lon: locationData.lon };
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    console.log(`Fetching and destructuring location data for ${city}`);
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    console.log("🌤️ Fetching Weather Data:", weatherQuery);

    try {
        const response = await fetch(weatherQuery);

        console.log("🔎 Raw Weather API Response:", response);

        if (!response.ok) {
            const errorText = await response.text(); // Capture error message
            console.error("❌ Weather API Error Response:", errorText);
            throw new Error(`Failed to fetch weather data: ${errorText}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("❌ Unexpected response format (not JSON). Check API Key and URL.");
        }

        return await response.json();
    } catch (error) {
        console.error('❌ fetchWeatherData error:', error);
        throw error;
    }
}


  private parseCurrentWeather(response: any): Weather {
    if (!response || !response.list || response.list.length === 0) {
      throw new Error("❌ No current weather data available.");
    }

    const data = response.list[0];
    const city = response.city?.name || "Unknown City";
    const date = data.dt_txt || "Unknown Date";
    const icon = data.weather?.[0]?.icon || "01d";
    const iconDescription = data.weather?.[0]?.description || "No description available";

    return new Weather(city, date, data.main.temp, data.main.humidity, data.wind.speed, icon, iconDescription);
  }

  private buildForecastArray(response: any): Weather[] {
    if (!response || !response.list || response.list.length < 6) {
      throw new Error("❌ Not enough forecast data available.");
    }

    return response.list.slice(1, 6).map((data: any) =>
      new Weather(
        response.city.name,
        data.dt_txt,
        data.main.temp,
        data.main.humidity,
        data.wind.speed,
        data.weather[0].icon,
        data.weather[0].description
      )
    );
  }

  async getWeatherForCity(city: string): Promise<{ current: Weather; forecast: Weather[] }> {
    console.log(`🌦️ Getting weather for ${city}`);
    
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherResponse = await this.fetchWeatherData(coordinates);

    const current = this.parseCurrentWeather(weatherResponse);
    const forecast = this.buildForecastArray(weatherResponse);

    return { current, forecast };
  }
}

export default new WeatherService();
