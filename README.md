# SolveSphere

SolveSphere is a web-based platform designed to challenge users through real-world problem-solving across multiple disciplines including engineering, technology, finance, and space exploration. The platform bridges the gap between theoretical knowledge and practical application by providing AI-assisted guidance while fostering critical thinking and creativity.

## Features

- **Problem Repository**: Curated collection of real-world challenges across various fields
- **Solution Development Environment**: Workspace for creating and documenting solutions
- **Community Platform**: Share, discuss, and get feedback on solutions
- **AI Assistant**: Intelligent guidance for problem-solving without giving away answers

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/solvesphere.git
   cd solvesphere
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file based on the example:
   ```bash
   cp .env.local.example .env.local
   ```

4. Update the `.env.local` file with your Supabase credentials.

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Setup

We provide migration and seed files in the `supabase` directory to help you set up the database:

1. Create a new project in Supabase.

2. Run the migrations in the Supabase SQL editor:
   - First, run `supabase/migrations/00001_initial_schema.sql` to create the tables
   - Then, run `supabase/migrations/00002_rls_policies.sql` to set up security policies

3. Seed the database with sample data by running `supabase/seed.sql`.

4. For more detailed instructions, see the [Supabase Setup README](supabase/README.md).

## API Endpoints

SolveSphere provides the following API endpoints:

### Problems
- `GET /api/problems` - Get all problems with optional filtering
- `GET /api/problems/[id]` - Get a specific problem by ID
- `PUT /api/problems/[id]` - Update a problem (admin only)
- `DELETE /api/problems/[id]` - Delete a problem (admin only)

### Solutions
- `GET /api/solutions` - Get all solutions with optional filtering
- `POST /api/solutions` - Create a new solution
- `GET /api/solutions/[id]` - Get a specific solution by ID
- `PUT /api/solutions/[id]` - Update a solution (owner only)
- `DELETE /api/solutions/[id]` - Delete a solution (owner only)

### Comments
- `GET /api/comments` - Get comments with optional filtering
- `POST /api/comments` - Create a new comment

### Votes
- `GET /api/votes` - Get vote counts for a solution
- `POST /api/votes` - Add or update a vote

### Users
- `GET /api/users` - Get a user profile
- `PUT /api/users` - Update a user profile

## Project Structure

```
/src
  /app             # Next.js App Router
    /api           # API routes
    /auth          # Authentication pages
    /components    # Shared components
    /lib           # Utility functions
    /problems      # Problem pages
    /solutions     # Solution pages
    /community     # Community pages
/supabase
  /migrations      # Database migration files
  seed.sql         # Database seed data
  README.md        # Supabase setup instructions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was created as a learning exercise for Next.js, Supabase, and Tailwind CSS.
- Inspiration from real-world problem-solving platforms like Kaggle, HackerRank, and LeetCode.
