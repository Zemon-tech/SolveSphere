import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Define the response structure
interface ChatResponse {
  role: string;
  content: string;
}

/**
 * Performs a web search using the SerpAPI
 * @param query Search query
 * @returns Search results as formatted text
 */
async function performWebSearch(query: string): Promise<string> {
  try {
    // Replace with your actual SerpAPI key
    const serpApiKey = process.env.SERP_API_KEY;
    
    if (!serpApiKey) {
      console.error('SERP_API_KEY is not defined in environment variables');
      return "Unable to perform web search due to missing API key.";
    }
    
    const response = await axios.get(`https://serpapi.com/search`, {
      params: {
        q: query,
        api_key: serpApiKey,
        engine: 'google',
        num: 5, // Limit to 5 results
      }
    });
    
    const searchResults = response.data;
    
    // Format search results as text
    let formattedResults = "### Web Search Results\n\n";
    
    if (searchResults.organic_results && searchResults.organic_results.length > 0) {
      searchResults.organic_results.slice(0, 5).forEach((result: any, index: number) => {
        formattedResults += `${index + 1}. **${result.title}**\n`;
        formattedResults += `   ${result.snippet}\n`;
        formattedResults += `   URL: ${result.link}\n\n`;
      });
    } else {
      formattedResults += "No relevant results found.\n\n";
    }
    
    return formattedResults;
  } catch (error) {
    console.error('Error performing web search:', error);
    return "Error performing web search. Please try again later.";
  }
}

/**
 * Detects if the message content likely needs image generation
 * @param message The message content to analyze
 * @returns Boolean indicating if image generation is needed
 */
function needsImageGeneration(message: string): boolean {
  // Keywords and phrases indicating image generation is appropriate
  const imageKeywords = [
    'diagram', 'visualize', 'illustration', 'picture', 'image', 'draw',
    'flowchart', 'graph', 'chart', 'visualization', 'sketch', 'figure',
    'render', 'plot', 'create a visual', 'show me', 'generate image',
    'generate a diagram', 'generate an image', 'can you show', 'visually represent',
    'visual explanation', 'can you draw', 'make a diagram', 'make an image'
  ];
  
  // Check if the message contains any of the image-related keywords
  return imageKeywords.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );
}

/**
 * Creates an appropriate image prompt based on the message content
 * @param message The message to analyze
 * @returns A well-formed prompt for image generation
 */
function createImagePrompt(message: string): string {
  // Extract the main subject for the image
  const promptPhrases = [
    'diagram of', 'visualization of', 'illustration of', 'picture of',
    'flowchart of', 'graph showing', 'chart displaying', 'sketch of',
    'drawing of', 'visual representation of'
  ];
  
  let imagePrompt = '';
  
  // Try to extract the specific request
  for (const phrase of promptPhrases) {
    if (message.toLowerCase().includes(phrase)) {
      const parts = message.toLowerCase().split(phrase);
      if (parts.length > 1) {
        // Get the content after the phrase up to the next punctuation or end
        const rawPrompt = parts[1].split(/[.!?;]/)[0].trim();
        if (rawPrompt) {
          // Add style guidance for better results
          imagePrompt = `A clear, detailed, educational ${phrase} ${rawPrompt}. High quality, professional diagram style with labels and clear visual elements.`;
          break;
        }
      }
    }
  }
  
  // If no specific phrase found, create a generic prompt from the whole message
  if (!imagePrompt) {
    // Clean the message and keep it concise
    imagePrompt = `Educational diagram visualizing: ${message.replace(/[^\w\s,.]/g, ' ').slice(0, 100)}. Clear, detailed, with labels.`;
  }
  
  return imagePrompt;
}

/**
 * Detects if the message content likely needs diagram generation with Mermaid
 * @param message The message content to analyze
 * @returns Boolean indicating if diagram generation is needed
 */
function needsDiagramGeneration(message: string): boolean {
  // Keywords and phrases indicating diagram generation is appropriate
  const diagramKeywords = [
    'flowchart', 'flow chart', 'diagram', 'workflow', 'sequence diagram',
    'state diagram', 'gantt chart', 'pie chart', 'class diagram', 
    'entity relationship', 'er diagram', 'process flow', 'architecture diagram',
    'uml', 'graph', 'decision tree', 'network diagram'
  ];
  
  // Check if the message contains any of the diagram-related keywords
  return diagramKeywords.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );
}

/**
 * Creates a Mermaid diagram template based on the message content
 * @param message The message to analyze
 * @returns A well-formed Mermaid diagram syntax
 */
