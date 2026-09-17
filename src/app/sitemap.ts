import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

const SITE_URL = 'https://simply-reported.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  const { data: articles, error } = await supabaseAdmin
    .from('articles')
    .select('slug, created_at')
    .eq('approved', true)
    .order('created_at', { ascending: false })

  if (error || !articles) {
    // If the DB call fails at build/request time, still return the static routes
    // rather than failing the whole sitemap.
    return staticRoutes
  }

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/article/${article.slug}`,
    lastModified: new Date(article.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...articleRoutes]
}
