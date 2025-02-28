import dotenv from 'dotenv';
dotenv.config();
// TODO: Define a class for the Weather object
class Weather {
    constructor(city, date, temperature, humidity, windSpeed, icon, iconDescription) {
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
    constructor() {
        this.baseURL = 'https://api.openweathermap.org/data/2.5/';
        this.apiKey = process.env.API_KEY || '';
        if (!this.apiKey) {
            console.error('❌ Error: OpenWeather API key missing');
            throw new Error('Add an API_KEY to your .env file');
        }
    }
    async fetchLocationData(city) {
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
        }
        catch (error) {
            console.error('❌ fetchLocationData error:', error);
            throw error;
        }
    }
    buildGeocodeQuery(city) {
        return `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`;
    }
    destructureLocationData(locationData) {
        return { lat: locationData.lat, lon: locationData.lon };
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
        }
        catch (error) {
            console.error('❌ fetchWeatherData error:', error);
            throw error;
        }
    }
    parseCurrentWeather(response) {
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
    buildForecastArray(response) {
        if (!response || !response.list || response.list.length < 6) {
            throw new Error("❌ Not enough forecast data available.");
        }
        return response.list.slice(1, 6).map((data) => new Weather(response.city.name, data.dt_txt, data.main.temp, data.main.humidity, data.wind.speed, data.weather[0].icon, data.weather[0].description));
    }
    async getWeatherForCity(city) {
        console.log(`🌦️ Getting weather for ${city}`);
        const coordinates = await this.fetchAndDestructureLocationData(city);
        const weatherResponse = await this.fetchWeatherData(coordinates);
        const current = this.parseCurrentWeather(weatherResponse);
        const forecast = this.buildForecastArray(weatherResponse);
        return { current, forecast };
    }
}
export default new WeatherService();
