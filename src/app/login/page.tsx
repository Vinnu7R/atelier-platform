import { login } from './actions'
import Link from 'next/link'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string }
}) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div style={{ background: 'var(--ink)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 80%, rgba(200,80,42,0.2), transparent 60%)' }} />
        <Link href="/" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--paper)', textDecoration: 'none', position: 'relative' }}>Atelier</Link>
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 'clamp(36px,4vw,60px)', fontWeight: 300, color: 'var(--paper)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 24 }}>
            Your studio<br />awaits.
          </div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: 'rgba(245,240,232,0.5)', lineHeight: 1.7 }}>
            Sign in to your Atelier account and get back to what you're building.
          </div>
        </div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'rgba(245,240,232,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', position: 'relative' }}>Hyderabad · 2025</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>Welcome back</div>
            <h1 style={{ fontSize: 36, fontWeight: 300, letterSpacing: '-0.02em' }}>Sign in</h1>
          </div>

          <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Email</div>
              <input name="email" type="email" placeholder="your@email.com" required style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--rule)', background: 'transparent', outline: 'none', fontFamily: "'DM Mono',monospace", fontSize: 13, color: 'var(--ink)' }} />
            </div>
            <div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Password</div>
              <input name="password" type="password" placeholder="••••••••" required style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--rule)', background: 'transparent', outline: 'none', fontFamily: "'DM Mono',monospace", fontSize: 13, color: 'var(--ink)' }} />
            </div>
            {searchParams?.error && <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'var(--accent)' }}>{searchParams.error}</div>}
            {searchParams?.message && <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'var(--accent2)' }}>{searchParams.message}</div>}
            <button type="submit" style={{ width: '100%', padding: '16px', background: 'var(--ink)', color: 'var(--paper)', border: 'none', cursor: 'pointer', fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 8 }}>
              Sign In →
            </button>
          </form>

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--rule)', fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link href="/signup" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Join Atelier</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
