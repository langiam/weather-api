import dotenv from 'dotenv';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import weatherRoutes from './routes/api/weatherRoutes.js';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
// Import the routes

// TODO: Serve static files of entire client dist folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

app.use(express.static(clientDistPath));

// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(cors());
app.options('*', (_req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: Implement middleware to connect the routes
app.use('/api/weather', weatherRoutes);


app.get('*', (_req, res) => {
    const indexPath = path.resolve(clientDistPath, 'index.html');

    if (!fs.existsSync(indexPath)) {  
        console.error('❌ Error: Frontend build missing (client/dist/index.html not found)');
        return res.status(500).send('Error: Frontend is not built. Please run `npm run build` in the client directory.');
    }

    res.sendFile(indexPath);
});

app.use((err, req, res, _next) => {
    console.error(`❌ Server Error at ${req.path}:`, err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
