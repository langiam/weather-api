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
// TODO: Define the baseURL, API key, and city name properties
// TODO: Create fetchLocationData method
// private async fetchLocationData(query: string) {}

class WeatherService {
  // Define the baseURL and API key properties
  private baseURL: string = 'https://api.openweathermap.org/data/2.5/';
  private apiKey: string = process.env.WEATHER_API_KEY || '';

  // Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    try {
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error(`Failed to fetch location data: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error: unknown) {
      console.error('fetchLocationData error:', error);
      throw error;
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    // Assuming locationData is an array with at least one result
    const { lat, lon } = locationData[0];
    return { lat, lon };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
        return `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
     return `${this.baseURL}forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const geocodeQuery = this.buildGeocodeQuery(city);
    const locationData = await this.fetchLocationData(geocodeQuery);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    try {
      const response = await fetch(weatherQuery);
      if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`);
      }
      const weatherData = await response.json();
      return weatherData;
    } catch (error) {
      console.error('fetchWeatherData error:', error);
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
    return weatherData.map((data: any) => {
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
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherResponse = await this.fetchWeatherData(coordinates);
    const current = this.parseCurrentWeather(weatherResponse);
    const forecast = this.buildForecastArray(weatherResponse.list);
    return { current, forecast };
  }
}

export default new WeatherService();
