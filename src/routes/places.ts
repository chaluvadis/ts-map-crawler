import { Router, Request, Response } from 'express';
import { getAllPlaces, getPlacesPaginated } from '../services/database';

const router = Router();

router.get('/places', async (req: Request, res: Response) => {
  try {
    const { limit, offset } = req.query;
    
    if (limit !== undefined || offset !== undefined) {
      const limitNum = limit ? parseInt(limit as string) : 10;
      const offsetNum = offset ? parseInt(offset as string) : 0;
      
      const result = await getPlacesPaginated(limitNum, offsetNum);
      res.status(200).json({
        data: result.data,
        pagination: {
          total: result.total,
          limit: limitNum,
          offset: offsetNum
        }
      });
    } else {
      const places = await getAllPlaces();
      res.status(200).json(places);
    }
  } catch (error) {
    console.error('Error in /places endpoint:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
});

export default router;
