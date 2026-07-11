import { useNavigate } from 'react-router-dom'
import { useEffect, useState, type ReactNode } from 'react'

/* ---------- shared split layout: left = functional, right = value-prop carousel ---------- */

const SLIDES = [
  {
    eyebrow: 'For Italian freelancers paid in crypto',
    title: 'Crypto invoices, taxes in order.',
    text: 'Electronic invoicing via SDI, Bitcoin and stablecoin payments straight to your wallet, and a year-end pack ready for your commercialista.',
    visual: (
      <div className="mock-invoice">
        <div className="mi-head"><span className="mi-n">FATTURA 2026/0015</span><span className="mi-n">via SDI ✓</span></div>
        <div className="mi-amt">€ 3.200,00</div>
        <div className="mi-crypto">≈ 0.0362 BTC · also payable in USDC or bank transfer</div>
        <div className="row" style={{ gap: 6 }}>
          <span className="chip chip-ok chip-dot">Paid</span>
          <span className="chip chip-info">SDI · Delivered</span>
        </div>
        <div className="mock-toast"><span className="ok-dot" /> Payment received — 0.0362 BTC</div>
      </div>
    ),
  },
  {
    eyebrow: 'Non-custodial by principle',
    title: 'Your money never passes through us.',
    text: 'Your client pays from their wallet directly to yours. Billiamo prepares the invoice, verifies the payment and updates the ledger — without ever touching the funds.',
    visual: (
      <div className="mock-invoice" style={{ textAlign: 'center' }}>
        <div className="row" style={{ justifyContent: 'center', gap: 14, fontSize: 14, fontWeight: 600 }}>
          <span>Client wallet</span>
          <span style={{ color: 'var(--orange)', fontFamily: 'var(--mono)', letterSpacing: 2 }}>––––▶</span>
          <span>Your wallet</span>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--grey-dark)', marginTop: 10 }}>
          BTC · USDC · EURC · bank transfer
        </div>
        <div className="mock-toast"><span className="ok-dot" /> Zero fees on payments</div>
      </div>
    ),
  },
  {
    eyebrow: 'At year-end, zero panic',
    title: 'Your accountant finds everything ready.',
    text: 'EUR value at receipt, capital gains, stamp duty, FatturaPA XML: one complete pack, shared with a link. No spreadsheets.',
    visual: (
      <div className="mock-invoice">
        <div className="mi-n" style={{ marginBottom: 10 }}>TAX PACK 2026 · v2</div>
        {['Issued invoices (CSV + XML)', 'Crypto movements + capital gains', 'Forfettario summary (PDF)'].map(x => (
          <div key={x} className="row" style={{ fontSize: 13.5, gap: 8, marginBottom: 6 }}>
            <span style={{ color: 'var(--ok)', fontWeight: 700 }}>✓</span>{x}
          </div>
        ))}
        <div className="mock-toast"><span className="ok-dot" /> Sent to the accountant</div>
      </div>
    ),
  },
]

function AuthLayout({ children }: { children: ReactNode }) {
  const [slide, setSlide] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5200)
    return () => clearInterval(id)
  }, [])
  const s = SLIDES[slide]
  return (
    <div className="auth-split">
      <div style={{ background: 'var(--off-white-1)', display: 'flex' }}>
        <div className="auth-form">{children}</div>
      </div>
      <div className="auth-hero">
        <div key={slide} className="auth-slide">
          <div className="eyebrow">{s.eyebrow}</div>
          <h2>{s.title}</h2>
          <p>{s.text}</p>
          <div style={{ minHeight: 150 }}>{s.visual}</div>
        </div>
        <div className="auth-dots">
          {SLIDES.map((_, i) => (
            <button key={i} className={i === slide ? 'on' : ''} aria-label={`Slide ${i + 1}`} onClick={() => setSlide(i)} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- screens ---------- */

export function Landing() {
  const nav = useNavigate()
  return (
    <AuthLayout>
      <div className="auth-logo"><b>B</b> Billiamo</div>
      <h1>Start for free</h1>
      <p className="sub">Create your account in one click. No fiscal profile, no card — that comes later, when it's needed.</p>
      <button className="gbtn" style={{ marginTop: 0, border: '1px solid var(--input-border)', justifyContent: 'center', width: '100%', maxWidth: 340 }} onClick={() => nav('/benvenuto')}>
        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3c-2 1.5-4.6 2.5-7.3 2.5-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4 5.6l6.3 5.3C41.4 35.4 44 30.1 44 24c0-1.3-.1-2.7-.4-3.9z"/></svg>
        Continue with Google
      </button>
      <p className="auth-note">30-day trial · no card required · account ready in 60 seconds</p>
      <p className="auth-legal">By continuing you accept the <a href="#">Terms of service</a> and <a href="#">Privacy policy</a>.</p>
    </AuthLayout>
  )
}

export function Welcome() {
  const nav = useNavigate()
  return (
    <AuthLayout>
      <div className="auth-logo"><b>B</b> Billiamo</div>
      <h1>Hi Giulia! 👋</h1>
      <p className="sub">
        Your account is ready. Explore right away — complete your fiscal profile whenever you like: it's only needed to <b>send</b> invoices, not to create them.
      </p>
      <button className="btn btn-primary" style={{ maxWidth: 340, justifyContent: 'center' }} onClick={() => nav('/dashboard')}>
        Go to the dashboard →
      </button>
      <p className="auth-note">Tip: the dashboard has a checklist to set everything up at your own pace.</p>
    </AuthLayout>
  )
}
