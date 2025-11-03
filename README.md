# IremeCorner Academy Frontend

React-based frontend application for the IremeCorner Academy e-learning platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
REACT_APP_API_URL=http://localhost:5001/api
```

3. Start the development server:
```bash
npm start
# OR
npm run dev
```

Both commands do the same thing - start the React development server.

The app will open at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Project Structure

- `src/components/` - Reusable React components
- `src/pages/` - Page components (routes)
- `src/context/` - React Context providers (Auth)
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions (API client)

## Technologies

- React 18
- React Router v6
- Material-UI (MUI)
- React Query
- Axios
- React Toastify

## Features

- User authentication
- Course browsing and enrollment
- Learning interface with video player
- Assignment and quiz submission
- AI assistant chat
- Admin dashboard
- Responsive design

