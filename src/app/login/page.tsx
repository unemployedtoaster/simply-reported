'use client'
import Link from 'next/link'

export default function LoginPage() {
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
      <main className="wiki-container" style={{ marginTop: '80px', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Linux Libertine, Georgia, serif', fontSize: '28px', marginBottom: '12px' }}>
          Sign In
        </h1>
        <p style={{ color: '#54595d', marginBottom: '32px', fontSize: '14px' }}>
          Sign in to submit articles and access more features.
        </p>
        
        <a
          href="/api/auth/signin/google"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '12px 24px',
            border: '1px solid #a2a9b1',
            background: '#ffffff',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#202122',
            textDecoration: 'none',
            width: '100%',
          }}
        >
          Continue with Google
        </a>
      </main>
    </div>
  )
}