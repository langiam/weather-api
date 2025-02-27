import dotenv from 'dotenv';
import path from 'node:path';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import weatherRoutes from './routes/api/weatherRoutes.js';


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
    } else if (req.path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
    }
    next();
});


app.use(express.static(path.resolve(__dirname, '../client/dist')));

// TODO: Implement middleware to connect the routes
app.use('/api/weather', weatherRoutes); 

app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
