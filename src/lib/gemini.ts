import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function rewriteArticle(title: string, content: string, source: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: 'openai/gpt-oss-20b',
    messages: [
      {
        role: 'user',
        content: `You are a journalist. Rewrite this news article completely in your own words. Keep all facts accurate. Do not mention the original source. Write in a neutral, professional tone.

Title: ${title}
Content: ${content}

Rewrite the article completely in your own words:`
      }
    ],
    max_tokens: 1000,
  })
  return completion.choices[0].message.content || ''
}

export async function rewriteTitle(title: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: 'openai/gpt-oss-20b',
    messages: [
      {
        role: 'user',
        content: `Rewrite this news headline in your own words. Keep it concise and accurate. Return only the headline, nothing else.

Original: ${title}
Rewritten:`
      }
    ],
    max_tokens: 100,
  })
  return completion.choices[0].message.content?.trim() || title
}