import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, X, Send } from 'lucide-react'
import { ytd, fmt } from '../data/fake'

interface Msg { role: 'user' | 'ai'; text: string; action?: { label: string; to: string } }

const QUICK = ['Create an invoice for Nakamoto Labs', 'What needs my attention?', "How's my tax year looking?", 'Why was invoice 0014 rejected?']

// canned intelligence — keyword routing over the fake data
function reply(q: string): Msg {
  const s = q.toLowerCase()
  if (s.includes('create') || s.includes('invoice for') || s.includes('new invoice')) {
    return {
      role: 'ai',
      text: 'I\'ve prepared a draft invoice for Nakamoto Labs Inc. — €3,200.00, based on your last invoice to them ("Smart contract development"). Review the lines and hit Send when ready.',
      action: { label: 'Open the draft', to: '/fatture/nuova' },
    }
  }
  if (s.includes('attention') || s.includes('to do') || s.includes('todo')) {
    return {
      role: 'ai',
      text: '3 things need you: ① Invoice 2026/0014 was rejected by SDI (error 00305) — 4 days left to fix it. ② Invoice 2026/0012 is 1 day overdue (€5,200 from Nakamoto Labs). ③ 2026/0011 is only partially paid — €1,600 outstanding.',
      action: { label: 'Fix the SDI rejection first', to: '/fatture/i14/correzione' },
    }
  }
  if (s.includes('tax') || s.includes('year') || s.includes('irpef') || s.includes('imposta')) {
    return {
      role: 'ai',
      text: `YTD you've invoiced ${fmt(ytd.ricavi)} — ${ytd.capPct}% of the €85,000 forfettario cap, so plenty of headroom. Estimated imposta sostitutiva: ${fmt(ytd.imposta)} (5% rate), estimated INPS: ${fmt(ytd.inps)}. Next deadline: Modello Redditi PF on 31 October.`,
      action: { label: 'See the full report', to: '/report' },
    }
  }
  if (s.includes('0014') || s.includes('reject') || s.includes('scartata')) {
    return {
      role: 'ai',
      text: 'SDI error 00305 means the client\'s VAT ID wasn\'t recognised by the Italian tax registry. Chainwerk GmbH is a German company — the VAT number likely needs to go in the foreign-ID field instead. This happens to ~5% of invoices and is a 2-minute fix.',
      action: { label: 'Open guided correction', to: '/fatture/i14/correzione' },
    }
  }
  if (s.includes('overdue') || s.includes('remind') || s.includes('chase')) {
    return {
      role: 'ai',
      text: 'Invoice 2026/0012 (€5,200, Nakamoto Labs Inc.) is 1 day overdue. I can\'t send reminders on my own — but the reminder email is ready on the invoice page, one click away.',
      action: { label: 'Go to invoice 2026/0012', to: '/fatture/i12' },
    }
  }
  return {
    role: 'ai',
    text: 'I can help you create invoices, chase payments, explain SDI errors, or summarise your tax position. Try one of the suggestions — or ask me anything about your data.',
  }
}

export default function Assistant() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const nav = useNavigate()
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bodyRef.current?.scrollTo({ top: 99999, behavior: 'smooth' }) }, [msgs, thinking])

  const ask = (q: string) => {
    if (!q.trim()) return
    setMsgs(m => [...m, { role: 'user', text: q }])
    setInput('')
    setThinking(true)
    setTimeout(() => { setMsgs(m => [...m, reply(q)]); setThinking(false) }, 700)
  }

  return (
    <>
      {!open && (
        <button className="ai-fab" onClick={() => setOpen(true)} aria-label="Open assistant">
          <Sparkles size={20} />
        </button>
      )}
      {open && (
        <div className="ai-panel">
          <div className="ai-head">
            <Sparkles size={16} color="var(--orange)" />
            <span style={{ fontWeight: 600, fontSize: 14 }}>Billiamo Assistant</span>
            <span className="spacer" />
            <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)} aria-label="Close"><X size={16} /></button>
          </div>
          <div className="ai-body" ref={bodyRef}>
            {msgs.length === 0 && (
              <div className="ai-welcome">
                <p style={{ fontSize: 13.5, color: 'var(--grey-dark)', marginBottom: 12 }}>
                  Ask me anything about your invoices, payments or taxes — or tell me what to do.
                </p>
                <div className="ai-quick">
                  {QUICK.map(q => <button key={q} onClick={() => ask(q)}>{q}</button>)}
                </div>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={'ai-msg ' + m.role}>
                <div className="bubble">{m.text}</div>
                {m.action && (
                  <button className="btn btn-primary btn-sm" style={{ marginTop: 6 }} onClick={() => { nav(m.action!.to); setOpen(false) }}>
                    {m.action.label} →
                  </button>
                )}
              </div>
            ))}
            {thinking && <div className="ai-msg ai"><div className="bubble thinking">…</div></div>}
          </div>
          <div className="ai-input">
            <input
              value={input}
              placeholder="Ask or instruct…"
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && ask(input)}
            />
            <button className="btn btn-primary btn-sm" onClick={() => ask(input)} aria-label="Send"><Send size={15} /></button>
          </div>
          <div className="ai-privacy">Runs only when you ask — nothing is sent to AI automatically.</div>
        </div>
      )}
    </>
  )
}
