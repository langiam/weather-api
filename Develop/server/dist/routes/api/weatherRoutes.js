import { Router } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    try {
        const { city } = req.body;
        if (!city) {
            res.status(400).json({ message: 'City name is required' });
            return;
        }
        // TODO: GET weather data from city name
        const weatherData = await WeatherService.getWeatherForCity(city);
        // TODO: save city to search history
        await HistoryService.addCity(city);
        res.status(200).json(weatherData);
    }
    catch (error) {
        console.error('Error fetching weather data', error);
        res.status(500).json({ message: error instanceof Error ? error.message : 'Internal server error' });
    }
});
// TODO: GET search history
router.get('/history', async (_req, res) => {
    try {
        const history = await HistoryService.getCities();
        res.status(200).json(history);
    }
    catch (error) {
        console.error('Error fetching search history', error);
        res.status(500).json({ message: error instanceof Error ? error.message : 'Internal server error' });
    }
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await HistoryService.removeCity(id);
        res.status(200).json({ message: 'City deleted from search history' });
    }
    catch (error) {
        console.error('Error deleting city from search history', error);
        res.status(500).json({ message: error instanceof Error ? error.message : 'Internal server error' });
    }
});
export default router;
