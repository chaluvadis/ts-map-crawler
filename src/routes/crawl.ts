import { Router, Request, Response } from 'express';
import { fetchPlaces } from '../services/googleMaps';
import { savePlaces } from '../services/database';

const router = Router();

router.post('/crawl', async (req: Request, res: Response) => {
  try {
    const { location, radius } = req.body;
    
    if (!location || !radius) {
      res.status(400).json({ 
        error: 'Missing required parameters: location and radius' 
      });
      return;
    }
    
    const places = await fetchPlaces(location, radius);
    const savedCount = await savePlaces(places);
    
    res.status(201).json({ 
      message: 'Data saved successfully', 
      count: savedCount,
      total: places.length
    });
  } catch (error) {
    console.error('Error in /crawl endpoint:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
});

export default router;
