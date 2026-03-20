import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// GET - fetch all notes for current user
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: notes, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ notes });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST - create a note OR summarize note content
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    // If summarize action is requested
    if (body.action === 'summarize') {
      const { content } = body;
      if (!content) return NextResponse.json({ error: 'No content to summarize' }, { status: 400 });

      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) return NextResponse.json({ error: 'GROQ_API_KEY missing' }, { status: 500 });

      const groq = new Groq({ apiKey });

      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an expert note summarizer. Provide structured, concise summaries.',
          },
          {
            role: 'user',
            content: `Summarize the following notes and provide:
## Condensed Summary
[2-3 sentence overview]

## Key Action Items
• [action 1]
• [action 2]

## Study Guide
[bullet points of core concepts]

Notes:
${content}`,
          },
        ],
        max_tokens: 1024,
      });

      const summary = completion.choices[0]?.message?.content ?? '';
      return NextResponse.json({ summary });
    }

    // Otherwise create a note
    const { title, content, folder_id, tags } = body;
    const { data: note, error } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        title: title || 'Untitled Note',
        content: content || '',
        folder_id: folder_id || null,
        tags: tags || [],
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ note });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
