# Stability AI Image Generation

SolveSphere now integrates with Stability AI's Stable Diffusion model to generate images directly within your problem-solving workspace.

## How to Use

### Generate Images from Chat

To generate an image from the AI Assistant chat, use the special syntax:

```
!IMAGE[your detailed image description]
```

For example:
- `!IMAGE[A diagram showing the water cycle with clouds, rain, and evaporation]`
- `!IMAGE[A flowchart explaining the process of photosynthesis]`
- `!IMAGE[A visualization of Newton's three laws of motion]`

### Tips for Better Results

1. **Be Specific**: The more detailed your description, the better the image will match your needs.
2. **Specify Style**: Include style information like "diagram", "flowchart", "realistic photo", etc.
3. **Add Context**: Include educational or scientific context when appropriate.
4. **Avoid Banned Content**: The system has safety filters to prevent inappropriate content.

## Where to Find Generated Images

Generated images appear in two places:

1. **Visuals Tab**: In the "Accumulated Content" panel, switch to the "Visuals" tab to see all generated images.
2. **Resources Section**: In the main workspace navigation, go to "Resources" to view all accumulated visual content.

## Technical Details

- Images are generated using Stability AI's Stable Diffusion XL 1.0 model.
- Default size is 1024x1024 pixels.
- Images are stored as base64 data and can be downloaded directly from the interface.
- Processing may take 5-15 seconds depending on server load.

## Configuration

The Stability AI integration requires a valid API key. If you're setting up your own instance:

1. Create an account at [platform.stability.ai](https://platform.stability.ai/)
2. Generate an API key from the dashboard
3. Add the key to your `.env.local` file as `STABILITY_API_KEY=your_key_here`

## Privacy and Storage

The images are stored temporarily in your browser session and within your SolveSphere account data. Content policies apply to all generated imagery.

## Example Usage Scenarios

- Generate diagrams to illustrate complex concepts
- Create visual representations of mathematical problems
- Produce flowcharts for algorithm visualization
- Generate schematic drawings for engineering problems
- Create visual aids for understanding scientific processes 