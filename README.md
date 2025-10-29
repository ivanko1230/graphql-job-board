# GraphQL Job Board

A full-stack job board application built with Node.js, GraphQL, PostgreSQL, and React.

## Features

- 🎯 GraphQL API for job listings, companies, and applications
- 🔍 Filtering by location, tags, and remote status
- 👨‍💼 Admin panel to post/edit/delete jobs
- 📱 Responsive frontend with job detail pages and search bar
- ⚡ Apollo Client for efficient data fetching

## Tech Stack

- **Backend**: Node.js, Apollo Server, GraphQL, PostgreSQL, Prisma ORM
- **Frontend**: React, Apollo Client, CSS Modules

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Set up the database:
   - Create a PostgreSQL database
   - Update `.env` file in the `backend` directory with your database connection string

4. Run migrations:
   ```bash
   cd backend
   npm run migrate
   ```

5. Start the development servers:
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
