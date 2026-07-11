import { useNavigate } from 'react-router-dom'
import { Card, Chip, Tabs } from '../components/ui'
import { invoices, lots, fmt, clientById, payChip } from '../data/fake'
import { useState } from 'react'

export default function Pagamenti() {
  const [tab, setTab] = useState('Payments')
  const nav = useNavigate()
  const pays = invoices.flatMap(i => i.payments.map(p => ({ ...p, inv: i })))

  return (
    <div className="stack">
      <Tabs tabs={['Payments', 'Crypto ledger']} active={tab} onChange={setTab} />

      {tab === 'Payments' && (
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead><tr><th>Date</th><th>Invoice</th><th>Client</th><th>Method</th><th>Crypto</th><th>EUR at receipt</th><th>Status</th></tr></thead>
              <tbody>
                {pays.map(p => (
                  <tr key={p.id} className="rowlink" onClick={() => nav('/fatture/' + p.inv.id)}>
                    <td className="mono">{p.date}</td>
                    <td className="mono">{p.inv.n}</td>
                    <td>{clientById(p.inv.clientId).name}</td>
                    <td>{p.rail}</td>
                    <td className="mono">{p.crypto ?? '—'}</td>
                    <td className="num" style={{ fontWeight: 600 }}>{fmt(p.eur)}</td>
                    <td><Chip {...payChip['confirmed']} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'Crypto ledger' && (
        <>
          <div className="banner">
            <span>ⓘ</span>
            <span><b>Provisional cost-basis method (FIFO)</b> — awaiting your commercialista's confirmation of the final method (FIFO or LIFO). The lots don't change, only the disposal order.</span>
          </div>
          <Card title="Cost-basis lots">
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead><tr><th>Asset</th><th>Quantity</th><th>EUR value at receipt</th><th>Rate</th><th>Source</th><th>Block timestamp</th><th>Invoice</th></tr></thead>
                <tbody>
                  {lots.map(l => (
                    <tr key={l.id}>
                      <td style={{ fontWeight: 600 }}>{l.asset}</td>
                      <td className="mono">{l.qty}</td>
                      <td className="num" style={{ fontWeight: 600 }}>{fmt(l.eur)}</td>
                      <td className="mono">{l.rate}</td>
                      <td style={{ fontSize: 13 }}>{l.src}</td>
                      <td className="mono">{l.ts}</td>
                      <td className="mono">{l.invoice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="grid g2">
            <Card title="YTD capital gains — 33% rate">
              <div className="kpi"><div className="value" style={{ fontSize: 30 }}>€ 0,00</div><div className="sub">No disposals recorded in 2026 (BTC, USDC)</div></div>
            </Card>
            <Card title="YTD capital gains — 26% rate (EUR EMTs)">
              <div className="kpi"><div className="value" style={{ fontSize: 30 }}>€ 0,00</div><div className="sub">EURC not enabled — reduced rate under L. 199/2025</div></div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
