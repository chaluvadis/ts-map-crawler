# ts-map-crawler

Google Maps web crawler with PostgreSQL storage and REST API

## Features

- 🗺️ **Google Maps Integration**: Fetch places data using Google Maps Places API
- 🗄️ **PostgreSQL Storage**: Store fetched data as JSONB documents for flexible querying
- 🚀 **REST API**: Simple HTTP endpoints to crawl and retrieve data
- 📦 **TypeScript**: Fully typed for better development experience

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Google Maps API Key with Places API enabled

## Installation

1. Clone the repository:
```bash
git clone https://github.com/chaluvadis/ts-map-crawler.git
cd ts-map-crawler
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
# Database Configuration
PGHOST=localhost
PGPORT=5432
PGDATABASE=maps_crawler
PGUSER=postgres
PGPASSWORD=your_password

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Server Configuration
PORT=3000
```

4. Initialize the database:
```bash
npm run db:init
```

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## API Endpoints

### Root Endpoint
```
GET /
```
Returns API information and available endpoints.

### Crawl Places
```
POST /crawl
```

**Request Body:**
```json
{
  "location": "37.7749,-122.4194",
  "radius": 1000
}
```

**Parameters:**
- `location` (string): Latitude,longitude coordinates (e.g., "37.7749,-122.4194")
- `radius` (number): Search radius in meters (e.g., 1000)

**Response:**
```json
{
  "message": "Data saved successfully",
  "count": 20,
  "total": 20
}
```

### Get Places
```
GET /places
```

**Query Parameters (optional):**
- `limit` (number): Number of results per page (default: 10)
- `offset` (number): Number of results to skip (default: 0)

**Examples:**

Get all places:
```
GET /places
```

Get paginated results:
```
GET /places?limit=10&offset=0
```

**Response (with pagination):**
```json
{
  "data": [
    {
      "place_id": "ChIJ...",
      "name": "Golden Gate Bridge",
      "vicinity": "San Francisco",
      "rating": 4.8,
      ...
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0
  }
}
```

## Database Schema

The application creates a `places_data` table with the following structure:

```sql
CREATE TABLE places_data (
  id SERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_places_data ON places_data USING GIN (data);
```

## Project Structure

```
ts-map-crawler/
├── src/
│   ├── db/
│   │   ├── pool.ts          # Database connection pool
│   │   └── init.ts          # Database initialization script
│   ├── services/
│   │   ├── googleMaps.ts    # Google Maps API integration
│   │   └── database.ts      # Database operations
│   ├── routes/
│   │   ├── crawl.ts         # Crawl endpoint
│   │   └── places.ts        # Places endpoint
│   └── index.ts             # Main application entry point
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Technologies Used

- **TypeScript**: Type-safe JavaScript
- **Node.js**: Runtime environment
- **Express**: Web framework
- **PostgreSQL**: Database
- **pg**: PostgreSQL client for Node.js
- **axios**: HTTP client for API requests
- **dotenv**: Environment variable management

## License

ISC
