import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Kpi, Chip, Tabs, useToast } from '../components/ui'
import { profile, ytd, fmt, invoices, lots, snapshots, commercialista, clientById, sdiChip } from '../data/fake'
import { CheckCircle2, AlertCircle, FileArchive } from 'lucide-react'

export default function CommercialistaView() {
  const [tab, setTab] = useState('Panoramica')
  const [toast, showToast] = useToast()
  const sent = invoices.filter(i => i.lifecycle !== 'draft')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white-1)' }}>
      <header style={{ background: 'var(--dark)', color: '#fff', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 600, color: 'var(--orange)' }}>B</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Accesso commercialista — sola lettura</div>
          <div style={{ fontSize: 12, color: '#a7a29b' }}>{commercialista.name} · valido fino al {commercialista.grantExpiry}</div>
        </div>
        <span style={{ flex: 1 }} />
        <Link to="/dashboard" style={{ fontSize: 12.5, color: '#a7a29b' }}>← esci dalla vista (demo)</Link>
      </header>

      <div className="content">
        <div style={{ marginBottom: 20 }}>
          <div className="eyebrow plain">CLIENTE</div>
          <div className="page-title" style={{ fontSize: 26 }}>{profile.name}</div>
          <div style={{ fontSize: 13.5, color: 'var(--grey-dark)' }}>P.IVA {profile.piva} · Regime forfettario · ATECO {profile.ateco.code} (coeff. {profile.ateco.coeff * 100}%) · imposta sostitutiva 5%</div>
        </div>

        <Tabs tabs={['Panoramica', 'Fatture', 'Registro crypto', 'Report']} active={tab} onChange={setTab} />

        {tab === 'Panoramica' && (
          <div className="stack">
            <div className="grid g4">
              <Card><Kpi label="Ricavi YTD" value={fmt(ytd.ricavi)} /></Card>
              <Card><Kpi label="Imponibile" value={fmt(ytd.imponibile)} /></Card>
              <Card><Kpi label="Imposta sostitutiva stimata" value={fmt(ytd.imposta)} /></Card>
              <Card><Kpi label="Contributi stimati" value={fmt(ytd.inps)} sub={profile.cassa} /></Card>
            </div>
            <Card title="Verifiche pre-dichiarazione">
              <div className="stack" style={{ gap: 10 }}>
                {commercialista.checklist.map((c, i) => (
                  <div key={i} className="row" style={{ fontSize: 14 }}>
                    {c.ok ? <CheckCircle2 size={17} color="var(--ok)" /> : <AlertCircle size={17} color="var(--err)" />}
                    <span>{c.label}</span>
                    {c.detail && <span className="mono" style={{ color: 'var(--grey)' }}>{c.detail}</span>}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {tab === 'Fatture' && (
          <Card>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead><tr><th>Numero</th><th>Cliente</th><th>Importo</th><th>SDI</th><th>Data</th><th></th></tr></thead>
                <tbody>
                  {sent.map(i => (
                    <tr key={i.id}>
                      <td className="mono">{i.n}</td><td>{clientById(i.clientId).name}</td>
                      <td className="num" style={{ fontWeight: 600 }}>{fmt(i.amountEur)}</td>
                      <td><Chip {...sdiChip[i.sdi]} /></td><td className="mono">{i.date}</td>
                      <td><div className="row" style={{ gap: 6, justifyContent: 'flex-end' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => showToast('PDF scaricato')}>PDF</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => showToast('XML scaricato')}>XML</button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === 'Registro crypto' && (
          <Card title="Lotti di carico">
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead><tr><th>Asset</th><th>Quantità</th><th>EUR alla ricezione</th><th>Cambio</th><th>Fonte</th><th>Fattura</th></tr></thead>
                <tbody>
                  {lots.map(l => (
                    <tr key={l.id}>
                      <td style={{ fontWeight: 600 }}>{l.asset}</td><td className="mono">{l.qty}</td>
                      <td className="num" style={{ fontWeight: 600 }}>{fmt(l.eur)}</td><td className="mono">{l.rate}</td>
                      <td style={{ fontSize: 13 }}>{l.src}</td><td className="mono">{l.invoice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--grey)' }}>Metodo di scarico provvisorio: FIFO (in attesa di conferma).</div>
          </Card>
        )}

        {tab === 'Report' && (
          <Card>
            <table className="table">
              <thead><tr><th>Versione</th><th>Generata</th><th>Note</th><th></th></tr></thead>
              <tbody>
                {snapshots.map(s => (
                  <tr key={s.id} style={s.sent ? { background: 'var(--warn-bg)' } : undefined}>
                    <td className="mono">v{s.v}{s.sent ? ' · inviata a te' : ''}</td>
                    <td className="mono">{s.date}</td><td style={{ fontSize: 13.5 }}>{s.note}</td>
                    <td style={{ textAlign: 'right' }}><button className="btn btn-ghost btn-sm" onClick={() => showToast('Pacchetto ZIP scaricato')}><FileArchive size={14} /> Scarica ZIP</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
      {toast}
    </div>
  )
}
