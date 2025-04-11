# AI Integration Setup Guide

This document outlines how to set up the AI integration for SolveSphere's problem-solving assistant using Groq and SerpAPI.

## Prerequisites

1. [Groq](https://console.groq.com) account for LLM capabilities
2. [SerpAPI](https://serpapi.com/) account for web search capabilities

## Setup Steps

### 1. Get API Keys

#### Groq API Key
1. Sign up or login to [Groq Console](https://console.groq.com)
2. Navigate to API Keys section
3. Create a new API key or copy your existing key

#### SerpAPI Key
1. Sign up or login to [SerpAPI](https://serpapi.com/)
2. Navigate to your dashboard
3. Copy your API key

### 2. Configure Environment Variables

In your `.env.local` file, add the following:

```
# Groq API for AI integration
GROQ_API_KEY="your-groq-api-key-here"

# SerpAPI for web search capability
SERP_API_KEY="your-serpapi-key-here"
```

Replace the placeholder values with your actual API keys.

### 3. Web Search Capability

The AI assistant will automatically detect when a user's query might benefit from web search and will use SerpAPI to gather relevant information. No additional configuration is needed beyond setting up the API key.

### 4. Usage Notes

- The web search capability is triggered by certain keywords in user messages such as "search", "find", "latest", "current", etc.
- Search results are formatted and provided to the Groq LLM as context
- The LLM is instructed to use the search results to inform its responses without directly quoting them unless relevant

## Testing the Integration

After setting up the environment variables, you can verify the integration by:

1. Starting a conversation with the AI assistant
2. Asking a question that requires current information, such as "What are the latest developments in solar panel technology?"
3. The assistant should perform a web search and incorporate the results into its response

## Troubleshooting

If you encounter issues:

1. Check your browser console for error messages
2. Verify your API keys are correctly set in the `.env.local` file
3. Ensure your API keys are active and have sufficient quota/credits
4. Check that your environment variables are being properly loaded by the application

For any persistent issues, please contact the development team. 