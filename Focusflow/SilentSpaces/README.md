# Focus Flow - Virtual Coworking Platform

**Developed by @sathvik.shetty**

A minimalist virtual coworking experience featuring themed focus zones with curated ambient audio and real-time presence tracking.

## Features

- 6 themed focus zones (Coffee Shop, Silent Library, Forest Retreat, Rainy Day, Lo-Fi Beats, White Noise)
- YouTube-integrated ambient soundscapes
- Real-time presence tracking and user activity
- Session management with duration tracking
- Coffee-inspired responsive design
- Smooth animations and modern UI

## Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS, Wouter Router
- **Backend:** Node.js, Express
- **Database:** In-memory storage with Drizzle ORM
- **State Management:** TanStack Query
- **UI Components:** Radix UI, Lucide Icons
- **Build Tool:** Vite

## Installation & Setup

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5000`

## Project Structure

```
├── client/          # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── lib/         # Utilities and helpers
│   │   └── hooks/       # Custom React hooks
├── server/          # Backend Express server
├── shared/          # Shared types and schemas
└── package.json     # Dependencies and scripts
```

## API Endpoints

- `GET /api/zones` - Get all focus zones
- `GET /api/presence` - Get real-time user presence
- `POST /api/checkin` - Check into a zone
- `POST /api/checkout` - Check out of current session

## Development

The app uses modern web development practices:
- TypeScript for type safety
- Zod for runtime validation
- React Query for server state management
- Tailwind for styling
- Hot module replacement for fast development

## License

© 2024 Focus Flow. Developed by @sathvik.shetty