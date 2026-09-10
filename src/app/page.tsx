'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  content: string
  source: string
  slug: string
  image_urls: string[]
  created_at: string
  author: string
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchArticles()
  }, [page])

  async function fetchArticles() {
    setLoading(true)
    const res = await fetch(`/api/articles?page=${page}&limit=20${search ? `&search=${search}` : ''}`)
    const data = await res.json()
    setArticles(data)
    setLoading(false)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    fetchArticles()
  }

  return (
    <div>
      <header className="wiki-header">
        <div className="wiki-container">
          <nav className="wiki-nav">
            <Link href="/" className="wiki-logo">Simply Reported</Link>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1, maxWidth: '400px' }}>
              <input
                className="wiki-search"
                placeholder="Search articles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit" className="wiki-btn">Search</button>
            </form>
            <Link href="/submit" className="wiki-btn">Submit Article</Link>
            <Link href="/login" className="wiki-btn wiki-btn-primary">Sign In</Link>
          </nav>
        </div>
      </header>

      <main className="wiki-container" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px', marginTop: '30px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontFamily: 'Linux Libertine, Georgia, serif', borderBottom: '1px solid #a2a9b1', paddingBottom: '10px', marginBottom: '20px' }}>
            Latest News
          </h1>

          {loading ? (
            <p style={{ color: '#54595d' }}>Loading articles...</p>
          ) : articles.length === 0 ? (
            <p style={{ color: '#54595d' }}>No articles found.</p>
          ) : (
            articles.map(article => (
              <div key={article.id} className="article-card">
                {article.image_urls?.[0] && (
                  <img
                    src={article.image_urls[0]}
                    alt={article.title}
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginBottom: '12px' }}
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                )}
                <div className="article-title">
                  <Link href={`/article/${article.slug}`}>{article.title}</Link>
                </div>
                <div className="article-meta">
                  {new Date(article.created_at).toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
                  {' '}&bull;{' '}{article.source}
                  {' '}&bull;{' '}{article.author}
                </div>
                <div className="article-excerpt">
                  {article.content.slice(0, 300)}...
                </div>
              </div>
            ))
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #a2a9b1' }}>
            <button className="wiki-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
            <span style={{ padding: '6px 12px', fontSize: '14px' }}>Page {page}</span>
            <button className="wiki-btn" onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </div>

        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-title">Sources</div>
            {['Daily Star', 'Prothom Alo', 'bdnews24', 'Dhaka Tribune', 'New Age', 'Financial Express', 'Somoy News'].map(source => (
              <div key={source} style={{ marginBottom: '6px' }}>
                <a href={`/?source=${source}`} style={{ fontSize: '14px' }}>{source}</a>
              </div>
            ))}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Contribute</div>
            <p style={{ fontSize: '14px', marginBottom: '10px' }}>Have a story? Submit it for review.</p>
            <Link href="/submit" className="wiki-btn" style={{ display: 'block', textAlign: 'center' }}>Submit Article</Link>
          </div>
        </aside>
      </main>
    </div>
  )
}