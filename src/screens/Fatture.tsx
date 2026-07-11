import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Card, Chip, Modal, useToast } from '../components/ui'
import { invoices, fmt, clientById, clients, lifecycleChip, sdiChip, payChip, profile, type Invoice } from '../data/fake'
import { FileText, Send, Eye, Bell, ClipboardPaste, AlertCircle, Clock } from 'lucide-react'

/* ---------------- list ---------------- */
export function InvoiceList() {
  const [filter, setFilter] = useState('All')
  const nav = useNavigate()
  const filters = ['All', 'Drafts', 'Open', 'Paid', 'Issues']
  const filtered = invoices.filter(i => {
    if (filter === 'Drafts') return i.lifecycle === 'draft'
    if (filter === 'Open') return ['sent', 'viewed', 'overdue', 'partially_paid'].includes(i.lifecycle)
    if (filter === 'Paid') return i.lifecycle === 'paid'
    if (filter === 'Issues') return i.sdi === 'rejected' || i.lifecycle === 'overdue'
    return true
  })
  return (
    <div className="stack">
      <div className="row">
        {filters.map(f => (
          <button key={f} className={'btn btn-sm ' + (f === filter ? 'btn-primary' : 'btn-secondary')} onClick={() => setFilter(f)}>{f}</button>
        ))}
        <span className="spacer" />
        <input placeholder="Search by number or client…" style={{ border: '1px solid var(--input-border)', borderRadius: 8, padding: '8px 12px', width: 240 }} />
      </div>
      <Card>
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="icon"><FileText size={40} strokeWidth={1.2} /></div>
            <h3>No invoices here</h3>
            <p>Try another filter, or create your next invoice.</p>
            <Link to="/fatture/nuova" className="btn btn-primary">New invoice</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead><tr><th>Number</th><th>Client</th><th>Amount</th><th>Status</th><th>SDI</th><th>Payment</th><th>Issued</th><th>Due</th></tr></thead>
              <tbody>
                {filtered.map(i => {
                  const c = clientById(i.clientId)
                  return (
                    <tr key={i.id} className="rowlink" onClick={() => nav(`/fatture/${i.id}`)}>
                      <td className="mono">{i.n}</td>
                      <td>{c.name}</td>
                      <td className="num" style={{ fontWeight: 600 }}>{fmt(i.amountEur)}</td>
                      <td><Chip {...lifecycleChip[i.lifecycle]} /></td>
                      <td><Chip {...sdiChip[i.sdi]} /></td>
                      <td><Chip {...payChip[i.pay]} /></td>
                      <td className="mono">{i.date}</td>
                      <td className="mono">{i.due}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

/* ---------------- editor ---------------- */
export function InvoiceEditor() {
  const [clientId, setClientId] = useState('')
  const [lines, setLines] = useState([{ desc: '', qty: 1, price: 0 }])
  const [rails, setRails] = useState({ BTC: true, USDC: true, EURC: false, IBAN: true })
  const [preview, setPreview] = useState(false)
  const [sent, setSent] = useState(false)
  const nav = useNavigate()

  const client = clientId ? clientById(clientId) : null
  const total = lines.reduce((s, l) => s + l.qty * l.price, 0)
  const bollo = total > 77.47
  const grand = total + (bollo ? 2 : 0)
  const btcEq = total > 0 ? (total / 88300).toFixed(4) : null
  const gateOk = profile.complete
  const checks = [
    { ok: gateOk, label: 'Fiscal profile complete' },
    { ok: !!clientId, label: 'Client selected' },
    { ok: lines.some(l => l.desc && l.price > 0), label: 'At least one line filled in' },
    { ok: Object.values(rails).some(Boolean), label: 'A payment method is active' },
  ]
  const canSend = checks.every(c => c.ok)

  if (sent) {
    return (
      <Card style={{ maxWidth: 560, margin: '48px auto', textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 44 }}>✓</div>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 26, margin: '8px 0' }}>Invoice sent</h2>
        <p style={{ color: 'var(--grey-dark)', fontSize: 14, marginBottom: 6 }}>
          Email sent to {clientById(clientId || 'c1').email} with the PDF and payment link.
        </p>
        <p style={{ color: 'var(--grey-dark)', fontSize: 13, marginBottom: 20 }}>
          SDI submission is underway — the status will appear on the invoice in a few minutes.
        </p>
        <div className="row" style={{ justifyContent: 'center', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => { navigator.clipboard?.writeText('https://pay.billiamo.app/tok_8f2a91'); }}>
            Copy payment link
          </button>
          <Link to="/pay/demo" className="btn btn-secondary btn-sm">View payment page</Link>
          <button className="btn btn-primary btn-sm" onClick={() => nav('/fatture')}>Go to invoices</button>
        </div>
      </Card>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 18, alignItems: 'start' }}>
      {/* the invoice IS the form — edit it like the document it becomes */}
      <div className="inv-doc">
        <div className="row" style={{ alignItems: 'flex-start', marginBottom: 36 }}>
          <div className="row" style={{ gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--dark)', color: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 600 }}>{profile.initials}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{profile.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--grey-dark)' }}>{profile.address}<br />P.IVA {profile.piva} · C.F. {profile.cf}</div>
            </div>
          </div>
          <span className="spacer" />
          <div style={{ textAlign: 'right' }}>
            <div className="doc-title">Fattura</div>
            <div className="doc-n">N° 2026/0016 · auto</div>
            <div style={{ fontSize: 13, color: 'var(--grey-dark)', marginTop: 8, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
              <span>Issued <input type="date" defaultValue="2026-07-11" style={{ fontSize: 13 }} /></span>
              <span>Due <input type="date" defaultValue="2026-08-10" style={{ fontSize: 13 }} /></span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div className="doc-n" style={{ marginBottom: 6 }}>BILL TO</div>
          <div className={'inv-billto' + (client ? ' filled' : '')} style={{ display: 'inline-block' }}>
            {client ? (
              <div className="row" style={{ gap: 14 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{client.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--grey-dark)' }}>{client.vat} · {client.email}</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setClientId('')}>Change</button>
              </div>
            ) : (
              <div>
                <select value={clientId} onChange={e => setClientId(e.target.value)} style={{ fontSize: 14, minWidth: 220 }}>
                  <option value="">+ Select or add a client…</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name} · {c.vat}</option>)}
                </select>
                <div style={{ fontSize: 12, color: 'var(--grey)', marginTop: 4 }}>New client? <Link to="/clienti/nuovo" style={{ color: 'var(--orange-deep)' }}>Add them</Link> — Italian P.IVA autofills everything.</div>
              </div>
            )}
          </div>
        </div>

        <div className="inv-line head"><span>Description</span><span style={{ textAlign: 'right' }}>Qty</span><span style={{ textAlign: 'right' }}>Price</span><span style={{ textAlign: 'right' }}>Amount</span><span /></div>
        {lines.map((l, idx) => (
          <div key={idx} className="inv-line">
            <input value={l.desc} placeholder="Describe the work…" onChange={e => setLines(ls => ls.map((x, i) => i === idx ? { ...x, desc: e.target.value } : x))} />
            <input type="number" value={l.qty} min={1} onChange={e => setLines(ls => ls.map((x, i) => i === idx ? { ...x, qty: +e.target.value } : x))} />
            <input type="number" value={l.price || ''} placeholder="0.00" onChange={e => setLines(ls => ls.map((x, i) => i === idx ? { ...x, price: +e.target.value } : x))} />
            <span className="amt">{fmt(l.qty * l.price)}</span>
            <button className="rm" aria-label="Remove line" onClick={() => setLines(ls => ls.length > 1 ? ls.filter((_, i) => i !== idx) : ls)}>×</button>
          </div>
        ))}
        <button className="inv-addline" onClick={() => setLines(ls => [...ls, { desc: '', qty: 1, price: 0 }])}>+ Add line</button>

        <div className="inv-totals" style={{ marginTop: 24 }}>
          <div className="t-row"><span style={{ color: 'var(--grey-dark)' }}>Subtotal</span><span className="num">{fmt(total)}</span></div>
          {bollo && <div className="t-row"><span style={{ color: 'var(--grey-dark)' }}>Marca da bollo <span title="Required on no-VAT invoices above €77.47" style={{ cursor: 'help' }}>ⓘ</span></span><span className="num">€ 2,00</span></div>}
          <div className="t-row t-total"><span>Total</span><span className="num">{fmt(grand)}</span></div>
          {btcEq && <div style={{ fontSize: 12, color: 'var(--grey-dark)', textAlign: 'right' }}>≈ {btcEq} BTC at current rate</div>}
        </div>

        <div style={{ marginTop: 32 }}>
          <div className="doc-n" style={{ marginBottom: 8 }}>CLIENT CAN PAY WITH</div>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
            {(['BTC', 'USDC', 'EURC', 'IBAN'] as const).map(r => (
              <button key={r} className={'rail-chip' + (rails[r] ? ' on' : '')} disabled={r === 'EURC'}
                title={r === 'EURC' ? 'Not enabled in your accounts' : undefined}
                onClick={() => setRails(x => ({ ...x, [r]: !x[r] }))}>
                {rails[r] ? '✓ ' : ''}{{ BTC: 'Bitcoin', USDC: 'USDC', EURC: 'EURC', IBAN: 'Bank transfer' }[r]}
              </button>
            ))}
          </div>
        </div>

        <div className="inv-legal">
          Operazione senza applicazione dell'IVA ai sensi dell'art. 1, commi 54–89, L. 190/2014 — regime forfettario.
        </div>
      </div>

      {/* right panel — requirements before sending */}
      <div className="stack" style={{ position: 'sticky', top: 96 }}>
        <Card title="Before you send">
          <div className="checklist">
            {checks.map((c, i) => (
              <div key={i} className={'item' + (c.ok ? ' done' : '')}>
                <span className="box">{c.ok ? '✓' : ''}</span>{c.label}
              </div>
            ))}
          </div>
          {!gateOk && (
            <div style={{ marginTop: 12, fontSize: 13, background: 'var(--warn-bg)', borderRadius: 8, padding: '10px 12px', color: 'var(--warn)' }}>
              Sending requires a complete fiscal profile. <Link to="/account" style={{ fontWeight: 600 }}>Complete it now</Link> — your draft stays saved.
            </div>
          )}
          <div className="stack" style={{ marginTop: 16, gap: 8 }}>
            <button className="btn btn-secondary" onClick={() => setPreview(true)} disabled={total === 0}><Eye size={16} /> Preview PDF</button>
            <button className="btn btn-primary" disabled={!canSend} onClick={() => setSent(true)}><Send size={16} /> Create & send</button>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--grey)' }}>Draft autosaved · 12:04</div>
        </Card>
      </div>

      {preview && (
        <Modal onClose={() => setPreview(false)}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>PDF preview</div>
          <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 28, fontSize: 13, background: '#fff' }}>
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 19, fontWeight: 600 }}>{profile.name}</div>
                <div style={{ color: 'var(--grey-dark)' }}>{profile.address}<br />P.IVA {profile.piva} · C.F. {profile.cf}</div>
              </div>
              <span className="spacer" />
              <div style={{ textAlign: 'right' }}>
                <div className="mono">FATTURA 2026/0016</div>
                <div style={{ color: 'var(--grey-dark)' }}>11 luglio 2026</div>
              </div>
            </div>
            <div className="divider" />
            <div style={{ color: 'var(--grey-dark)', marginBottom: 12 }}>Bill to: {client ? client.name : '—'}</div>
            {lines.filter(l => l.desc).map((l, i) => (
              <div key={i} className="row" style={{ fontSize: 13 }}><span>{l.desc} × {l.qty}</span><span className="spacer" /><span className="num">{fmt(l.qty * l.price)}</span></div>
            ))}
            {bollo && <div className="row" style={{ fontSize: 13 }}><span>Marca da bollo</span><span className="spacer" /><span className="num">€ 2,00</span></div>}
            <div className="divider" />
            <div className="row" style={{ fontWeight: 600 }}><span>Totale</span><span className="spacer" /><span className="num">{fmt(grand)}</span></div>
            <div style={{ marginTop: 16, fontSize: 11, color: 'var(--grey)' }}>
              Operazione senza applicazione dell'IVA ai sensi dell'art. 1, commi 54–89, L. 190/2014 — regime forfettario.
            </div>
          </div>
          <div className="row" style={{ marginTop: 16 }}>
            <span className="spacer" /><button className="btn btn-secondary btn-sm" onClick={() => setPreview(false)}>Close</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ---------------- detail ---------------- */
export function InvoiceDetail() {
  const { id } = useParams()
  const inv = invoices.find(i => i.id === id) ?? invoices[0]
  const c = clientById(inv.clientId)
  const [toast, showToast] = useToast()
  const [txOpen, setTxOpen] = useState(false)
  const paid = inv.payments.reduce((s, p) => s + p.eur, 0)

  const tl = buildTimeline(inv)

  return (
    <div className="stack">
      <div className="row">
        <div>
          <div className="eyebrow plain">INVOICE</div>
          <div className="page-title" style={{ fontSize: 28 }}>{inv.n} · {c.name}</div>
        </div>
        <span className="spacer" />
        <Chip {...lifecycleChip[inv.lifecycle]} /> <Chip {...sdiChip[inv.sdi]} /> <Chip {...payChip[inv.pay]} />
      </div>

      {inv.sdi === 'rejected' && (
        <div className="banner" style={{ background: 'var(--err-bg)', borderColor: '#e6b8b8' }}>
          <AlertCircle size={18} color="var(--err)" />
          <span><b>Rejected by SDI</b> — error {inv.sdiError?.code}. You have 4 days to correct and resubmit. It happens to ~5% of invoices — it's a two-minute fix.</span>
          <span className="spacer" />
          <Link to={`/fatture/${inv.id}/correzione`} className="btn btn-primary btn-sm">Fix it now</Link>
        </div>
      )}
      {inv.sdi === 'not_delivered' && (
        <div className="banner" style={{ background: 'var(--info-bg)', borderColor: 'var(--border)' }}>
          <Clock size={18} color="var(--grey-dark)" />
          <span><b>Not delivered (Mancata Consegna)</b> — the invoice reached the client's tax inbox (cassetto fiscale). It is fiscally valid: no action needed.</span>
        </div>
      )}

      <div className="grid g2" style={{ alignItems: 'start' }}>
        <div className="stack">
          <Card title="Details">
            {inv.lines.map((l, i) => (
              <div key={i} className="row" style={{ fontSize: 14 }}><span>{l.desc} × {l.qty}</span><span className="spacer" /><span className="num">{fmt(l.qty * l.price)}</span></div>
            ))}
            {inv.bollo && <div className="row" style={{ fontSize: 14, color: 'var(--grey-dark)' }}><span>Marca da bollo</span><span className="spacer" /><span className="num">€ 2,00</span></div>}
            <div className="divider" />
            <div className="row" style={{ fontWeight: 600, fontSize: 16 }}><span>Total</span><span className="spacer" /><span className="num">{fmt(inv.amountEur)}</span></div>
            <div className="row" style={{ marginTop: 16, gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => showToast('PDF downloaded')}>Download PDF</button>
              <button className="btn btn-secondary btn-sm" onClick={() => showToast('FatturaPA XML downloaded')}>FatturaPA XML</button>
              <Link to="/pay/demo" className="btn btn-secondary btn-sm">Payment page</Link>
              {['sent', 'overdue', 'partially_paid'].includes(inv.lifecycle) && (
                <button className="btn btn-secondary btn-sm" onClick={() => showToast('Reminder sent to ' + c.email)}><Bell size={14} /> Send reminder</button>
              )}
            </div>
          </Card>

          <Card title="Payments">
            {inv.payments.length === 0 ? (
              <div style={{ fontSize: 14, color: 'var(--grey-dark)' }}>No payments received yet.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead><tr><th>Date</th><th>Method</th><th>Amount</th><th>Crypto</th><th>Source</th></tr></thead>
                  <tbody>
                    {inv.payments.map(p => (
                      <tr key={p.id}>
                        <td className="mono">{p.date}</td><td>{p.rail}</td>
                        <td className="num" style={{ fontWeight: 600 }}>{fmt(p.eur)}</td>
                        <td className="mono">{p.crypto ?? '—'}</td><td style={{ fontSize: 12.5, color: 'var(--grey-dark)' }}>{p.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {inv.lifecycle === 'partially_paid' && (
              <div style={{ marginTop: 10, fontSize: 13.5, background: 'var(--warn-bg)', borderRadius: 8, padding: '8px 12px', color: 'var(--warn)' }}>
                Received {fmt(paid)} of {fmt(inv.amountEur)} — outstanding balance {fmt(inv.amountEur - paid)}.
              </div>
            )}
            {inv.pay !== 'confirmed' && inv.lifecycle !== 'draft' && (
              <div className="row" style={{ marginTop: 14, gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setTxOpen(true)}><ClipboardPaste size={14} /> Paste tx hash</button>
                <button className="btn btn-ghost btn-sm" onClick={() => showToast('Marked as paid (manual)')}>Mark paid manually</button>
              </div>
            )}
          </Card>
        </div>

        <Card title="Timeline">
          <div className="timeline">
            {tl.map((t, i) => (
              <div key={i} className={'tl-item ' + t.cls}>
                <div className="tl-dot" />
                <div className="tl-body"><div>{t.label}</div><div className="when">{t.when}</div></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {txOpen && (
        <Modal onClose={() => setTxOpen(false)}>
          <div className="card-title">Confirm with a tx hash</div>
          <p style={{ fontSize: 13.5, color: 'var(--grey-dark)', marginBottom: 14 }}>
            Paste the transaction hash: we verify destination, amount, confirmations and timestamp on-chain.
          </p>
          <div className="field"><label>Tx hash</label><input placeholder="0x… or a BTC hash (64 characters)" /></div>
          <div className="row" style={{ marginTop: 16 }}>
            <span className="spacer" />
            <button className="btn btn-secondary btn-sm" onClick={() => setTxOpen(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={() => { setTxOpen(false); showToast('Transaction verified — payment confirmed ✓') }}>Verify</button>
          </div>
        </Modal>
      )}
      {toast}
    </div>
  )
}

function buildTimeline(inv: Invoice) {
  const out: { label: string; when: string; cls: string }[] = [
    { label: 'Invoice created', when: inv.date + ' · 10:12', cls: 'done' },
  ]
  if (inv.lifecycle !== 'draft') {
    out.push({ label: 'Email sent to client (PDF + link)', when: inv.date + ' · 10:13', cls: 'done' })
    out.push({ label: 'Submitted to SDI via Acubeapi', when: inv.date + ' · 10:14', cls: 'done' })
  }
  if (inv.sdi === 'processing') out.push({ label: 'SDI — processing', when: 'in progress', cls: 'active' })
  if (inv.sdi === 'delivered') out.push({ label: 'SDI — delivered (RC receipt)', when: inv.date + ' · 16:40', cls: 'done' })
  if (inv.sdi === 'not_delivered') out.push({ label: 'SDI — not delivered (MC): in the client\'s cassetto fiscale', when: inv.date + ' · 18:02', cls: 'done' })
  if (inv.sdi === 'rejected') out.push({ label: `SDI — rejected (${inv.sdiError?.code})`, when: '2026-07-09 · 08:51', cls: 'err' })
  for (const p of inv.payments) out.push({ label: `${p.rail} payment confirmed — ${fmt(p.eur)}`, when: p.date, cls: 'done' })
  if (inv.pay === 'awaiting' && inv.lifecycle !== 'draft') out.push({ label: 'Awaiting payment', when: 'due ' + inv.due, cls: 'active' })
  return out
}

/* ---------------- guided correction ---------------- */
export function GuidedCorrection() {
  const { id } = useParams()
  const inv = invoices.find(i => i.id === id) ?? invoices[1]
  const c = clientById(inv.clientId)
  const [piva, setPiva] = useState('DE 314 259 076')
  const [done, setDone] = useState(false)
  const nav = useNavigate()

  if (done) {
    return (
      <Card style={{ maxWidth: 520, margin: '48px auto', textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 44 }}>🎉</div>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 24, margin: '8px 0' }}>Resubmitted to SDI</h2>
        <p style={{ color: 'var(--grey-dark)', fontSize: 14, marginBottom: 20 }}>Same number ({inv.n}) — correcting within the 5-day window keeps the numbering. We'll notify you as soon as SDI responds.</p>
        <button className="btn btn-primary" onClick={() => nav('/fatture/' + inv.id)}>Back to the invoice</button>
      </Card>
    )
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }} className="stack">
      <div className="banner" style={{ background: 'var(--err-bg)', borderColor: '#e6b8b8' }}>
        <AlertCircle size={18} color="var(--err)" />
        <span><b>Correct and resubmit by 14 July</b> — 4 days left in the SDI window. This is routine: ~5% of invoices get rejected, and it's fixable right here.</span>
      </div>
      <Card title={`Guided correction — ${inv.n}`}>
        <div style={{ background: 'var(--surface-alt)', borderRadius: 12, padding: '14px 18px', marginBottom: 18 }}>
          <div className="mono" style={{ color: 'var(--err)', marginBottom: 4 }}>Error code {inv.sdiError?.code}</div>
          <div style={{ fontSize: 14 }}>{inv.sdiError?.msg}</div>
          <div style={{ fontSize: 13, color: 'var(--grey-dark)', marginTop: 8 }}>
            <b>What it means:</b> the VAT number entered for {c.name} isn't recognised by the Italian registry. Usually a typo — or the client is foreign and their VAT ID belongs in the foreign-ID field.
          </div>
        </div>
        <div className="field invalid" style={{ maxWidth: 380 }}>
          <label>Client VAT / tax ID</label>
          <input value={piva} onChange={e => setPiva(e.target.value)} />
          <span className="error">Field flagged by the SDI error</span>
        </div>
        <div className="row" style={{ marginTop: 20 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => nav('/fatture/' + inv.id)}>Cancel</button>
          <span className="spacer" />
          <button className="btn btn-primary" onClick={() => setDone(true)}><Send size={16} /> Resubmit to SDI</button>
        </div>
      </Card>
    </div>
  )
}
