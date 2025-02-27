import { Router } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    // TODO: GET weather data from city name
    try {
        const { city } = req.body;
        if (!city) {
            res.status(400).json({ message: 'City name is required' });
            return;
        }
        const weatherData = await WeatherService.getWeatherForCity(city);

    // TODO: save city to search history
        await HistoryService.addCity(city);

        res.status(200).json(weatherData);
    }
    catch (error) {
        console.error('Error getting weather data:', error);
        res.status(500).json({ message: error.message  });
    }
});
// TODO: GET search history
router.get('/history', async (req, res) => { 
    try {
        const cities = await HistoryService.getCities();
        res.status(200).json(cities);
    }
    catch (error) {
        console.error('Error getting search history:', error);
        res.status(500).json({ message: error.message });
    }
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await HistoryService.removeCity(id);
        res.status(200).json({ message: 'City removed from search history' });
    }
    catch (error) {
        console.error('Error removing city from search history:', error);
        res.status(500).json({ message: error.message });
    }
 });
export default router;
