import fs from 'fs';
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

    async read() {
        try {
          const data = await fs.readFile(this.filePath, 'utf8');
          return JSON.parse(data);
        } catch (error) {
          if (error.code === 'ENOENT') {
            return [];
          }
          throw error;
        }
      }
      
      async write(cities) {
        try {
          const data = JSON.stringify(cities, null, 2);
          await fs.writeFile(this.filePath, data, 'utf8');
        } catch (error) {
          console.error('Error writing to searchHistory.json:', error);
          throw error;
        }
      }
    

   
    async getCities() {
        return await this.read();
    }



    async addCity(cityName) {
        const cities = await this.read();
        const newCity = new City(cityName);
        cities.push(newCity);
        await this.write(cities);
        return newCity;
      }
    

      async removeCity(id) {
        const cities = await this.read();
        const updatedCities = cities.filter(city => city.id !== id);
        await this.write(updatedCities);
      }
    }
    

export default new HistoryService();
