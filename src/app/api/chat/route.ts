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
 * Makes a request to the Groq API for chat completion
 * @param messages Chat messages
 * @returns Generated response
 */
async function getGroqCompletion(messages: any[]): Promise<ChatResponse> {
  try {
    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      console.error('GROQ_API_KEY is not defined in environment variables');
      return {
        role: "assistant",
        content: "I'm unable to respond due to a configuration issue. Please contact support."
      };
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
    
    return response.data.choices[0].message;
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
    const { messages, problemId, problemTitle } = await req.json();
    
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
      content: `You are a helpful AI problem-solving assistant for ${problemTitle || 'this problem'}. You help guide users through solving complex problems without giving away the solution directly.
      
Your guidelines:
1. Break down complex problems into manageable parts
2. Ask probing questions to help users think critically
3. Suggest approaches to consider
4. Provide relevant information when needed
5. Help users evaluate their own solutions

${webSearchResults ? "Use the following web search results to inform your response:\n\n" + webSearchResults : ""}

Remember, your goal is to guide the user toward a solution, not to solve the problem for them.`
    };
    
    // Prepare messages for Groq API (add system message at the beginning)
    const groqMessages = [systemMessage, ...messages];
    
    // Get response from Groq
    const response = await getGroqCompletion(groqMessages);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 