# Notice Board Application

This repository contains a full-stack web application for a community notice board platform. Users can post announcements, events, and other content based on categories and location.

## Overview

The Notice Board application allows users to:
- Create and manage posts across various categories
- Filter content by location
- Save, like, and follow posts
- Comment on posts
- Customize notification preferences
- Manage their profile and preferences

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React with TypeScript
- **UI Components**: Custom UI components built with Radix UI primitives and styled with Tailwind CSS
- **State Management**: React Query for server state, React Context for auth state
- **Routing**: Wouter for lightweight client-side routing

### Backend
- **Framework**: Express.js with TypeScript
- **API**: RESTful API architecture
- **Authentication**: JWT-based authentication with optional OAuth strategies (Google, Apple)
- **Database Access**: Drizzle ORM for type-safe database operations

### Database
- **ORM**: Drizzle ORM
- **Connection**: Using Neon Serverless Postgres connection via `@neondatabase/serverless`
- **Schema**: Defined in the shared schema file with tables for users, posts, comments, categories, etc.

## Key Components

### Frontend Components
1. **Authentication**
   - Login/Signup forms
   - OAuth integration
   - Auth context provider

2. **Layout Components**
   - Header with navigation
   - Side menu (for desktop)
   - Bottom navigation (for mobile)

3. **Post Components**
   - Post cards for listing
   - Detailed post view
   - Category filters
   - Location filters

4. **User Settings**
   - Profile management
   - Notification preferences
   - Category selection

### Backend Components
1. **API Routes**
   - Auth routes (login, register, OAuth callbacks)
   - Post routes (CRUD operations, likes, comments)
   - User routes (profile, preferences)
   - Category routes

2. **Middleware**
   - Authentication middleware
   - Validation middleware using Zod
   - Error handling middleware

3. **Controllers**
   - Business logic for handling requests
   - Data manipulation before storage

4. **Storage Layer**
   - Database operations abstracted through a storage interface
   - Transaction handling

## Data Flow

1. **Authentication Flow**:
   - User submits credentials → Backend validates → JWT token generated → Token stored in frontend → Authenticated requests include token

2. **Post Creation Flow**:
   - User creates post → Validated on frontend → Sent to backend → Validated again → Stored in database → Updated feed shown to users

3. **Content Discovery Flow**:
   - User selects location/category → Request sent to backend → Posts filtered by criteria → Returned to frontend → Displayed in feed

## External Dependencies

### Frontend Dependencies
- `@radix-ui/*`: UI primitives for accessible components
- `@tanstack/react-query`: For server state management
- `class-variance-authority`: For UI component variants
- `wouter`: Lightweight routing
- `react-hook-form`: Form handling with validation
- `zod`: Schema validation

### Backend Dependencies
- `express`: Web server framework
- `@neondatabase/serverless`: PostgreSQL client
- `drizzle-orm`: ORM for database operations
- `passport`: Authentication middleware
- `jsonwebtoken`: JWT token generation/validation
- `bcryptjs`: Password hashing
- `cors`: Cross-origin resource sharing

## Deployment Strategy

The application is set up for deployment on Replit with:

1. **Build Process**:
   - Frontend: Built with Vite
   - Backend: Bundled with esbuild
   - Combined into a single deployment package

2. **Runtime Configuration**:
   - Environment variables for sensitive configuration
   - Production vs Development modes
   - Static asset serving

3. **Database Connection**:
   - Connection to PostgreSQL database via environment variables
   - Drizzle migrations for schema changes

4. **Scaling Considerations**:
   - Stateless authentication for horizontal scaling
   - In-memory session store (could be replaced with Redis for production)
   - Caching opportunities in API responses

## Getting Started

1. **Prerequisites**:
   - Node.js environment
   - PostgreSQL database (or Neon Serverless PostgreSQL)
   - Required environment variables:
     - `DATABASE_URL`: PostgreSQL connection string
     - `JWT_SECRET`: Secret for signing JWT tokens
     - `SESSION_SECRET`: Secret for session cookies

2. **Development**:
   - Run `npm run dev` to start the development server
   - Backend API is accessible at `/api/*`
   - Frontend is served at the root path

3. **Production Build**:
   - Run `npm run build` to build the application
   - Run `npm run start` to start the production server