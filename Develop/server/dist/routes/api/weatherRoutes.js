import { Router } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    try {
        const { city } = req.body;
            // TODO: GET weather data from city name
        const weatherData = await WeatherService.getWeatherData(city);
           // TODO: save city to search history
           await HistoryService.saveHistory(city);
        res.status(200).json(weatherData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }  
});

router.get('/history', async (req, res) => {
    try {
        const { city } = req.query;
        let weatherData = null;
        if (city) {
            weatherData = await WeatherService.getWeatherData(city);
            await HistoryService.saveHistory(city);
        }
        const history = await HistoryService.getHistory();
        res.status(200).json({ weatherData, history });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// * BONUS TODO: DELETE search history

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
    try {
        const {id } = req.params;
        await HistoryService.deleteCity(id);
        res.status(200).json({ message: 'City deleted from history' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
