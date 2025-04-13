# SolveSphere

SolveSphere is a web-based platform designed to challenge users through real-world problem-solving across multiple disciplines including engineering, technology, finance, and space exploration. The platform bridges the gap between theoretical knowledge and practical application by providing AI-assisted guidance while fostering critical thinking and creativity.

## Features

- **Problem Repository**: Curated collection of real-world challenges across various fields
- **Solution Development Environment**: Workspace for creating and documenting solutions
- **Community Platform**: Share, discuss, and get feedback on solutions
- **AI Assistant**: Intelligent guidance for problem-solving without giving away answers
- **AI Image Generation**: Visual content generation powered by Stability AI for diagrams, charts, and illustrations
- **Interactive Diagrams**: Create and visualize diagrams, flowcharts, and process flows with Mermaid.js

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Models**: Groq LLama 3 for chat, Stability AI for image generation
- **Visualization**: Mermaid.js for diagrams and flowcharts

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stability AI API key
- Groq API key

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

4. Update the `.env.local` file with your Supabase credentials, Stability AI API key, and Groq API key:
   ```
   # Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Stability AI API Key
   STABILITY_API_KEY=your_stability_api_key
   
   # Groq API Key for LLama AI
   GROQ_API_KEY=your_groq_api_key
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## AI-Powered Features

### Stability AI Integration

SolveSphere uses Stability AI's Stable Diffusion to generate images that help visualize complex concepts within the problem-solving process. This integration enables:

- **Automatic Image Generation**: The AI assistant automatically detects when visual aids would be helpful and generates appropriate images
- **Custom Visual Creation**: Users can request specific diagrams, charts, and illustrations directly through the chat interface
- **Visual Resource Library**: All generated images are saved in the Resources section for easy reference

#### How to Use Image Generation

1. **In the AI Chat**: Simply ask the assistant to visualize a concept. For example: "Can you draw a diagram of how a heat pump works?" or "Create a flowchart for the algorithm"

2. **Direct Generation**: Use the "Generate Image" button in the Resources panel to create custom visuals with specific prompts

3. **Generated Content**: All images appear in both the "Visuals" tab of the chat and in the "Resources" section

For detailed documentation on the Stability AI integration, see the [StabilityAIIntegration.md](docs/StabilityAIIntegration.md) file.

### Mermaid.js Diagram Integration

SolveSphere includes Mermaid.js for creating and visualizing various types of diagrams and charts, enhancing the problem-solving process with rich visual aids:

- **AI-Generated Diagrams**: The AI assistant can automatically create diagrams based on your conversation
- **Interactive Diagram Editor**: Create custom diagrams with the built-in diagram editor
- **Multiple Diagram Types**: Support for flowcharts, sequence diagrams, class diagrams, entity-relationship diagrams, Gantt charts, pie charts, and state diagrams

#### How to Use Diagram Features

1. **In the AI Chat**: Ask the assistant to create a diagram. For example: "Create a flowchart for this algorithm" or "Make a sequence diagram for this process"

2. **Manual Creation**: Use the "Create Diagram" button in the Resources panel to design custom diagrams with the Mermaid syntax editor

3. **Templates**: Choose from predefined templates for common diagram types

4. **Live Preview**: See your diagram update in real-time as you edit the Mermaid code

All diagrams are saved in the "Data & Charts" section of the accumulated content panel for easy reference and reuse.

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

### AI Integration
- `POST /api/chat` - Send messages to the Groq LLama 3 model
- `POST /api/generate-image` - Generate images using Stability AI's Stable Diffusion
- `POST /api/generate-solution` - Generate a structured solution based on chat history

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
/docs              # Documentation files
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was created as a learning exercise for Next.js, Supabase, and Tailwind CSS.
- Inspiration from real-world problem-solving platforms like Kaggle, HackerRank, and LeetCode.
- Image generation powered by Stability AI's Stable Diffusion.
- Diagram visualization powered by Mermaid.js.
