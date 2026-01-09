# Test Script for ts-map-crawler

This document outlines manual testing steps for the application.

## Prerequisites
1. PostgreSQL running and accessible
2. Valid Google Maps API key
3. Environment variables configured in `.env`

## Testing Steps

### 1. Database Initialization
```bash
npm run db:init
```
Expected: Database table `places_data` created successfully.

### 2. Start the Server
```bash
npm run dev
```
Expected: Server starts on configured port (default: 3000).

### 3. Test Root Endpoint
```bash
curl http://localhost:3000/
```
Expected Response:
```json
{
  "message": "Google Maps Crawler API",
  "endpoints": {
    "POST /crawl": "Crawl places from Google Maps (requires: location, radius)",
    "GET /places": "Get all stored places (supports: ?limit=10&offset=0 for pagination)"
  }
}
```

### 4. Test Crawl Endpoint
```bash
curl -X POST http://localhost:3000/crawl \
  -H "Content-Type: application/json" \
  -d '{
    "location": "37.7749,-122.4194",
    "radius": 1000
  }'
```
Expected Response:
```json
{
  "message": "Data saved successfully",
  "count": <number>,
  "total": <number>
}
```

### 5. Test Places Endpoint (All)
```bash
curl http://localhost:3000/places
```
Expected: Array of all saved places.

### 6. Test Places Endpoint (Paginated)
```bash
curl "http://localhost:3000/places?limit=5&offset=0"
```
Expected Response:
```json
{
  "data": [ /* array of 5 places */ ],
  "pagination": {
    "total": <total_count>,
    "limit": 5,
    "offset": 0
  }
}
```

### 7. Test Error Handling - Missing Parameters
```bash
curl -X POST http://localhost:3000/crawl \
  -H "Content-Type: application/json" \
  -d '{}'
```
Expected Response:
```json
{
  "error": "Missing required parameters: location and radius"
}
```

### 8. Test Pagination Validation
```bash
curl "http://localhost:3000/places?limit=-5&offset=-10"
```
Expected: Defaults to valid positive values (limit: 10, offset: 0).

## Database Verification
Check the database directly:
```sql
SELECT COUNT(*) FROM places_data;
SELECT data->>'name' as name, data->>'rating' as rating FROM places_data LIMIT 10;
```

## Performance Notes
- Bulk insert uses a single transaction for efficiency
- GIN index on JSONB column enables fast queries
- Connection pooling manages database connections efficiently
