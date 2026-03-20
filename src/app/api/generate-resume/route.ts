import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || 'dummy_key',
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, email, phone, location, summary, experience, education, skills, projects } = await req.json();

    const prompt = `You are a professional resume writer. Create a polished, ATS-friendly resume for the following person. 
Format it in clean markdown with clear sections. Make it professional, concise, and impactful.

Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}
Location: ${location || 'N/A'}

Professional Summary: ${summary || 'Not provided'}

Work Experience:
${experience || 'Not provided'}

Education:
${education || 'Not provided'}

Skills: ${skills || 'Not provided'}

Projects:
${projects || 'Not provided'}

Create a professional resume with these sections:
1. Header (name, contact info)
2. Professional Summary (2-3 compelling sentences)
3. Work Experience (with bullet points, quantified achievements where possible)
4. Education
5. Skills (organized by category if possible)
6. Projects (if provided)

Make the language strong and action-oriented. Use power verbs. Keep it to 1 page worth of content.`;

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
    });

    const resumeContent = completion.choices[0]?.message?.content ?? '';

    // Save to database
    const { data: saved, error } = await supabase
      .from('resumes')
      .upsert({
        user_id: user.id,
        content: {
          input: { name, email, phone, location, summary, experience, education, skills, projects },
          generated: resumeContent,
          created_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) console.error('Failed to save resume:', error);

    return NextResponse.json({ resume: resumeContent, saved });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
