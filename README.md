# Expense Tracker App

A full-stack expense tracking application.

## Features

- **Auth**: OAuth2 authentication with Kinde Auth
- **Protected Routes**: Frontend and backend route protection for authenticated users
- **Real-time Updates**: Optimistic updates with React Query
- **Modern UI**: Responsive design with Shadcn/ui and Tailwind CSS
- **Type Safety**: End-to-end type safety with TypeScript, RPC and Zod
- **Database Security**: Secure PostgreSQL operations with Drizzle ORM

## Tech Stack

### Frontend
- **React** (v19)
- **TanStack Suite**:
  - React Query
  - React Router
  - React Table
  - React Form
- **Tailwind CSS**
- **Vite**
- **TypeScript**
- **Shadcn/ui**
- **Lucide React**
- **Date-fns**

### Backend
- **Hono**
- **Bun**
- **PostgreSQL**
- **Drizzle ORM**
- **Kinde Auth**
- **Zod**

## Getting Started

### Installation

1. Clone and install dependencies:

```bash
git clone [repository-url]
cd expense-tracker

# Frontend setup
cd frontend
bun install

# Backend setup
cd backend
bun install
```

2. Configure environment variables:

```env
# Frontend (.env)
VITE_API_URL=http://localhost:3000
VITE_KINDE_CLIENT_ID=your_kinde_client_id
VITE_KINDE_DOMAIN=your_kinde_domain

# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/expense_tracker
KINDE_CLIENT_ID=your_kinde_client_id
KINDE_CLIENT_SECRET=your_kinde_client_secret
KINDE_DOMAIN=your_kinde_domain
```

3. Run migrations:
```bash
cd backend
bun run migrate
```

### Development

Start the servers:
```bash
# Terminal 1 - Backend
cd backend
bun run dev

# Terminal 2 - Frontend
cd frontend
bun run dev
```

Access the app at `http://localhost:5173`

## Secure Routes

### Frontend Protected Routes
All routes under `/_authenticated/*` are protected and require authentication:
```
/_authenticated/
├── create-expense  # Create new expenses
├── expenses       # View and manage expenses
├── profile       # User profile management
└── index         # Dashboard
```

### Backend API Security
API endpoints are protected with Kinde Auth middleware:
```
/api/
├── auth/
│   ├── login     # Authentication endpoints
│   └── logout
└── expenses/
    ├── GET /     # List expenses (protected)
    ├── POST /    # Create expense (protected)
    ├── GET /:id  # Get expense details (protected)
    └── DELETE /:id # Delete expense (protected)
```

## Project Structure

```
expense-tracker/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── routes/
│   │   └── App.tsx
│   └── package.json
└── backend/
    ├── src/
    │   ├── routes/
    │   ├── db/
    │   └── index.ts
    └── package.json
```

## Available Scripts

### Frontend
```bash
bun run dev       # Start dev server
bun run build     # Build for production
bun run lint      # Run ESLint
bun run preview   # Preview production build
```

### Backend
```bash
bun run dev       # Start dev server with watch
bun run generate  # Generate Drizzle migrations
bun run migrate   # Apply migrations
```

## License

MIT License
