import { pool } from '../db/pool';
import { Place } from './googleMaps';

export const savePlace = async (data: Place): Promise<void> => {
  const client = await pool.connect();
  try {
    const query = 'INSERT INTO places_data (data) VALUES ($1)';
    await client.query(query, [JSON.stringify(data)]);
  } catch (error) {
    console.error('Error saving place:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const savePlaces = async (places: Place[]): Promise<number> => {
  let savedCount = 0;
  for (const place of places) {
    try {
      await savePlace(place);
      savedCount++;
    } catch (error) {
      console.error('Failed to save place:', error);
    }
  }
  return savedCount;
};

export const getAllPlaces = async (): Promise<Place[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT data FROM places_data ORDER BY created_at DESC');
    return result.rows.map(row => row.data);
  } catch (error) {
    console.error('Error retrieving places:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getPlacesPaginated = async (
  limit: number = 10,
  offset: number = 0
): Promise<{ data: Place[]; total: number }> => {
  const client = await pool.connect();
  try {
    const dataQuery = 'SELECT data FROM places_data ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    const countQuery = 'SELECT COUNT(*) FROM places_data';
    
    const [dataResult, countResult] = await Promise.all([
      client.query(dataQuery, [limit, offset]),
      client.query(countQuery)
    ]);
    
    return {
      data: dataResult.rows.map(row => row.data),
      total: parseInt(countResult.rows[0].count)
    };
  } catch (error) {
    console.error('Error retrieving paginated places:', error);
    throw error;
  } finally {
    client.release();
  }
};
