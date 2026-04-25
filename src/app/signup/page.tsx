import { signUp } from './actions'
import Link from 'next/link'

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string }
}) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div style={{ background: 'var(--ink)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 20%, rgba(42,76,138,0.25), transparent 60%)' }} />
        <Link href="/" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--paper)', textDecoration: 'none', position: 'relative' }}>Atelier</Link>
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 'clamp(36px,4vw,60px)', fontWeight: 300, color: 'var(--paper)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 24 }}>
            Open your<br /><em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>studio.</em>
          </div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: 'rgba(245,240,232,0.5)', lineHeight: 1.7 }}>
            Join a community where your identity is built by what you make, not what you've made.
          </div>
        </div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'rgba(245,240,232,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', position: 'relative' }}>Hyderabad · 2025</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>✦ Join Atelier</div>
            <h1 style={{ fontSize: 36, fontWeight: 300, letterSpacing: '-0.02em' }}>Create account</h1>
          </div>

          {searchParams?.message ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>✉️</div>
              <div style={{ fontSize: 20, fontWeight: 300, marginBottom: 12 }}>Check your email</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>{searchParams.message}</div>
            </div>
          ) : (
            <form action={signUp} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Email</div>
                <input name="email" type="email" placeholder="your@email.com" required style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--rule)', background: 'transparent', outline: 'none', fontFamily: "'DM Mono',monospace", fontSize: 13, color: 'var(--ink)' }} />
              </div>
              <div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Password</div>
                <input name="password" type="password" placeholder="At least 8 characters" required style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--rule)', background: 'transparent', outline: 'none', fontFamily: "'DM Mono',monospace", fontSize: 13, color: 'var(--ink)' }} />
              </div>
              {searchParams?.error && <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'var(--accent)' }}>{searchParams.error}</div>}
              <button type="submit" style={{ width: '100%', padding: '16px', background: 'var(--ink)', color: 'var(--paper)', border: 'none', cursor: 'pointer', fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 8 }}>
                Create Account →
              </button>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'var(--muted)', lineHeight: 1.6 }}>By signing up you agree to our terms. No spam, ever.</div>
            </form>
          )}

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--rule)', fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
