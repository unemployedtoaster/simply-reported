import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function rewriteArticle(title: string, content: string, source: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  
  const prompt = `You are a journalist. Rewrite this news article in your own words. Keep all facts accurate. Do not mention the original source. Write in a neutral, professional tone.

Title: ${title}
Content: ${content}

Rewrite the article completely in your own words:`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

export async function rewriteTitle(title: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  
  const prompt = `Rewrite this news headline in your own words. Keep it concise and accurate. Return only the headline, nothing else.

Original: ${title}
Rewritten:`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}