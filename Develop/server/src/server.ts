import dotenv from 'dotenv';
import path from 'node:path';
import express from 'express'
import weatherRoutes from './routes/api/weatherRoutes.js';
import { fileURLToPath } from 'node:url';
import { Request, Response } from 'express';

dotenv.config();


// Import the routes
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use('/api/weather', weatherRoutes); 

// TODO: Implement middleware to connect the routes
app.use(routes);

app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
}
);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
