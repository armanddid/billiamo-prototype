import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Kpi, Chip, Modal, useToast } from '../components/ui'
import { ytd, fmt, snapshots, commercialista, profile } from '../data/fake'
import { Share2, AlertTriangle, FileArchive } from 'lucide-react'

export default function Report() {
  const [genOpen, setGenOpen] = useState(false)
  const [genDone, setGenDone] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [toast, showToast] = useToast()

  return (
    <div className="stack">
      <div className="grid g4">
        <Card><Kpi label="YTD revenue" value={fmt(ytd.ricavi)} /></Card>
        <Card><Kpi label="Taxable base (67%)" value={fmt(ytd.imponibile)} sub="ATECO 62.02.00 coefficient" /></Card>
        <Card><Kpi label="Est. imposta sostitutiva" value={fmt(ytd.imposta)} sub="5% rate — first 5 years" /></Card>
        <Card><Kpi label="Est. contributions" value={fmt(ytd.inps)} sub={profile.cassa} /></Card>
      </div>

      <Card title="2026 fiscal calendar">
        <div className="grid g3">
          {[
            { when: '30 June', what: '2025 balance + first 2026 instalment (F24)', state: 'chip-ok', label: 'Done' },
            { when: '31 October', what: 'Modello Redditi PF 2026', state: 'chip-warn', label: 'Next' },
            { when: '30 November', what: 'Second 2026 instalment (F24)', state: 'chip-info', label: 'Upcoming' },
          ].map((d, i) => (
            <div key={i} className="row" style={{ alignItems: 'flex-start', gap: 10 }}>
              <div>
                <div className="mono" style={{ color: 'var(--grey)' }}>{d.when}</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{d.what}</div>
              </div>
              <span className="spacer" /><Chip label={d.label} cls={d.state} />
            </div>
          ))}
        </div>
      </Card>

      <div className="row">
        <div className="section-title">Generated reports</div>
        <span className="spacer" />
        <button className="btn btn-primary btn-sm" onClick={() => setGenOpen(true)}>Generate report</button>
      </div>

      <Card>
        <table className="table">
          <thead><tr><th>Version</th><th>Generated</th><th>Notes</th><th>Accountant</th><th></th></tr></thead>
          <tbody>
            {(genDone ? [{ id: 's3', v: 3, date: '2026-07-11 12:20', by: 'Giulia', sent: false, note: 'July update' }, ...snapshots] : snapshots).map(s => (
              <tr key={s.id}>
                <td className="mono">v{s.v}</td>
                <td className="mono">{s.date}</td>
                <td style={{ fontSize: 13.5 }}>{s.note}</td>
                <td>{s.sent ? <Chip label="Shared" cls="chip-ok" /> : <Chip label="—" cls="chip-info" />}</td>
                <td>
                  <div className="row" style={{ gap: 6, justifyContent: 'flex-end' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => showToast('Tax pack ZIP downloaded (CSV ×2, XML archive, PDF, capital gains…)')}><FileArchive size={14} /> ZIP</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setShareOpen(true)}><Share2 size={14} /> Share</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--grey)' }}>Every version is immutable — your accountant sees exactly the version you sent them.</div>
      </Card>

      <Card title="Accountant access">
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontWeight: 600 }}>{commercialista.name}</div>
            <div style={{ fontSize: 13.5, color: 'var(--grey-dark)' }}>{commercialista.studio} · {commercialista.email}</div>
            <div style={{ fontSize: 13, color: 'var(--grey-dark)', marginTop: 4 }}>Read-only access, valid until <b>{commercialista.grantExpiry}</b> — renews automatically every time they log in.</div>
          </div>
          <span className="spacer" />
          <Link to="/commercialista" className="btn btn-secondary btn-sm">View as them</Link>
          <button className="btn btn-ghost btn-sm" onClick={() => showToast('Access revoked')}>Revoke</button>
        </div>
      </Card>

      {genOpen && (
        <Modal onClose={() => setGenOpen(false)}>
          <div className="card-title">Generate report — fiscal year 2026</div>
          <div className="banner" style={{ marginBottom: 14 }}>
            <AlertTriangle size={17} color="var(--warn)" />
            <span style={{ fontSize: 13.5 }}><b>1 warning:</b> invoice 2026/0014 was rejected by SDI and is unresolved. It will be flagged in the report.</span>
          </div>
          <div style={{ fontSize: 14, color: 'var(--grey-dark)', marginBottom: 16 }}>
            The pack includes: issued invoices (CSV), crypto movements (CSV), FatturaPA XML archive, stamp-duty aggregate,
            capital gains (33% / 26% EMT pools), Quadro RW + IVAFE data, and a PDF summary with the forfettario numbers.
          </div>
          <div className="row">
            <Link to="/fatture/i14/correzione" className="btn btn-secondary btn-sm" onClick={() => setGenOpen(false)}>Fix the warning first</Link>
            <span className="spacer" />
            <button className="btn btn-primary" onClick={() => { setGenOpen(false); setGenDone(true); showToast('Report v3 generated') }}>Generate anyway</button>
          </div>
        </Modal>
      )}

      {shareOpen && (
        <Modal onClose={() => setShareOpen(false)}>
          <div className="card-title">Send to your accountant</div>
          <p style={{ fontSize: 14, color: 'var(--grey-dark)', marginBottom: 14 }}>
            {commercialista.name} is already connected — they'll receive a link to the new version. No new access to set up.
          </p>
          <div className="field"><label>Message (optional)</label><textarea rows={3} placeholder="Hi Andrea, here's the July update…" /></div>
          <div className="row" style={{ marginTop: 16 }}>
            <span className="spacer" />
            <button className="btn btn-secondary btn-sm" onClick={() => setShareOpen(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={() => { setShareOpen(false); showToast('Sent to ' + commercialista.email) }}>Send</button>
          </div>
        </Modal>
      )}
      {toast}
    </div>
  )
}
