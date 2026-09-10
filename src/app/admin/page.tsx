'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  content: string
  source: string
  slug: string
  author: string
  created_at: string
  approved: boolean
  user_submitted: boolean
}

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPending()
  }, [])

  async function fetchPending() {
    const res = await fetch('/api/admin/pending')
    const data = await res.json()
    setArticles(data)
    setLoading(false)
  }

  async function approve(id: string) {
    await fetch('/api/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setArticles(prev => prev.filter(a => a.id !== id))
  }

  async function reject(id: string) {
    await fetch('/api/admin/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setArticles(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div>
      <header className="wiki-header">
        <div className="wiki-container">
          <nav className="wiki-nav">
            <Link href="/" className="wiki-logo">Simply Reported</Link>
            <span style={{ fontSize: '14px', color: '#54595d' }}>Admin Panel</span>
          </nav>
        </div>
      </header>
      <main className="wiki-container" style={{ marginTop: '30px' }}>
        <h1 style={{ fontFamily: 'Linux Libertine, Georgia, serif', fontSize: '28px', borderBottom: '1px solid #a2a9b1', paddingBottom: '10px', marginBottom: '24px' }}>
          Pending Articles
        </h1>
        {loading ? (
          <p style={{ color: '#54595d' }}>Loading...</p>
        ) : articles.length === 0 ? (
          <p style={{ color: '#54595d' }}>No pending articles.</p>
        ) : (
          articles.map(article => (
            <div key={article.id} className="article-card">
              <div className="article-title">{article.title}</div>
              <div className="article-meta" style={{ marginBottom: '10px' }}>
                {new Date(article.created_at).toLocaleDateString()} &bull; {article.author} &bull; {article.source}
              </div>
              <div className="article-excerpt" style={{ marginBottom: '16px' }}>
                {article.content.slice(0, 400)}...
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="wiki-btn wiki-btn-primary" onClick={() => approve(article.id)}>Approve</button>
                <button className="wiki-btn" onClick={() => reject(article.id)} style={{ borderColor: '#cc0000', color: '#cc0000' }}>Reject</button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}