import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Card, Chip, useToast } from '../components/ui'
import { clients, clientTypeLabel, invoices, fmt, lifecycleChip, type ClientType } from '../data/fake'
import { Users, Upload, Sparkles } from 'lucide-react'

export function ClientList() {
  const nav = useNavigate()
  return (
    <div className="stack">
      <div className="row">
        <span className="spacer" />
        <Link to="/clienti/importa" className="btn btn-secondary btn-sm"><Upload size={15} /> Import from Fatture in Cloud</Link>
        <Link to="/clienti/nuovo" className="btn btn-primary btn-sm">Add client</Link>
      </div>
      <Card>
        {clients.length === 0 ? (
          <div className="empty">
            <div className="icon"><Users size={40} strokeWidth={1.2} /></div>
            <h3>No clients yet</h3>
            <p>Add your first client manually, or import your registry from Fatture in Cloud in a minute.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead><tr><th>Client</th><th>Type</th><th>Tax ID</th><th>Email</th><th>Invoiced</th></tr></thead>
              <tbody>
                {clients.map(c => (
                  <tr key={c.id} className="rowlink" onClick={() => nav('/clienti/' + c.id)}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td><Chip label={clientTypeLabel[c.type]} cls="chip-info" /></td>
                    <td className="mono">{c.vat}</td>
                    <td style={{ color: 'var(--grey-dark)' }}>{c.email}</td>
                    <td className="num" style={{ fontWeight: 600 }}>{fmt(c.invoiced)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

export function ClientEdit() {
  const [type, setType] = useState<ClientType>('it_business')
  const [piva, setPiva] = useState('')
  const [autofilled, setAutofilled] = useState(false)
  const [toast, showToast] = useToast()
  const nav = useNavigate()

  const lookup = () => {
    if (piva.replace(/\D/g, '').length >= 11) {
      setAutofilled(true)
      showToast('Details filled from the Business Registry (Acube Verify ID)')
    }
  }

  return (
    <div style={{ maxWidth: 620, margin: '0 auto' }} className="stack">
      <Card title="New client">
        <div className="field" style={{ marginBottom: 16 }}>
          <label>Client type</label>
          <select value={type} onChange={e => { setType(e.target.value as ClientType); setAutofilled(false) }}>
            <option value="it_business">Italian business / professional</option>
            <option value="it_consumer">Italian individual</option>
            <option value="eu_business">EU business</option>
            <option value="non_eu_business">Non-EU business</option>
          </select>
        </div>

        {type === 'it_business' && (
          <div className="stack" style={{ gap: 14 }}>
            <div className="field">
              <label>Partita IVA</label>
              <div className="row">
                <input value={piva} onChange={e => setPiva(e.target.value)} placeholder="e.g. 04512870159" style={{ flex: 1, border: '1px solid var(--input-border)', borderRadius: 8, padding: '9px 12px' }} />
                <button className="btn btn-secondary btn-sm" onClick={lookup}><Sparkles size={14} /> Autofill from P.IVA</button>
              </div>
              <span className="hint">Company name, address and tax status fill in automatically.</span>
            </div>
            {autofilled && (
              <>
                <div className="field"><label>Company name</label><input defaultValue="Borgo Digitale S.r.l." /></div>
                <div className="field"><label>Address</label><input defaultValue="Via Torino 88, 20123 Milano (MI)" /></div>
                <div className="grid g2">
                  <div className="field"><label>Codice destinatario</label><input defaultValue="M5UXCR1" /><span className="hint">Or leave blank: we'll use their PEC or "0000000"</span></div>
                  <div className="field"><label>PEC</label><input defaultValue="borgodigitale@legalmail.it" /></div>
                </div>
              </>
            )}
          </div>
        )}
        {type === 'it_consumer' && (
          <div className="stack" style={{ gap: 14 }}>
            <div className="field"><label>Codice fiscale</label><input placeholder="e.g. BLLMRC88E14H199K" /><span className="hint">Individuals don't have a partita IVA — the codice fiscale is enough.</span></div>
            <div className="field"><label>Full name</label><input placeholder="e.g. Marco Bellini" /></div>
            <div className="field"><label>Address</label><input placeholder="Street, postcode, city" /></div>
          </div>
        )}
        {type === 'eu_business' && (
          <div className="stack" style={{ gap: 14 }}>
            <div className="field">
              <label>VAT number</label>
              <div className="row">
                <input placeholder="e.g. DE 314 259 076" style={{ flex: 1, border: '1px solid var(--input-border)', borderRadius: 8, padding: '9px 12px' }} />
                <button className="btn btn-secondary btn-sm" onClick={() => showToast('VAT number valid — verified on VIES ✓')}>Verify on VIES</button>
              </div>
            </div>
            <div className="field"><label>Company name</label><input placeholder="e.g. Chainwerk GmbH" /></div>
            <div className="field"><label>Country</label><input placeholder="e.g. Germany" /></div>
          </div>
        )}
        {type === 'non_eu_business' && (
          <div className="stack" style={{ gap: 14 }}>
            <div className="field"><label>Company name</label><input placeholder="e.g. Nakamoto Labs Inc." /></div>
            <div className="grid g2">
              <div className="field"><label>Country</label><input placeholder="e.g. USA" /></div>
              <div className="field"><label>Tax ID (optional)</label><input placeholder="e.g. EIN 84-2931077" /></div>
            </div>
          </div>
        )}
        <div className="field" style={{ marginTop: 14 }}><label>Email for invoices</label><input placeholder="billing@client.com" /></div>
        <div className="row" style={{ marginTop: 20 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => nav('/clienti')}>Cancel</button>
          <span className="spacer" />
          <button className="btn btn-primary" onClick={() => { showToast('Client saved'); setTimeout(() => nav('/clienti'), 900) }}>Save client</button>
        </div>
      </Card>
      {toast}
    </div>
  )
}

export function ClientImport() {
  const [step, setStep] = useState(0)
  const nav = useNavigate()
  const rows = [
    { name: 'Alba Design Studio', piva: '03318740283', status: 'new' },
    { name: 'Borgo Digitale S.r.l.', piva: '04512870159', status: 'duplicate' },
    { name: 'Fintechly S.p.A.', piva: '09982210963', status: 'new' },
    { name: 'Green Hosting S.r.l.s.', piva: '02871040397', status: 'new' },
  ]
  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }} className="stack">
      <Card title="Import clients from Fatture in Cloud">
        {step === 0 && (
          <>
            <p style={{ fontSize: 14, color: 'var(--grey-dark)', marginBottom: 16 }}>
              Export your client registry from Fatture in Cloud (<span className="mono">Anagrafica → Clienti → Esporta CSV</span>) and upload it here. We read the FIC format as-is.
            </p>
            <div className="empty" style={{ border: '2px dashed var(--input-border)', borderRadius: 14, padding: 36 }}>
              <div className="icon"><Upload size={34} strokeWidth={1.4} /></div>
              <p style={{ marginBottom: 12 }}>Drop the CSV file here, or</p>
              <button className="btn btn-primary btn-sm" onClick={() => setStep(1)}>Choose file… (demo: clienti-fic.csv)</button>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <p style={{ fontSize: 14, marginBottom: 12 }}><b>clienti-fic.csv</b> — 4 rows read. One duplicate found (same P.IVA):</p>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead><tr><th>Company</th><th>P.IVA</th><th>Result</th><th></th></tr></thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.piva}>
                      <td>{r.name}</td><td className="mono">{r.piva}</td>
                      <td><Chip label={r.status === 'new' ? 'New' : 'Duplicate'} cls={r.status === 'new' ? 'chip-ok' : 'chip-warn'} /></td>
                      <td style={{ fontSize: 13 }}>{r.status === 'duplicate' && <select style={{ border: '1px solid var(--input-border)', borderRadius: 6, padding: '4px 8px', fontSize: 13 }}><option>Skip</option><option>Merge</option></select>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="row" style={{ marginTop: 18 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setStep(0)}>Back</button>
              <span className="spacer" />
              <button className="btn btn-primary" onClick={() => setStep(2)}>Import 3 clients</button>
            </div>
          </>
        )}
        {step === 2 && (
          <div className="empty">
            <div style={{ fontSize: 40 }}>✓</div>
            <h3>Import complete</h3>
            <p>3 clients imported, 1 duplicate skipped. You'll find them in your registry.</p>
            <button className="btn btn-primary" onClick={() => nav('/clienti')}>Go to clients</button>
          </div>
        )}
      </Card>
    </div>
  )
}

export function ClientDetail() {
  const { id } = useParams()
  const c = clients.find(x => x.id === id) ?? clients[0]
  const invs = invoices.filter(i => i.clientId === c.id && i.lifecycle !== 'draft')
  const nav = useNavigate()
  return (
    <div className="stack">
      <div className="row">
        <div>
          <div className="eyebrow plain">{clientTypeLabel[c.type]}</div>
          <div className="page-title" style={{ fontSize: 28 }}>{c.name}</div>
        </div>
        <span className="spacer" />
        <button className="btn btn-secondary btn-sm">Edit</button>
        <button className="btn btn-ghost btn-sm" title="Clients with issued invoices can't be deleted — archive instead">Archive</button>
      </div>
      <div className="grid g3">
        <Card><div className="kpi"><div className="label">Tax ID</div><div className="mono" style={{ fontSize: 14 }}>{c.vat}</div></div></Card>
        <Card><div className="kpi"><div className="label">Email</div><div style={{ fontSize: 14 }}>{c.email}</div></div></Card>
        <Card><div className="kpi"><div className="label">Total invoiced</div><div className="value" style={{ fontSize: 26 }}>{fmt(c.invoiced)}</div></div></Card>
      </div>
      <Card title="Invoices">
        {invs.length === 0 ? <div style={{ fontSize: 14, color: 'var(--grey-dark)' }}>No invoices for this client.</div> : (
          <table className="table">
            <thead><tr><th>Number</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {invs.map(i => (
                <tr key={i.id} className="rowlink" onClick={() => nav('/fatture/' + i.id)}>
                  <td className="mono">{i.n}</td><td className="num" style={{ fontWeight: 600 }}>{fmt(i.amountEur)}</td>
                  <td><Chip {...lifecycleChip[i.lifecycle]} /></td><td className="mono">{i.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
