import axios from 'axios'

export interface ScrapedArticle {
  title: string
  content: string
  url: string
  source: string
  images: string[]
}

const RSS_SOURCES = [
  { name: 'Daily Star', url: 'https://www.thedailystar.net/rss.xml' },
  { name: 'bdnews24', url: 'https://bdnews24.com/feed' },
  { name: 'Dhaka Tribune', url: 'https://www.dhakatribune.com/feed' },
  { name: 'Prothom Alo', url: 'https://en.prothomalo.com/feed' },
  { name: 'New Age', url: 'https://www.newagebd.net/rss.xml' },
  { name: 'Financial Express', url: 'https://thefinancialexpress.com.bd/feed' },
  { name: 'Independent BD', url: 'https://www.theindependentbd.com/rss.xml' },
  { name: 'Somoy News', url: 'https://www.somoynews.tv/rss.xml' },
  { name: 'Jugantor', url: 'https://www.jugantor.com/rss.xml' },
  { name: 'Ittefaq', url: 'https://www.ittefaq.com.bd/rss.xml' },
]

function extractImagesFromContent(content: string): string[] {
  const images: string[] = []
  const imgRegex = /<img[^>]+src="([^"]+)"/g
  let match
  while ((match = imgRegex.exec(content)) !== null) {
    if (match[1].startsWith('http')) {
      images.push(match[1])
    }
  }
  return images.slice(0, 5)
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

async function parseRSS(source: typeof RSS_SOURCES[0]): Promise<ScrapedArticle[]> {
  try {
    const { data } = await axios.get(source.url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    })

    const articles: ScrapedArticle[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match

    while ((match = itemRegex.exec(data)) !== null) {
      const item = match[1]

      const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
                         item.match(/<title>(.*?)<\/title>/)
      const linkMatch = item.match(/<link>(.*?)<\/link>/) ||
                        item.match(/<link href="(.*?)"/)
      const descMatch = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
                        item.match(/<description>([\s\S]*?)<\/description>/)
      const contentMatch = item.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/)
      const enclosureMatch = item.match(/<enclosure[^>]+url="([^"]+)"/)
      const mediaMatch = item.match(/<media:content[^>]+url="([^"]+)"/)

      const title = titleMatch ? titleMatch[1].trim() : ''
      const url = linkMatch ? linkMatch[1].trim() : ''
      const rawContent = contentMatch ? contentMatch[1] : (descMatch ? descMatch[1] : '')
      const content = stripHtml(rawContent)

      const images: string[] = []
      if (enclosureMatch) images.push(enclosureMatch[1])
      if (mediaMatch) images.push(mediaMatch[1])
      images.push(...extractImagesFromContent(rawContent))

      if (title && content && content.length > 50 && url) {
        articles.push({ title, content, url, source: source.name, images: [...new Set(images)].slice(0, 5) })
      }
    }

    return articles
  } catch {
    return []
  }
}

export async function scrapeAllSources(): Promise<ScrapedArticle[]> {
  const results = await Promise.allSettled(RSS_SOURCES.map(parseRSS))
  return results
    .filter((r): r is PromiseFulfilledResult<ScrapedArticle[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)
}