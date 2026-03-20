import { NextRequest, NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';


interface FirecrawlResult {
  url?: string;
  title?: string;
  description?: string;
  markdown?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { keyword } = await req.json();
    if (!keyword) return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });

    const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! });

    // Use Firecrawl's search endpoint
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchResult = (await firecrawl.search(
      `${keyword} jobs site:linkedin.com OR site:indeed.com OR site:glassdoor.com`,
      { limit: 8, scrapeOptions: { formats: ['markdown'] } }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    )) as any;

    // Handle both v0 (searchResult.data) and v1 (searchResult directly as array) shapes
    const results: FirecrawlResult[] = Array.isArray(searchResult)
      ? searchResult
      : Array.isArray(searchResult?.data)
      ? searchResult.data
      : [];

    if (!results.length) {
      return NextResponse.json({ error: 'No job results found. Try a different keyword.' }, { status: 404 });
    }

    // Process each result and generate AI summary
    const jobs = await Promise.all(
      results.slice(0, 6).map(async (result: FirecrawlResult) => {
        const rawContent = result.markdown ?? result.description ?? '';

        let aiSummary = '';
        if (rawContent.length > 100) {
          try {
            const apiKey = process.env.OPENROUTER_API_KEY;
            if (!apiKey) throw new Error('No API Key');

            const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'SmartSummarize AI',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model: 'meta-llama/llama-3.3-70b-instruct:free',
                messages: [
                  {
                    role: 'user',
                    content: `Summarize this job listing in 2 concise sentences covering: role requirements, main responsibilities, and company highlight. Be direct and informative.\n\n${rawContent.substring(0, 2000)}`,
                  },
                ],
                max_tokens: 150,
              })
            });
            if (res.ok) {
              const data = await res.json();
              aiSummary = data.choices?.[0]?.message?.content ?? '';
            }
          } catch {
            aiSummary = result.description ?? '';
          }
        }

        // Parse title/company/location from the result
        const titleLine = result.title ?? 'Job Listing';
        const parts = titleLine.split(' - ');
        const jobTitle = parts[0]?.trim() ?? titleLine;
        const company = parts[1]?.trim() ?? 'View on site';
        const location = parts[2]?.trim() ?? 'Remote / Various';

        return {
          title: jobTitle,
          company,
          location,
          url: result.url ?? '#',
          summary: (aiSummary || result.description?.substring(0, 200)) ?? 'No description available.',
        };
      })
    );

    return NextResponse.json({ jobs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
