# Surgery Care Foundation — Frontend

A Next.js frontend for a medical crowdfunding platform that connects patients in need of surgery with donors.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI:** Custom components with clsx + tailwind-merge

## Getting Started

### Prerequisites

- Node.js 18+

### Setup

```bash
# Install dependencies
npm install

# Copy env file and configure
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm run dev
```

The app runs at `http://localhost:3000`.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8080/api/v1` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/
│   ├── (admin)/        # Admin panel pages
│   ├── (dashboard)/    # User dashboard pages
│   └── (public)/       # Public-facing pages
├── components/
│   ├── home/           # Homepage components
│   ├── layout/         # Layout components (header, sidebar)
│   ├── shared/         # Shared components (role guard)
│   └── ui/             # UI primitives (icons, buttons)
├── hooks/              # Custom React hooks
├── services/           # API service layer
└── types/              # TypeScript type definitions
```

## License

Private — Surgery Care Foundation
