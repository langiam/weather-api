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
// TODO: Define the baseURL, API key, and city name properties
// TODO: Create fetchLocationData method
// private async fetchLocationData(query: string) {}
class WeatherService {
    constructor() {
        // Define the baseURL and API key properties
        this.baseURL = 'https://api.openweathermap.org/data/2.5/';
        this.apiKey = process.env.WEATHER_API_KEY || '';
    }
    // Create fetchLocationData method
    async fetchLocationData(query) {
        try {
            const response = await fetch(query);
            if (!response.ok) {
                throw new Error(`Failed to fetch location data: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error('fetchLocationData error:', error);
            throw error;
        }
    }
    // TODO: Create destructureLocationData method
    destructureLocationData(locationData) {
        // Assuming locationData is an array with at least one result
        const { lat, lon } = locationData[0];
        return { lat, lon };
    }
    // TODO: Create buildGeocodeQuery method
    buildGeocodeQuery(city) {
        return `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`;
    }
    // TODO: Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        return `${this.baseURL}forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
    }
    // TODO: Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData(city) {
        const geocodeQuery = this.buildGeocodeQuery(city);
        const locationData = await this.fetchLocationData(geocodeQuery);
        return this.destructureLocationData(locationData);
    }
    // TODO: Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        const weatherQuery = this.buildWeatherQuery(coordinates);
        try {
            const response = await fetch(weatherQuery);
            if (!response.ok) {
                throw new Error(`Failed to fetch weather data: ${response.statusText}`);
            }
            const weatherData = await response.json();
            return weatherData;
        }
        catch (error) {
            console.error('fetchWeatherData error:', error);
            throw error;
        }
    }
    // TODO: Build parseCurrentWeather method
    parseCurrentWeather(response) {
        return weatherData.slice(1).map((data) => {
            const temperature = data.main.temp;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const description = data.weather[0].description;
            return new Weather(temperature, humidity, windSpeed, description);
        });
    }
    // TODO: Complete buildForecastArray method
    buildForecastArray(weatherData) {
        return weatherData.slice(1).map((data) => {
            const temperature = data.main.temp;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const description = data.weather[0].description;
            return new Weather(temperature, humidity, windSpeed, description);
        });
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city) {
        const coordinates = await this.fetchAndDestructureLocationData(city);
        const weatherResponse = await this.fetchWeatherData(coordinates);
        const current = this.parseCurrentWeather(weatherResponse);
        const forecast = this.buildForecastArray(current, weatherResponse.list);
        return { current, forecast };
    }
}
export default new WeatherService();
