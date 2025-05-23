# Notice Board Frontend-Only Setup

This document provides instructions for setting up just the frontend part of the Notice Board application, designed to connect to your existing Spring backend.

## Project Structure

The frontend code is located in the `/client` directory. This is the only part you need to deploy if you're using a separate Spring backend.

## Configuration

1. Update the API URL in `/client/.env`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```
Replace with your actual Spring backend URL.

2. The frontend is already configured to:
   - Use JWT authentication with Bearer tokens
   - Connect to all the API endpoints documented in `API_DOCUMENTATION.md`
   - Handle user authentication, posts, comments, and other features

## Running the Frontend Only

To run just the frontend:

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Building for Production

To build the frontend for production:

```bash
cd client
npm run build
```

This will create a `dist` directory with static files that can be served by any web server.

## API Integration

The frontend expects your Spring backend to provide the API endpoints described in `API_DOCUMENTATION.md`. The main integration points are:

1. Authentication via JWT tokens
2. OAuth integrations (Google, Apple)
3. CRUD operations for posts, comments, likes, etc.
4. User preferences and profile management

All API calls are handled through the files in `client/src/lib/`, particularly:
- `api.ts`: Central API service functions
- `auth.ts`: Authentication-related functions
- `queryClient.ts`: Configuration for data fetching

If your Spring backend uses different API paths or response formats, you may need to adjust these files to match your implementation.