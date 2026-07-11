import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Chip } from '../components/ui'
import { invoices, fmt, clientById, payChip } from '../data/fake'
import { ChevronDown, ChevronUp } from 'lucide-react'

// One merged view: every payment with its fiscal metadata inline.
// Capital-gains summaries live in Report; a dedicated tax-ledger surface
// returns when disposals ship (v1.1+).

const fiscalMeta: Record<string, { rate: string; src: string; ts: string }> = {
  p1: { rate: '88.298 €/BTC', src: 'Kraken', ts: '2026-05-20 14:32' },
  p2: { rate: '87.719 €/BTC', src: 'Kraken', ts: '2026-06-04 09:15' },
  p3: { rate: '0,9987 €/USDC', src: 'CoinGecko', ts: '2026-06-30 16:48' },
}

export default function Pagamenti() {
  const nav = useNavigate()
  const [openRow, setOpenRow] = useState<string | null>(null)
  const pays = invoices.flatMap(i => i.payments.map(p => ({ ...p, inv: i })))

  return (
    <div className="stack">
      <div>
        <div className="section-title">Payments received</div>
        <div style={{ fontSize: 13.5, color: 'var(--grey-dark)' }}>
          Every payment matched to its invoice — bank and crypto. Crypto payments carry their EUR value at the block timestamp, ready for your tax report.
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
                          <span><span className="mono" style={{ color: 'var(--grey)' }}>COST-BASIS LOT</span>&nbsp; created · held</span>
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
        <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--grey)' }}>
          Capital gains and the cost-basis method live in <a href="#/report" style={{ color: 'var(--orange-deep)' }}>Reports</a> — nothing to do here until you dispose of crypto.
        </div>
      </Card>
    </div>
  )
}
