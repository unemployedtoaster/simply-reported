import { NextResponse } from 'next/server'
import { scrapeAllSources } from '@/lib/scraper'
import { supabaseAdmin } from '@/lib/supabase'

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now()
}

export const maxDuration = 60

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const articles = await scrapeAllSources()
    let posted = 0

    for (const article of articles) {
      const { data: existing } = await supabaseAdmin
        .from('articles')
        .select('id')
        .eq('original_url', article.url)
        .single()

      if (existing) continue

      await supabaseAdmin.from('articles').insert({
        title: article.title,
        content: article.content,
        original_url: article.url,
        source: article.source,
        image_urls: article.images.slice(0, 5),
        slug: slugify(article.title),
        approved: true,
      })

      posted++
    }

    return NextResponse.json({ success: true, posted, total_scraped: articles.length })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}