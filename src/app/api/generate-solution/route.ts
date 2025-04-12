import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Type for message content
type MessageType = {
  role: string;
  content: string;
};

// Type for accumulated content
type ContentItem = {
  id: string;
  type: string;
  content: string;
  title?: string;
  timestamp: Date;
  sourceMessageId?: string;
};

/**
 * API route to generate a structured solution from chat history and accumulated content
 */
export async function POST(req: NextRequest) {
  try {
    const { messages, accumulatedContent, problemId, problemTitle } = await req.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      );
    }
    
    // Get the Groq API key from environment
    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      console.error('GROQ_API_KEY is not defined in environment variables');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }
    
    // Create a system prompt for solution generation
    const systemPrompt = {
      role: "system",
      content: `You are a solution generation assistant for the problem "${problemTitle || 'this problem'}".
      
Your task is to create a structured, well-organized solution based on the conversation history and accumulated content provided.

The solution should:
1. Clearly address the problem statement
2. Include an executive summary at the beginning
3. Present a logical, step-by-step approach
4. Incorporate relevant insights, data, and formulas from the accumulated content
5. Follow academic/professional writing standards
6. Use proper formatting including sections, bullets, and numbered lists where appropriate
7. Include citations to any external sources referenced

Organize the solution into clear sections such as:
- Introduction / Problem Statement
- Methodology / Approach
- Analysis
- Proposed Solution
- Implementation Considerations
- Conclusion

Use all relevant accumulated content including formulas, tables, research summaries, and notes.`
    };
    
    // Format the accumulated content
    let formattedAccumulatedContent = "";
    
    if (accumulatedContent && accumulatedContent.length > 0) {
      formattedAccumulatedContent = "\n\nAccumulated Content for Reference:\n\n";
      
      accumulatedContent.forEach((item: ContentItem, index: number) => {
        formattedAccumulatedContent += `${index + 1}. ${item.title || item.type.toUpperCase()}:\n`;
        formattedAccumulatedContent += `${item.content}\n\n`;
      });
      
      // Add this to the system prompt
      systemPrompt.content += "\n\n" + formattedAccumulatedContent;
    }
    
    // Prepare messages for API (filter out any system messages from the conversation)
    const apiMessages = [
      systemPrompt,
      ...messages.filter((m: MessageType) => m.role !== 'system')
    ];
    
    // Add a final instruction message
    apiMessages.push({
      role: "user",
      content: "Please generate a complete, well-structured solution for this problem based on our discussion."
    });
    
    // Make API request to Groq
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: apiMessages,
        temperature: 0.5, // Lower temperature for more structured output
        max_tokens: 4000,
      },
      {
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    // Return the generated solution
    return NextResponse.json({
      solution: response.data.choices[0].message.content,
      status: 'success'
    });
    
  } catch (error) {
    console.error('Error generating solution:', error);
    return NextResponse.json(
      { error: 'Failed to generate solution' },
      { status: 500 }
    );
  }
} 