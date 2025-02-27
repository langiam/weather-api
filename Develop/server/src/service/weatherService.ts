import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;

  constructor(temperature: number, humidity: number, windSpeed: number, description: string) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.description = description;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // Define the baseURL and API key properties
  private baseURL: string = 'https://api.openweathermap.org/data/2.5/';
  private apiKey: string = process.env.API_KEY || '';

  constructor() {
    if (!this.apiKey) {
      console.error('❌ Error: OpenWeather API key missing');
      throw new Error('Add an API_KEY to your .env file');
    }
  }

  async fetchLocationData(city: string): Promise<any> {
    const geocodeQuery = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`;
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
      return data; 
    } catch (error: unknown) {
      console.error('❌ fetchLocationData error:', error);
      throw error;
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    // Extract lat/lon from the first element of the array
    const { lat, lon } = locationData[0];
    return { lat, lon };
  }

// @ts-ignore: Unused function for future use.
private buildGeocodeQuery(city: string): string {
  return `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`;
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
      if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ fetchWeatherData error:', error);
      throw error;
    }
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const data = response.list[0];
    return new Weather(
      data.main.temp,
      data.main.humidity,
      data.wind.speed,
      data.weather[0].description
    );
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData.slice(1, 6).map((data: any) => {
      return new Weather(
        data.main.temp,
        data.main.humidity,
        data.wind.speed,
        data.weather[0].description
      );
    });
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<{ current: Weather; forecast: Weather[] }> {
    console.log(`🌦️ Getting weather for ${city}`);
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherResponse = await this.fetchWeatherData(coordinates);
    const current = this.parseCurrentWeather(weatherResponse);
    const forecast = this.buildForecastArray(weatherResponse.list);
    return { current, forecast };
  }
}

export default new WeatherService();
