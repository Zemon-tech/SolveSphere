import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// StabilityAI API endpoint
const STABILITY_API_HOST = 'https://api.stability.ai';
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

// This function handles image generation requests
export async function POST(request: NextRequest) {
  try {
    // Check if STABILITY_API_KEY is configured
    if (!STABILITY_API_KEY) {
      return NextResponse.json(
        { error: 'Missing Stability API key. Please configure STABILITY_API_KEY in environment variables.' },
        { status: 500 }
      );
    }

    // For now, we'll skip authentication to simplify the process 
    // In a production environment, you should implement proper authentication

    // Parse request body
    const body = await request.json();
    const { prompt, negativePrompt, width, height, numOutputs = 1 } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Default size is 1024x1024 if not specified
    const imageWidth = width || 1024;
    const imageHeight = height || 1024;

    console.log(`Generating image with prompt: ${prompt}`);

    // Prepare request to Stability AI's API
    const response = await fetch(
      `${STABILITY_API_HOST}/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1.0
            },
            ...(negativePrompt ? [{ text: negativePrompt, weight: -1.0 }] : [])
          ],
          cfg_scale: 7,
          height: imageHeight,
          width: imageWidth,
          samples: numOutputs,
          steps: 30,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Stability AI API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate image', details: error }, 
        { status: response.status }
      );
    }

    // Parse and return results from Stability AI
    const responseJSON = await response.json();
    
    // Map the response to a simpler format
    const images = responseJSON.artifacts.map((artifact: any) => ({
      id: uuidv4(),
      base64: artifact.base64,
      finishReason: artifact.finishReason,
      seed: artifact.seed,
    }));

    console.log('Successfully generated image');
    return NextResponse.json({ images });
    
  } catch (error) {
    console.error('Error in image generation:', error);
    return NextResponse.json(
      { error: 'Something went wrong', details: error }, 
      { status: 500 }
    );
  }
} 