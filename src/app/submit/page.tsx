'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SubmitPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author }),
    })

    if (res.ok) {
      setSubmitted(true)
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong')
    }
    setLoading(false)
  }

  if (submitted) return (
    <div>
      <header className="wiki-header">
        <div className="wiki-container">
          <nav className="wiki-nav">
            <Link href="/" className="wiki-logo">Simply Reported</Link>
          </nav>
        </div>
      </header>
      <div className="wiki-container" style={{ marginTop: '60px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Linux Libertine, Georgia, serif', fontSize: '28px', marginBottom: '16px' }}>Article Submitted</h2>
        <p style={{ color: '#54595d', marginBottom: '20px' }}>Your article has been submitted for review. It will appear on the site once approved.</p>
        <Link href="/" className="wiki-btn wiki-btn-primary">Back to Home</Link>
      </div>
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

      <main className="wiki-container" style={{ marginTop: '30px', maxWidth: '700px' }}>
        <h1 style={{ fontFamily: 'Linux Libertine, Georgia, serif', fontSize: '28px', borderBottom: '1px solid #a2a9b1', paddingBottom: '10px', marginBottom: '24px' }}>
          Submit an Article
        </h1>

        <p style={{ color: '#54595d', marginBottom: '24px', fontSize: '14px' }}>
          Submit a news article for review. All submissions are reviewed before publishing.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '14px' }}>Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #a2a9b1', fontSize: '16px', outline: 'none' }}
              placeholder="Article headline"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '14px' }}>Your Name</label>
            <input
              value={author}
              onChange={e => setAuthor(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #a2a9b1', fontSize: '16px', outline: 'none' }}
              placeholder="Optional"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '14px' }}>Content</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              rows={16}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #a2a9b1', fontSize: '15px', outline: 'none', resize: 'vertical', lineHeight: '1.6' }}
              placeholder="Write your article here..."
            />
          </div>

          {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

          <button type="submit" className="wiki-btn wiki-btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', padding: '10px 24px' }}>
            {loading ? 'Submitting...' : 'Submit Article'}
          </button>
        </form>
      </main>
    </div>
  )
}