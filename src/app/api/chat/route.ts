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
    
    // Check if the generated content needs image enhancement
    if (generateContent && needsImageGeneration(messages[messages.length - 1].content)) {
      // If the AI didn't include an image generation request, let's add one
      if (!result.content.includes('!IMAGE[')) {
        const imagePrompt = createImagePrompt(messages[messages.length - 1].content);
        // Add the image generation request to the AI's response
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