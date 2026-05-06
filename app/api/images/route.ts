import { NextResponse } from "next/server";

export async function GET(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ images: [] });
  }
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ images: [] });
  }

  try {
    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5"
    };

    // Step 1: Get VQD token
    const r1 = await fetch(
      `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`,
      { headers }
    );
    const t1 = await r1.text();
    const vqdMatch = t1.match(/vqd=([\d-]+)/) || t1.match(/vqd["']?:\s*["']([^"']+)["']/);
    
    if (!vqdMatch) {
      console.error("VQD not found");
      return NextResponse.json({ images: [] });
    }
    const vqd = vqdMatch[1];

    // Step 2: Fetch images
    const url2 = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,,,&p=1`;
    const r2 = await fetch(url2, { headers });
    const t2 = await r2.json();

    const images = t2.results?.slice(0, 10).map((res: any) => res.image) || [];

    return NextResponse.json({ images });

  } catch (e) {
    console.error("DuckDuckGo scraping error:", e);
    return NextResponse.json({ images: [] });
  }
}

