import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Chip, Tabs, Modal, useToast } from '../components/ui'
import {
  invoices, fmt, clientById, payChip, lots, holdings, dispositions,
  fifoPreview, remainingByLot, fmtQty, taxRate, type Disposition,
} from '../data/fake'
import { ChevronDown, ChevronUp, Plus, Lock } from 'lucide-react'

const fiscalMeta: Record<string, { rate: string; src: string; ts: string }> = {
  p1: { rate: '88.298 €/BTC', src: 'Kraken', ts: '2026-05-20 14:32' },
  p2: { rate: '87.719 €/BTC', src: 'Kraken', ts: '2026-06-04 09:15' },
  p3: { rate: '0,9987 €/USDC', src: 'CoinGecko', ts: '2026-06-30 16:48' },
}

export default function Pagamenti() {
  const [tab, setTab] = useState('Payments received')
  return (
    <div className="stack">
      <Tabs tabs={['Payments received', 'Your crypto']} active={tab} onChange={setTab} />
      {tab === 'Payments received' ? <PaymentsReceived /> : <YourCrypto />}
    </div>
  )
}

/* ---------------- money in ---------------- */
function PaymentsReceived() {
  const nav = useNavigate()
  const [openRow, setOpenRow] = useState<string | null>(null)
  const pays = invoices.flatMap(i => i.payments.map(p => ({ ...p, inv: i })))

  return (
    <div className="stack">
      <div>
        <div className="section-title">Money you've been paid</div>
        <div style={{ fontSize: 13.5, color: 'var(--grey-dark)' }}>
          Every payment matched to its invoice — bank and crypto. Crypto payments lock in their EUR value at the moment they arrived, which is what your tax is based on.
        </div>
      </div>
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead><tr><th></th><th>Date</th><th>Invoice</th><th>Client</th><th>Method</th><th>Received</th><th>EUR at receipt</th><th>Status</th></tr></thead>
            <tbody>
              {pays.map(p => {
                const meta = fiscalMeta[p.id]
                const expanded = openRow === p.id
                return [
                  <tr key={p.id} className="rowlink" onClick={() => meta ? setOpenRow(expanded ? null : p.id) : nav('/fatture/' + p.inv.id)}>
                    <td style={{ width: 28, color: 'var(--grey)' }}>{meta ? (expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />) : null}</td>
                    <td className="mono">{p.date}</td>
                    <td className="mono">{p.inv.n}</td>
                    <td>{clientById(p.inv.clientId).name}</td>
                    <td>{p.rail}</td>
                    <td className="mono">{p.crypto ?? '—'}</td>
                    <td className="num" style={{ fontWeight: 600 }}>{fmt(p.eur)}</td>
                    <td><Chip {...payChip['confirmed']} /></td>
                  </tr>,
                  expanded && meta && (
                    <tr key={p.id + '-x'}>
                      <td colSpan={8} style={{ background: 'var(--surface-alt)', borderRadius: 8 }}>
                        <div className="row" style={{ gap: 32, padding: '6px 8px', fontSize: 13, flexWrap: 'wrap' }}>
                          <span><span className="mono" style={{ color: 'var(--grey)' }}>RATE</span>&nbsp; {meta.rate}</span>
                          <span><span className="mono" style={{ color: 'var(--grey)' }}>SOURCE</span>&nbsp; {meta.src}</span>
                          <span><span className="mono" style={{ color: 'var(--grey)' }}>BLOCK TIME</span>&nbsp; {meta.ts}</span>
                          <span className="spacer" />
                          <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); nav('/fatture/' + p.inv.id) }}>View invoice →</button>
                        </div>
                      </td>
                    </tr>
                  ),
                ]
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

/* ---------------- what you hold + what you sold ---------------- */
function YourCrypto() {
  const [logOpen, setLogOpen] = useState(false)
  const [disps, setDisps] = useState<Disposition[]>(dispositions)
  const [toast, showToast] = useToast()
  const hold = holdings(disps)

  const gains = disps.filter(d => d.gain > 0).reduce((s, d) => s + d.gain, 0)
  const losses = disps.filter(d => d.gain < 0).reduce((s, d) => s + Math.abs(d.gain), 0)

  return (
    <div className="stack">
      <div className="banner">
        <span>ⓘ</span>
        <span>
          <b>Sold or spent crypto anywhere else?</b> We can only see what arrives against your invoices — sales on an exchange or payments from your wallet are invisible to us. Log them here so your year-end report is right.
        </span>
        <span className="spacer" />
        <button className="btn btn-primary btn-sm" onClick={() => setLogOpen(true)}><Plus size={15} /> Log a sale or spend</button>
      </div>

      <div>
        <div className="section-title">What you hold today</div>
        <div style={{ fontSize: 13.5, color: 'var(--grey-dark)' }}>
          Crypto you've received and still have, with what it was worth in EUR when it arrived. That original value is what your gain or loss is measured against.
        </div>
      </div>
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead><tr><th>Asset</th><th>Amount you hold</th><th>Worth when received</th><th>From</th><th>If you sold it all today</th></tr></thead>
            <tbody>
              {hold.map(h => (
                <tr key={h.asset}>
                  <td style={{ fontWeight: 600 }}>{h.asset}</td>
                  <td className="mono">{fmtQty(h.amount, h.asset)}</td>
                  <td className="num" style={{ fontWeight: 600 }}>{fmt(h.basis)}</td>
                  <td style={{ fontSize: 13, color: 'var(--grey-dark)' }}>{h.lots} payment{h.lots > 1 ? 's' : ''}</td>
                  <td style={{ fontSize: 13, color: 'var(--grey-dark)' }}>Tax on any gain: {Math.round(taxRate(h.asset) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--grey)' }}>
          Holding crypto isn't taxed — you only owe tax when you sell or spend it. These holdings are also declared in the RW section of your tax return.
        </div>
      </Card>

      <div className="row" style={{ marginTop: 8 }}>
        <div>
          <div className="section-title">Crypto you sold or spent</div>
          <div style={{ fontSize: 13.5, color: 'var(--grey-dark)' }}>Each sale is matched against your oldest crypto first, to work out the gain or loss.</div>
        </div>
        <span className="spacer" />
        <button className="btn btn-primary btn-sm" onClick={() => setLogOpen(true)}><Plus size={15} /> Log a sale or spend</button>
      </div>
      <Card>
        {disps.length === 0 ? (
          <div className="empty">
            <h3>Nothing logged yet</h3>
            <p>When you sell or spend crypto, tell us here and we'll work out what you owe.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead><tr><th>Date</th><th>Sold</th><th>You got</th><th>Was worth</th><th>Gain / loss</th><th>Tax</th><th>Where</th><th></th></tr></thead>
              <tbody>
                {disps.map(d => (
                  <tr key={d.id}>
                    <td className="mono">{d.date}</td>
                    <td className="mono">{fmtQty(d.amount, d.asset)} {d.asset}</td>
                    <td className="num" style={{ fontWeight: 600 }}>{fmt(d.eurReceived)}</td>
                    <td className="num" style={{ color: 'var(--grey-dark)' }}>{fmt(d.costBasis)}</td>
                    <td className="num" style={{ fontWeight: 600, color: d.gain >= 0 ? 'var(--ok)' : 'var(--err)' }}>
                      {d.gain >= 0 ? '+' : '−'}{fmt(Math.abs(d.gain))}
                    </td>
                    <td className="num">{d.gain > 0 ? fmt(d.gain * d.rate) : '—'}</td>
                    <td style={{ fontSize: 13, color: 'var(--grey-dark)' }}>{d.where}</td>
                    <td style={{ textAlign: 'right' }}>
                      {d.editableUntil
                        ? <button className="btn btn-ghost btn-sm" onClick={() => showToast('Editable for 24 hours after logging')}>Edit</button>
                        : <span title="Locked — ask support to correct a locked entry" style={{ color: 'var(--grey)' }}><Lock size={13} /></span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid g2">
        <Card title="Gains so far this year">
          <div className="kpi">
            <div className="value" style={{ fontSize: 30 }}>{fmt(gains)}</div>
            <div className="sub">Taxed at 33% (26% for EURC) — around {fmt(gains * 0.33)} owed</div>
          </div>
        </Card>
        <Card title="Losses so far this year">
          <div className="kpi">
            <div className="value" style={{ fontSize: 30 }}>{fmt(losses)}</div>
            <div className="sub">Losses reduce the tax on future gains</div>
          </div>
        </Card>
      </div>

      {logOpen && (
        <LogSaleModal
          disps={disps}
          onClose={() => setLogOpen(false)}
          onSave={d => { setDisps(x => [d, ...x]); setLogOpen(false); showToast('Sale logged — your year-end report is up to date') }}
        />
      )}
      {toast}
    </div>
  )
}

/* ---------------- log a sale ---------------- */
function LogSaleModal({ disps, onClose, onSave }: { disps: Disposition[]; onClose: () => void; onSave: (d: Disposition) => void }) {
  const hold = holdings(disps)
  const [asset, setAsset] = useState(hold[0]?.asset ?? 'BTC')
  const [amount, setAmount] = useState('')
  const [eur, setEur] = useState('')
  const [date, setDate] = useState('2026-07-13')
  const [where, setWhere] = useState('')
  const [ref, setRef] = useState('')
  const [advanced, setAdvanced] = useState(false)
  const rem = remainingByLot(disps)

  const amt = parseFloat(amount.replace(',', '.')) || 0
  const got = parseFloat(eur.replace(',', '.')) || 0
  const available = hold.find(h => h.asset === asset)?.amount ?? 0
  const tooMuch = amt > available
  const preview = amt > 0 && !tooMuch ? fifoPreview(asset, amt, disps) : null
  const gain = preview ? got - preview.costBasis : 0
  const rate = taxRate(asset)
  const ready = amt > 0 && got > 0 && !tooMuch && !!where

  return (
    <Modal onClose={onClose}>
      <div className="card-title">Did you sell or spend crypto?</div>
      <p style={{ fontSize: 13.5, color: 'var(--grey-dark)', marginBottom: 18 }}>
        Tell us what left your wallet and what you got for it. We'll work out the gain or loss and what you'd owe.
      </p>

      <div className="stack" style={{ gap: 14 }}>
        <div className="grid g2">
          <div className="field">
            <label>What did you sell or spend?</label>
            <select value={asset} onChange={e => { setAsset(e.target.value); setAmount('') }}>
              {hold.map(h => <option key={h.asset} value={h.asset}>{h.asset} — you hold {fmtQty(h.amount, h.asset)}</option>)}
            </select>
          </div>
          <div className={'field' + (tooMuch ? ' invalid' : '')}>
            <label>How much?</label>
            <input value={amount} onChange={e => setAmount(e.target.value)} placeholder={fmtQty(available, asset)} />
            {tooMuch
              ? <span className="error">You only hold {fmtQty(available, asset)} {asset}</span>
              : <span className="hint">Available: {fmtQty(available, asset)} {asset}</span>}
          </div>
        </div>
        <div className="grid g2">
          <div className="field">
            <label>How much did you get, in EUR?</label>
            <input value={eur} onChange={e => setEur(e.target.value)} placeholder="0.00" />
            <span className="hint">After any exchange fees</span>
          </div>
          <div className="field"><label>When?</label><input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
        </div>
        <div className="grid g2">
          <div className="field"><label>Where?</label><input value={where} onChange={e => setWhere(e.target.value)} placeholder="e.g. Sold on Kraken EU" /></div>
          <div className="field"><label>Reference (optional)</label><input value={ref} onChange={e => setRef(e.target.value)} placeholder="Transaction or order ID" /></div>
        </div>
      </div>

      {preview && got > 0 && (
        <div style={{ marginTop: 18, background: 'var(--surface-alt)', borderRadius: 14, padding: 18 }}>
          <div className="doc-n" style={{ marginBottom: 10 }}>WHAT THIS MEANS FOR YOUR TAX</div>
          <div className="stack" style={{ gap: 7, fontSize: 14 }}>
            <div className="row"><span>You're selling</span><span className="spacer" /><b className="mono">{fmtQty(amt, asset)} {asset}</b></div>
            <div className="row"><span>It was worth this when you received it</span><span className="spacer" /><b className="num">{fmt(preview.costBasis)}</b></div>
            <div className="row"><span>You got</span><span className="spacer" /><b className="num">{fmt(got)}</b></div>
            <div className="divider" style={{ margin: '4px 0' }} />
            <div className="row" style={{ fontWeight: 600, color: gain >= 0 ? 'var(--ok)' : 'var(--err)' }}>
              <span>{gain >= 0 ? 'Gain' : 'Loss'}</span><span className="spacer" />
              <span className="num">{gain >= 0 ? '+' : '−'}{fmt(Math.abs(gain))}</span>
            </div>
            <div className="row">
              <span>Estimated tax ({Math.round(rate * 100)}%)</span><span className="spacer" />
              <b className="num">{gain > 0 ? fmt(gain * rate) : '€ 0,00'}</b>
            </div>
            {gain < 0 && <div style={{ fontSize: 12.5, color: 'var(--grey-dark)' }}>No tax on a loss — and it reduces the tax on future gains.</div>}
          </div>

          <div className="divider" />
          <div style={{ fontSize: 12.5, color: 'var(--grey-dark)' }}>
            <b>Where this comes from:</b> your oldest crypto is counted first (FIFO).
            {preview.consumed.map(c => (
              <div key={c.lot} className="row" style={{ marginTop: 4 }}>
                <span className="mono" style={{ fontSize: 11.5 }}>{fmtQty(c.amount, asset)} {asset} from invoice {c.invoice}</span>
                <span className="spacer" />
                <span className="mono" style={{ fontSize: 11.5 }}>{fmt(c.basis)}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 8, paddingLeft: 0 }} onClick={() => setAdvanced(v => !v)}>
            {advanced ? '− Hide' : '+ Choose which payments to count instead'}
          </button>
          {advanced && (
            <div style={{ fontSize: 12.5, color: 'var(--grey-dark)', background: '#fff', borderRadius: 10, padding: 12, marginTop: 6 }}>
              Italian law also lets you pick exactly which crypto you're selling, which is sometimes better for tax. Worth doing with your commercialista.
              <div className="stack" style={{ gap: 6, marginTop: 8 }}>
                {lots.filter(l => l.asset === asset && rem[l.id] > 0).map(l => (
                  <label key={l.id} className="row" style={{ fontSize: 13, cursor: 'pointer' }}>
                    <input type="radio" name="lotpick" defaultChecked={l.id === preview.consumed[0]?.lot} />
                    <span>Invoice {l.invoice} — {fmtQty(rem[l.id], asset)} {asset} at {l.rate}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="row" style={{ marginTop: 18 }}>
        <span style={{ fontSize: 12, color: 'var(--grey)' }}>You can edit this for 24 hours after saving.</span>
        <span className="spacer" />
        <button className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary btn-sm" disabled={!ready} onClick={() => onSave({
          id: 'd' + Date.now(), date, asset, amount: amt, eurReceived: got, where, ref,
          costBasis: preview!.costBasis, gain, rate,
          consumed: preview!.consumed.map(c => ({ lot: c.lot, invoice: c.invoice, amount: c.amount, basis: c.basis })),
          editableUntil: 'in 24h',
        })}>Save</button>
      </div>
    </Modal>
  )
}
