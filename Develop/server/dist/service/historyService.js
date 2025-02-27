import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
// TODO: Define a City class with name and id properties
class City {
    constructor(name) {
        this.id = uuidv4();
        this.name = name;
    }
}
// TODO: Complete the HistoryService class
class HistoryService {
    constructor() {
        this.filePath = path.join(process.cwd(), 'searchHistory.json');
    }
    // TODO: Define a read method that reads from the searchHistory.json file
    async read() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }
    // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
    async write(cities) {
        try {
            const data = JSON.stringify(cities, null, 2);
            await fs.writeFile(this.filePath, data, 'utf-8');
        }
        catch (error) {
            console.error('Error writing search history:', error);
            throw error;
        }
    }
    // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
    async getCities() {
        return await this.read();
    }
    // TODO Define an addCity method that adds a city to the searchHistory.json file
    async addCity(city) {
        const cities = await this.read();
        const newCity = new City(city);
        cities.push(newCity);
        await this.write(cities);
        return newCity;
    }
    // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
    async removeCity(id) {
        const cities = await this.read();
        const updatedCities = cities.filter(city => city.id !== id);
        await this.write(updatedCities);
    }
}
export default new HistoryService();
