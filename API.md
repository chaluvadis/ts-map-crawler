# API Documentation

## Base URL
```
http://localhost:3000
```

## Endpoints

### 1. Get API Information
Returns information about available endpoints.

**Endpoint:** `GET /`

**Response:**
```json
{
  "message": "Google Maps Crawler API",
  "endpoints": {
    "POST /crawl": "Crawl places from Google Maps (requires: location, radius)",
    "GET /places": "Get all stored places (supports: ?limit=10&offset=0 for pagination)"
  }
}
```

**Status Codes:**
- `200 OK`: Success

---

### 2. Crawl Places
Fetches places from Google Maps API and saves them to the database.

**Endpoint:** `POST /crawl`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "location": "37.7749,-122.4194",
  "radius": 1000
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| location | string | Yes | Latitude and longitude in the format "lat,lng" (e.g., "37.7749,-122.4194") |
| radius | number | Yes | Search radius in meters (maximum depends on Google Maps API limits) |

**Success Response:**
```json
{
  "message": "Data saved successfully",
  "count": 20,
  "total": 20
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| message | string | Success message |
| count | number | Number of places successfully saved to database |
| total | number | Total number of places returned by Google Maps API |

**Error Responses:**

400 Bad Request - Missing parameters:
```json
{
  "error": "Missing required parameters: location and radius"
}
```

500 Internal Server Error - API or database error:
```json
{
  "error": "Failed to fetch places: <error message>"
}
```

**Status Codes:**
- `201 Created`: Places successfully crawled and saved
- `400 Bad Request`: Missing or invalid parameters
- `500 Internal Server Error`: API or database error

**Example:**
```bash
curl -X POST http://localhost:3000/crawl \
  -H "Content-Type: application/json" \
  -d '{
    "location": "37.7749,-122.4194",
    "radius": 1000
  }'
```

---

### 3. Get Places
Retrieves stored places from the database.

**Endpoint:** `GET /places`

**Query Parameters (Optional):**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | number | No | 10 | Number of results to return per page (minimum: 1) |
| offset | number | No | 0 | Number of results to skip (minimum: 0) |

**Success Response (without pagination parameters):**
```json
[
  {
    "place_id": "ChIJIQBpAG2ahYAR_6128GcTUEo",
    "name": "Golden Gate Bridge",
    "vicinity": "San Francisco",
    "geometry": {
      "location": {
        "lat": 37.8199,
        "lng": -122.4783
      }
    },
    "rating": 4.8,
    "user_ratings_total": 150000,
    "types": ["tourist_attraction", "point_of_interest"],
    "business_status": "OPERATIONAL"
  }
]
```

**Success Response (with pagination parameters):**
```json
{
  "data": [
    {
      "place_id": "ChIJIQBpAG2ahYAR_6128GcTUEo",
      "name": "Golden Gate Bridge",
      "vicinity": "San Francisco",
      "geometry": {
        "location": {
          "lat": 37.8199,
          "lng": -122.4783
        }
      },
      "rating": 4.8,
      "user_ratings_total": 150000,
      "types": ["tourist_attraction", "point_of_interest"],
      "business_status": "OPERATIONAL"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0
  }
}
```

**Response Fields (with pagination):**
| Field | Type | Description |
|-------|------|-------------|
| data | array | Array of place objects |
| pagination.total | number | Total number of places in database |
| pagination.limit | number | Number of results per page |
| pagination.offset | number | Number of results skipped |

**Error Response:**
```json
{
  "error": "Internal server error"
}
```

**Status Codes:**
- `200 OK`: Success
- `500 Internal Server Error`: Database error

**Examples:**

Get all places:
```bash
curl http://localhost:3000/places
```

Get first 5 places:
```bash
curl "http://localhost:3000/places?limit=5&offset=0"
```

Get next 5 places (pagination):
```bash
curl "http://localhost:3000/places?limit=5&offset=5"
```

---

## Data Models

### Place Object
The place object structure follows the Google Maps Places API response format:

```typescript
{
  place_id?: string;           // Unique identifier for the place
  name?: string;               // Human-readable name of the place
  vicinity?: string;           // Simplified address
  geometry?: {
    location?: {
      lat?: number;            // Latitude
      lng?: number;            // Longitude
    };
  };
  rating?: number;             // Average rating (0-5)
  user_ratings_total?: number; // Total number of ratings
  types?: string[];            // Array of place types
  business_status?: string;    // Business operational status
  // Additional fields may be present depending on the place
}
```

## Rate Limits
Google Maps API has rate limits. Refer to your Google Cloud Console for your specific quotas.

## Error Handling
All endpoints return appropriate HTTP status codes and error messages in JSON format:

```json
{
  "error": "Error message describing what went wrong"
}
```

## Notes
- Invalid pagination parameters (negative numbers, NaN) are automatically corrected to safe defaults
- The database stores places as JSONB, allowing flexible queries on the stored data
- A GIN index is created on the data column for efficient JSONB queries
