import { NextResponse } from 'next/server'
import { scrapeAllSources } from '@/lib/scraper'
import { rewriteArticle, rewriteTitle } from '@/lib/gemini'
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
    const limit = 5

    for (const article of articles) {
      if (posted >= limit) break

      const { data: existing } = await supabaseAdmin
        .from('articles')
        .select('id')
        .eq('original_url', article.url)
        .single()

      if (existing) continue

      try {
        const rewrittenContent = await rewriteArticle(article.title, article.content, article.source)
        const rewrittenTitle = await rewriteTitle(article.title)

        await supabaseAdmin.from('articles').insert({
          title: rewrittenTitle,
          content: rewrittenContent,
          original_url: article.url,
          source: article.source,
          image_urls: article.images.slice(0, 5),
          slug: slugify(rewrittenTitle),
          approved: true,
        })

        posted++
      } catch { }
    }

    return NextResponse.json({ success: true, posted })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}