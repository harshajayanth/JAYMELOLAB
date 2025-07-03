# JAYMELO SOUNDLAB - Music Portfolio Website

## Overview

This is a cinematic, animated music portfolio website for "JAYMELO SOUNDLAB" - the personal brand of Harsha Jayanth, a professional music producer with 5+ years of experience in creating soundscapes for films and web series. The application is built as a full-stack web application using React for the frontend, Express.js for the backend, and is designed with a dark, elegant, cinematic aesthetic featuring interactive animations and smooth user experience.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom CSS variables for brand colors
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Animations**: Framer Motion for cinematic animations, parallax effects, and scroll-triggered animations
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Development Server**: Custom Vite integration for hot module replacement
- **API Design**: RESTful API endpoints for projects, testimonials, and contact submissions
- **Data Storage**: In-memory storage with interface design for future database integration
- **Session Management**: Express sessions with PostgreSQL session store (configured but not actively used)

### Build System
- **Bundler**: Vite for frontend development and building
- **TypeScript**: Full TypeScript support with strict configuration
- **Module System**: ESM modules throughout the application
- **Development**: tsx for running TypeScript in development
- **Production**: esbuild for server bundling

## Key Components

### Frontend Components
1. **Navigation**: Refined floating header bar with rounded icons and glass morphism effect
2. **Hero Section**: Full-screen background with parallax effects and animated text
3. **Brands Section**: Horizontal scrolling logo marquee featuring trusted platforms
4. **Services Section**: Animated service cards with hover effects
5. **Portfolio Section**: Grid layout showcasing music projects with animations
6. **About Section**: Personal story with parallax images and statistics
7. **Testimonials Section**: Client testimonials with fade-in animations
8. **Booking Form**: Contact form with validation and animated feedback
9. **Waveform Component**: Custom animated music waveform visualizations
10. **Wave Divider**: Section divider with animated particles and gradients

### Backend Endpoints
- `GET /api/projects` - Retrieve all projects
- `GET /api/projects/featured` - Retrieve featured projects only
- `GET /api/projects/:id` - Retrieve single project by ID
- `GET /api/testimonials` - Retrieve all testimonials
- `GET /api/testimonials/featured` - Retrieve featured testimonials
- `POST /api/contact` - Submit contact form

### Database Schema
- **Users**: Basic user authentication structure
- **Projects**: Music projects with title, category, description, images, audio URLs, and tags
- **Testimonials**: Client testimonials with ratings and featured status
- **Contact Submissions**: Form submissions with service type and timestamps

## Data Flow

1. **Client Request**: User interacts with frontend components
2. **State Management**: TanStack Query manages API calls and caching
3. **API Communication**: Fetch requests to Express.js backend
4. **Data Processing**: Backend processes requests and interacts with storage layer
5. **Response Handling**: Frontend receives data and updates UI with animations
6. **Animation Triggers**: Framer Motion handles scroll-based and interaction-based animations

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver (configured for future use)
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animation library
- **react-hook-form**: Form handling
- **zod**: Runtime type validation

### UI Dependencies
- **@radix-ui/*****: Primitive UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for component variants
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type safety
- **tsx**: TypeScript execution
- **esbuild**: Fast bundler for production

## Deployment Strategy

### Development
- Run `npm run dev` to start development server with hot reloading
- Vite handles frontend development with proxy to Express backend
- TypeScript compilation and type checking in real-time

### Production Build
- `npm run build` creates optimized production build
- Frontend built to `dist/public` directory
- Backend bundled to `dist/index.js` with esbuild
- Static assets served by Express in production

### Database Migration
- Drizzle Kit configured for PostgreSQL migrations
- `npm run db:push` applies schema changes to database
- Environment variable `DATABASE_URL` required for database connection

### Environment Configuration
- Development: Uses in-memory storage for rapid prototyping
- Production: Configured for PostgreSQL with connection pooling
- Environment-specific configurations handled via NODE_ENV

Changelog:
```
- July 01, 2025. Initial setup
- July 01, 2025. Added refined floating navigation bar with rounded icons and glass morphism
- July 01, 2025. Added horizontal scrolling brands section with company logos (Spotify, Notion, etc.)
```

User Preferences:
```
Preferred communication style: Simple, everyday language.
```