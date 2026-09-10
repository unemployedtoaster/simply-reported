import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { supabaseAdmin } from './supabase'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'fallback_secret_for_build',
  callbacks: {
    async signIn({ user }) {
      try {
        await supabaseAdmin.from('users').upsert({
          id: user.id,
          email: user.email,
          name: user.name,
          avatar_url: user.image,
        })
      } catch {}
      return true
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub!
      }
      return session
    },
  },
})