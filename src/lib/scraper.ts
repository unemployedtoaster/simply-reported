import axios from 'axios'
import * as cheerio from 'cheerio'

export interface ScrapedArticle {
  title: string
  content: string
  url: string
  source: string
  images: string[]
}

const SOURCES = [
  { name: 'Daily Star', url: 'https://www.thedailystar.net', selector: 'article', titleSel: 'h1', contentSel: '.pb-20', imageSel: 'img' },
  { name: 'Prothom Alo', url: 'https://en.prothomalo.com', selector: 'article', titleSel: 'h1', contentSel: '.story-content', imageSel: 'img' },
  { name: 'bdnews24', url: 'https://bdnews24.com', selector: 'article', titleSel: 'h1', contentSel: '.body', imageSel: 'img' },
  { name: 'Dhaka Tribune', url: 'https://www.dhakatribune.com', selector: 'article', titleSel: 'h1', contentSel: '.article-body', imageSel: 'img' },
  { name: 'New Age', url: 'https://www.newagebd.net', selector: 'article', titleSel: 'h1', contentSel: '.news-details', imageSel: 'img' },
  { name: 'Financial Express', url: 'https://thefinancialexpress.com.bd', selector: 'article', titleSel: 'h1', contentSel: '.content-details', imageSel: 'img' },
  { name: 'Independent BD', url: 'https://www.theindependentbd.com', selector: 'article', titleSel: 'h1', contentSel: '.news-details-desc', imageSel: 'img' },
  { name: 'Somoy News', url: 'https://www.somoynews.tv', selector: 'article', titleSel: 'h1', contentSel: '.details-body', imageSel: 'img' },
]

async function scrapeSource(source: typeof SOURCES[0]): Promise<ScrapedArticle[]> {
  try {
    const { data } = await axios.get(source.url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    })
    
    const $ = cheerio.load(data)
    const articles: ScrapedArticle[] = []
    const links: string[] = []

    $('a').each((_, el) => {
      const href = $(el).attr('href')
      if (href && href.startsWith('/') && href.length > 10) {
        links.push(source.url + href)
      }
    })

    const uniqueLinks = [...new Set(links)].slice(0, 5)

    for (const link of uniqueLinks) {
      try {
        const { data: articleData } = await axios.get(link, {
          timeout: 10000,
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        })
        
        const $a = cheerio.load(articleData)
        const title = $a(source.titleSel).first().text().trim()
        const content = $a(source.contentSel).first().text().trim()
        const images: string[] = []
        
        $a(source.imageSel).each((_, img) => {
          const src = $a(img).attr('src')
          if (src && src.startsWith('http') && images.length < 5) {
            images.push(src)
          }
        })

        if (title && content && content.length > 100) {
          articles.push({ title, content, url: link, source: source.name, images })
        }
      } catch { }
    }

    return articles
  } catch {
    return []
  }
}

export async function scrapeAllSources(): Promise<ScrapedArticle[]> {
  const results = await Promise.allSettled(SOURCES.map(scrapeSource))
  return results
    .filter((r): r is PromiseFulfilledResult<ScrapedArticle[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)
}