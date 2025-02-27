import dotenv from 'dotenv';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import weatherRoutes from './routes/api/weatherRoutes.js';
import fs from 'fs';
dotenv.config();
// Import the routes
const app = express();
const PORT = process.env.PORT || 3001;
// TODO: Serve static files of entire client dist folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(cors());
app.options('*', (_req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    if (req.path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
    }
    else if (req.path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
    }
    next();
});
app.use(express.static(path.resolve(__dirname, '../../client/dist')));
// TODO: Implement middleware to connect the routes
app.use('/api/weather', weatherRoutes);
app.get('*', (_req, res) => {
    const indexPath = path.resolve(__dirname, '../../client/dist/index.html');
    if (!fs.existsSync(indexPath)) {
        console.error('❌ Error: Frontend build missing (client/dist/index.html not found)');
        return res.status(500).send({
            error: 'Frontend build missing',
            message: 'Please run `npm run build` in the client directory before starting the server.',
        });
    }
    return res.sendFile(indexPath);
});
app.use((err, _req, res, _next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});
// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
