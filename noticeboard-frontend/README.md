# Notice Board Frontend Application

This is a frontend-only version of the Notice Board application designed to connect to a Spring backend.

## Overview

The Notice Board application allows users to:
- Create and manage posts across various categories (Announcements, Events, etc.)
- Filter content by location (Amritsar, Jalandhar, Ludhiana, etc.)
- Save, like, and follow posts
- Comment on posts
- Customize notification preferences
- Manage profile and preferences

## Getting Started

### Prerequisites
- Node.js 18 or higher
- Your Spring backend running on port 8080 (or update the `.env` file with your backend URL)

### Installation

1. Install dependencies
```bash
npm install
```

2. Start the development server
```bash
npm run dev
```

3. Open your browser and navigate to http://localhost:3000

## Backend Integration

This frontend is designed to connect to a Spring backend at `http://localhost:8080/api`. If your backend uses a different URL, update the `.env` file:

```
VITE_API_BASE_URL=your-backend-url
```

## Authentication

The frontend uses JWT authentication with Bearer tokens. When users log in, the JWT token is stored in localStorage and used for subsequent API requests.

The application also supports OAuth authentication with Google and Apple.

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Main application pages
- `/src/contexts` - React contexts for state management
- `/src/lib` - Utility functions and API interactions
- `/src/hooks` - Custom React hooks

## Building for Production

To build the application for production:

```bash
npm run build
```

This will create a `dist` directory with optimized production-ready files.

## API Documentation

For a detailed list of all API endpoints expected by this frontend, refer to the `API_DOCUMENTATION.md` file in this repository.

## Features

1. **Authentication**
   - Login/Signup with email and password
   - OAuth with Google and Apple
   - JWT-based authentication

2. **Posts**
   - Create posts in various categories
   - Filter posts by category, location, or search term
   - View post details
   - Like, save, and follow posts

3. **User Profile**
   - Update profile information
   - Set visibility preferences (public/private)
   - Upload profile image

4. **Notifications**
   - Choose which categories to receive notifications for
   - Category preference selection

5. **Responsive Design**
   - Mobile-friendly interface
   - Adaptive layout for different screen sizes