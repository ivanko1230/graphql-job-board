# GraphQL Job Board

A full-stack job board application built with Node.js, GraphQL, PostgreSQL, and React.

## Features

- 🎯 GraphQL API for job listings, companies, and applications
- 🔍 Filtering by location, tags, and remote status
- 👨‍💼 Admin panel to post/edit/delete jobs
- 🔐 Firebase Authentication for secure admin access
- 📱 Responsive frontend with job detail pages and search bar
- ⚡ Apollo Client for efficient data fetching

## Tech Stack

- **Backend**: Node.js, Apollo Server, GraphQL, PostgreSQL, Prisma ORM, Firebase Admin
- **Frontend**: React, Apollo Client, Firebase Authentication, CSS Modules

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Firebase project (for authentication)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Set up Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication with Email/Password provider
   - Get your Firebase web app configuration
   - Update `frontend/.env` with your Firebase configuration (see `frontend/.env.example`)
   - For backend, download service account key or use project ID
   - Update `backend/.env` with `FIREBASE_SERVICE_ACCOUNT_KEY` (JSON string) or `FIREBASE_PROJECT_ID`

4. Set up the database:
   - Create a PostgreSQL database
   - Update `.env` file in the `backend` directory with your database connection string

5. Run migrations:
   ```bash
   cd backend
   npm run migrate
   ```

6. Start the development servers:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:4000/graphql`
The frontend will run on `http://localhost:3000`

## Project Structure

```
graphql-job-board/
├── backend/          # GraphQL API server
├── frontend/         # React application
└── README.md
```
