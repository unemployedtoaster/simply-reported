'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Article {
  id: string
  title: string
  content: string
  source: string
  slug: string
  image_urls: string[]
  created_at: string
  author: string
  original_url: string
}

export default function ArticlePage() {
  const { slug } = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArticle() {
      const res = await fetch(`/api/articles/${slug}`)
      const data = await res.json()
      setArticle(data)
      setLoading(false)
    }
    fetchArticle()
  }, [slug])

  if (loading) return (
    <div className="wiki-container" style={{ marginTop: '30px' }}>
      <p style={{ color: '#54595d' }}>Loading...</p>
    </div>
  )

  if (!article) return (
    <div className="wiki-container" style={{ marginTop: '30px' }}>
      <p>Article not found.</p>
    </div>
  )

  return (
    <div>
      <header className="wiki-header">
        <div className="wiki-container">
          <nav className="wiki-nav">
            <Link href="/" className="wiki-logo">Simply Reported</Link>
            <Link href="/" className="wiki-btn">Back to News</Link>
          </nav>
        </div>
      </header>

      <main className="wiki-container" style={{ marginTop: '30px', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '32px', fontFamily: 'Linux Libertine, Georgia, serif', marginBottom: '12px', lineHeight: '1.3' }}>
          {article.title}
        </h1>

        <div className="article-meta" style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #a2a9b1' }}>
          {new Date(article.created_at).toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
          {' '}&bull;{' '}{article.source}
          {' '}&bull;{' '}{article.author}
          {article.original_url && (
            <>{' '}&bull;{' '}<a href={article.original_url} target="_blank" rel="noopener noreferrer">Original Source</a></>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {article.image_urls?.slice(0, 2).map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`${article.title} - image ${i + 1}`}
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
              onError={e => (e.currentTarget.style.display = 'none')}
            />
          ))}
        </div>

        <div style={{ marginTop: '24px', fontSize: '16px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
          {article.content}
        </div>

        {article.image_urls?.slice(2).map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`${article.title} - image ${i + 3}`}
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', marginTop: '20px' }}
            onError={e => (e.currentTarget.style.display = 'none')}
          />
        ))}
      </main>
    </div>
  )
}