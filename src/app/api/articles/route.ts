import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const source = searchParams.get('source')
  const search = searchParams.get('search')

  let query = supabaseAdmin
    .from('articles')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (source) query = query.eq('source', source)
  if (search) query = query.ilike('title', `%${search}%`)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { title, content, author } = body

  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content required' }, { status: 400 })
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()

  const { data, error } = await supabaseAdmin.from('articles').insert({
    title,
    content,
    original_url: '',
    source: 'User Submitted',
    image_urls: [],
    slug,
    author: author || 'Anonymous',
    user_submitted: true,
    approved: false,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}