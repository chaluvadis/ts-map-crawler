import express from 'express';
import dotenv from 'dotenv';
import { initializeDatabase } from './db/pool';
import crawlRouter from './routes/crawl';
import placesRouter from './routes/places';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(crawlRouter);
app.use(placesRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'Google Maps Crawler API',
    endpoints: {
      'POST /crawl': 'Crawl places from Google Maps (requires: location, radius)',
      'GET /places': 'Get all stored places (supports: ?limit=10&offset=0 for pagination)'
    }
  });
});

const startServer = async () => {
  try {
    await initializeDatabase();
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`API endpoints available at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
