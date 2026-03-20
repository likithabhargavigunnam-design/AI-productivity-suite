import { NextRequest, NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || 'dummy_key',
});

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Fetch transcript
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    const transcript = transcriptItems.map(t => t.text).join(' ');

    if (!transcript || transcript.length < 50) {
      return NextResponse.json({ error: 'Could not fetch transcript. The video may have captions disabled.' }, { status: 400 });
    }

    // Truncate to ~4000 words to avoid token limits
    const truncatedTranscript = transcript.split(' ').slice(0, 4000).join(' ');

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at summarizing YouTube video transcripts. Provide concise, accurate summaries.',
        },
        {
          role: 'user',
          content: `Based on this YouTube video transcript, provide:
1. A concise 2-3 sentence summary of the main topic
2. 5-7 key bullet points covering the most important insights
3. A brief conclusion or takeaway

Transcript:
${truncatedTranscript}

Format your response as:
## Summary
[2-3 sentence summary]

## Key Points
• [point 1]
• [point 2]
...

## Takeaway
[1-2 sentence takeaway]`,
        },
      ],
      max_tokens: 800,
    });

    const summary = completion.choices[0]?.message?.content ?? 'Could not generate summary.';
    return NextResponse.json({ summary, videoId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