function createMermaidDiagram(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Determine diagram type based on message content
  if (lowerMessage.includes('flowchart') || lowerMessage.includes('flow chart') || lowerMessage.includes('workflow')) {
    return `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[Result 1]
    D --> F[Result 2]
    E --> G[End]
    F --> G`;
  } 
  else if (lowerMessage.includes('sequence diagram')) {
    return `sequenceDiagram
    participant U as User
    participant S as System
    participant D as Database
    U->>S: Request Data
    S->>D: Query Data
    D->>S: Return Results
    S->>U: Display Results`;
  }
  else if (lowerMessage.includes('class diagram') || lowerMessage.includes('uml')) {
    return `classDiagram
    class Entity {
      +id: string
      +name: string
      +getData()
    }
    class RelatedEntity {
      +entityId: string
      +value: number
      +processData()
    }
    Entity <-- RelatedEntity`;
  }
  else if (lowerMessage.includes('entity relationship') || lowerMessage.includes('er diagram')) {
    return `erDiagram
    ENTITY1 ||--o{ ENTITY2 : has
    ENTITY1 {
        string id
        string name
    }
    ENTITY2 {
        string id
        string entity1Id
        number value
    }`;
  }
  else if (lowerMessage.includes('gantt') || lowerMessage.includes('schedule') || lowerMessage.includes('timeline')) {
    return `gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Research           :a1, 2023-01-01, 10d
    Design             :a2, after a1, 7d
    section Implementation
    Development        :a3, after a2, 15d
    Testing            :a4, after a3, 5d
    section Deployment
    Release            :a5, after a4, 2d`;
  }
  else if (lowerMessage.includes('pie chart') || lowerMessage.includes('distribution')) {
    return `pie
    title Distribution
    "Category A" : 42
    "Category B" : 28
    "Category C" : 30`;
  }
  else if (lowerMessage.includes('state') || lowerMessage.includes('status')) {
    return `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Start
    Processing --> Complete: Success
    Processing --> Error: Failure
    Complete --> [*]
    Error --> Idle: Retry`;
  }
  else {
    // Default to a simple flowchart
    return `graph TD
    A[Step 1] --> B[Step 2]
    B --> C[Step 3]
    C --> D[Step 4]
    B --> E[Alternative]
    E --> F[Result]
    D --> F`;
  }
}

/**
 * Makes a request to the Groq API for chat completion
 * @param messages Chat messages
 * @param generateContent Whether to include content generation instructions
 * @returns Generated response
 */
async function getGroqCompletion(messages: any[], generateContent: boolean = false): Promise<ChatResponse> {
  try {
    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      console.error('GROQ_API_KEY is not defined in environment variables');
      return {
        role: "assistant",
        content: "I'm unable to respond due to a configuration issue. Please contact support."
      };
    }
    
    // If generateContent is true, add instructions to include content types
    if (generateContent) {
      // Find the system message and enhance it
      for (let i = 0; i < messages.length; i++) {
        if (messages[i].role === 'system') {
          messages[i].content += `\n\nGenerate rich content when appropriate:
- Use tables (markdown format) for comparing data
- Include mathematical formulas between $$ delimiters (e.g., $$E = mc^2$$)
- Begin research summaries with "Research:" or "Study:"
- Use markdown formatting for clarity and structure
- When images would be helpful to explain concepts, include an image generation request in the format !IMAGE[detailed image description]
- For visualizing processes, workflows, or relationships, create Mermaid diagrams by enclosing the diagram code in triple backticks with "mermaid" as the language, e.g., \`\`\`mermaid
graph TD
    A --> B
\`\`\`
- For images, be specific and detailed in your descriptions to get the best visual results`;
          break;
        }
      }
    }
    
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192', // Use Llama 3 model
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048,
      },
      {
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    let result = response.data.choices[0].message;
    
    // Check for enhancement opportunities
    if (generateContent) {
      const userMessage = messages[messages.length - 1].content;
      
      // Check if diagram generation is needed and not already included
      if (needsDiagramGeneration(userMessage) && !result.content.includes('```mermaid')) {
        const mermaidDiagram = createMermaidDiagram(userMessage);
        result.content += `\n\nHere's a diagram to visualize this concept:\n\n\`\`\`mermaid\n${mermaidDiagram}\n\`\`\``;
      }
      
      // Check if image generation is needed and not already included
      else if (needsImageGeneration(userMessage) && !result.content.includes('!IMAGE[')) {
        const imagePrompt = createImagePrompt(userMessage);
        result.content += `\n\n!IMAGE[${imagePrompt}]`;
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return {
      role: "assistant",
      content: "I encountered an error while generating a response. Please try again later."
    };
  }
}

/**
 * Detects if the user message likely requires a web search
 * @param message The user's message
 * @returns Boolean indicating if search is needed
 */
function needsWebSearch(message: string): boolean {
  // Keywords that might indicate a need for web search
  const searchKeywords = [
    'search', 'find', 'look up', 'google', 'internet', 'web', 'online',
    'latest', 'recent', 'news', 'data', 'information', 'stats', 'statistics',
    'current', 'nowadays', 'today', 'yesterday', 'this week', 'this month',
    'this year', 'research', 'study', 'survey', 'report', 'article', 'published'
  ];
  
  // Check if the message contains any of the search keywords
  return searchKeywords.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );
}

export async function POST(req: NextRequest) {
  try {
    const { messages, problemId, problemTitle, generateContent = false } = await req.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      );
    }
    
    // Get the latest user message
    const userMessage = messages[messages.length - 1];
    
    // Check if web search is needed
    let webSearchResults = "";
    if (userMessage.role === 'user' && needsWebSearch(userMessage.content)) {
      webSearchResults = await performWebSearch(userMessage.content);
    }
    
    // Create system message with problem context and web search results if available
    const systemMessage = {
      role: "system",
      content: `You are a helpful AI problem-solving assistant for "${problemTitle || 'this problem'}". You help guide users through solving complex problems without giving away the solution directly.
      
Your guidelines:
1. Break down complex problems into manageable parts
2. Ask probing questions to help users think critically
3. Suggest approaches to consider
4. Provide relevant information when needed
5. Help users evaluate their own solutions
6. Generate images using the !IMAGE[detailed description] syntax when visuals would help explain concepts
7. Create diagrams with Mermaid syntax when explaining processes, workflows, or relationships

${webSearchResults ? "Use the following web search results to inform your response:\n\n" + webSearchResults : ""}

Remember, your goal is to guide the user toward a solution, not to solve the problem for them.`
    };
    
    // Prepare messages for Groq API (add system message at the beginning)
    const groqMessages = [systemMessage, ...messages];
    
    // Get response from Groq (pass generateContent flag)
    const response = await getGroqCompletion(groqMessages, generateContent);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 