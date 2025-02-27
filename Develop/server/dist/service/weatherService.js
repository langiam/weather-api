import dotenv from 'dotenv';
dotenv.config();
// TODO: Define a class for the Weather object
class Weather {
    constructor(temperature, humidity, windSpeed, description) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
        this.description = description;
    }
}
// TODO: Complete the WeatherService class
class WeatherService {
    constructor() {
        // Define the baseURL and API key properties
        this.baseURL = 'https://api.openweathermap.org/data/2.5/';
        this.apiKey = process.env.API_KEY || '';
        if (!this.apiKey) {
            console.error('❌ Error: OpenWeather API key missing');
            throw new Error('Add an API_KEY to your .env file');
        }
    }
    async fetchLocationData(city) {
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
        }
        catch (error) {
            console.error('❌ fetchLocationData error:', error);
            throw error;
        }
    }
    // TODO: Create destructureLocationData method
    destructureLocationData(locationData) {
        // Extract lat/lon from the first element of the array
        const { lat, lon } = locationData[0];
        return { lat, lon };
    }
    // @ts-ignore: Unused function for future use.
    buildGeocodeQuery(city) {
        return `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`;
    }
    buildWeatherQuery(coordinates) {
        return `${this.baseURL}forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
    }
    async fetchAndDestructureLocationData(city) {
        console.log(`Fetching and destructuring location data for ${city}`);
        const locationData = await this.fetchLocationData(city);
        return this.destructureLocationData(locationData);
    }
    async fetchWeatherData(coordinates) {
        const weatherQuery = this.buildWeatherQuery(coordinates);
        console.log("🌤️ Fetching Weather Data:", weatherQuery);
        try {
            const response = await fetch(weatherQuery);
            if (!response.ok) {
                throw new Error(`Failed to fetch weather data: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error('❌ fetchWeatherData error:', error);
            throw error;
        }
    }
    // TODO: Build parseCurrentWeather method
    parseCurrentWeather(response) {
        const data = response.list[0];
        return new Weather(data.main.temp, data.main.humidity, data.wind.speed, data.weather[0].description);
    }
    // TODO: Complete buildForecastArray method
    buildForecastArray(weatherData) {
        return weatherData.slice(1, 6).map((data) => {
            return new Weather(data.main.temp, data.main.humidity, data.wind.speed, data.weather[0].description);
        });
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city) {
        console.log(`🌦️ Getting weather for ${city}`);
        const coordinates = await this.fetchAndDestructureLocationData(city);
        const weatherResponse = await this.fetchWeatherData(coordinates);
        const current = this.parseCurrentWeather(weatherResponse);
        const forecast = this.buildForecastArray(weatherResponse.list);
        return { current, forecast };
    }
}
export default new WeatherService();
