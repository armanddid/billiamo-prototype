import { useState } from 'react'
import { Card, Tabs, Chip, Modal, useToast } from '../components/ui'
import { profile } from '../data/fake'
import { Wallet, Landmark, Plus } from 'lucide-react'

interface Acct { id: string; label: string; kind: 'crypto' | 'bank'; detail: string; addr: string }

const initialAccounts: Acct[] = [
  ...profile.settlement.map(w => ({ id: w.id, label: w.label, kind: 'crypto' as const, detail: w.chain, addr: w.addr })),
  { id: 'b1', label: 'Banca Intesa — business', kind: 'bank', detail: 'SEPA', addr: profile.iban },
]

export default function Impostazioni() {
  const [tab, setTab] = useState('Accounts')
  const [accounts, setAccounts] = useState<Acct[]>(initialAccounts)
  const [addOpen, setAddOpen] = useState(false)
  const [addKind, setAddKind] = useState<'crypto' | 'bank' | null>(null)
  const [toast, showToast] = useToast()

  const closeAdd = () => { setAddOpen(false); setAddKind(null) }
  const saveAdd = (label: string, detail: string, addr: string) => {
    setAccounts(a => [...a, { id: 'n' + a.length, label, kind: addKind!, detail, addr }])
    closeAdd()
    showToast('Account added')
  }

  return (
    <div className="stack">
      <Tabs tabs={['Accounts', 'Invoicing', 'Notifications']} active={tab} onChange={setTab} />

      {tab === 'Accounts' && (
        <div className="stack">
          <div className="row">
            <div>
              <div className="section-title">My accounts</div>
              <div style={{ fontSize: 13.5, color: 'var(--grey-dark)' }}>Where you get paid. Payments always go directly to you — Billiamo never touches the funds.</div>
            </div>
            <span className="spacer" />
            <button className="btn btn-primary btn-sm" onClick={() => setAddOpen(true)}><Plus size={15} /> Add account</button>
          </div>
          <Card>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead><tr><th>Name</th><th>Type</th><th>Network</th><th>Address / IBAN</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {accounts.map(a => (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 600 }}>
                        <span className="row" style={{ gap: 8 }}>
                          {a.kind === 'crypto' ? <Wallet size={15} color="var(--grey-dark)" /> : <Landmark size={15} color="var(--grey-dark)" />}
                          {a.label}
                        </span>
                      </td>
                      <td><Chip label={a.kind === 'crypto' ? 'Crypto wallet' : 'Bank account'} cls="chip-info" /></td>
                      <td style={{ fontSize: 13 }}>{a.detail}</td>
                      <td className="mono">{a.addr.length > 28 ? a.addr.slice(0, 16) + '…' + a.addr.slice(-6) : a.addr}</td>
                      <td><Chip label="Active" cls="chip-ok" dot /></td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => showToast('Accounts used by open invoices can\'t be removed — deactivate instead')}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {tab === 'Invoicing' && (
        <div className="stack" style={{ maxWidth: 680 }}>
          <Card title="E-invoicing (SDI)">
            <div className="row" style={{ marginBottom: 16 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>SDI connection via Acubeapi</div>
                <div style={{ fontSize: 13, color: 'var(--grey-dark)' }}>Last successful submission: today 10:14</div>
              </div>
              <span className="spacer" /><Chip label="Connected" cls="chip-ok" dot />
            </div>
            <div className="field" style={{ maxWidth: 300 }}>
              <label>Numbering prefix</label><input defaultValue="2026/" />
              <span className="hint">The sequential number never resets mid-year.</span>
            </div>
          </Card>
          <Card title="Payment methods on your invoices">
            <p style={{ fontSize: 13.5, color: 'var(--grey-dark)', marginBottom: 12 }}>
              Which of your accounts clients can pay to, by default. You can still toggle them per invoice.
            </p>
            <div className="stack" style={{ gap: 8 }}>
              {([['BTC', 'Bitcoin on-chain — Ledger'], ['USDC', 'USDC on Base / Ethereum — Metamask'], ['EURC', 'EURC — reduced 26% tax rate from 2026 (no EVM account enabled)'], ['IBAN', 'Bank transfer — Banca Intesa']] as const).map(([k, label]) => (
                <label key={k} className="row" style={{ fontSize: 14, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked={profile.rails[k]} /> {label}
                </label>
              ))}
            </div>
            <div className="field" style={{ marginTop: 14, maxWidth: 320 }}>
              <label>Pre-selected method on the payment page</label>
              <select defaultValue={profile.defaultMethod}><option>USDC</option><option>BTC</option><option>IBAN</option></select>
            </div>
          </Card>
          <Card title="Defaults">
            <div className="field" style={{ maxWidth: 260 }}>
              <label>Default due date</label>
              <select defaultValue="30"><option value="30">30 days</option><option value="14">14 days</option><option value="60">60 days</option></select>
            </div>
            <div className="row" style={{ marginTop: 14 }}><span className="spacer" /><button className="btn btn-primary" onClick={() => showToast('Saved')}>Save</button></div>
          </Card>
        </div>
      )}

      {tab === 'Notifications' && (
        <Card title="Notifications" style={{ maxWidth: 620 }}>
          <div className="stack" style={{ gap: 10 }}>
            {[
              ['Payment confirmed', true], ['SDI status (delivery / rejection)', true],
              ['€85,000 cap alerts', true], ['Invoice overdue', true], ['Product news', false],
            ].map(([label, on], i) => (
              <label key={i} className="row" style={{ fontSize: 14, cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked={on as boolean} /> {label as string}
              </label>
            ))}
            <div className="field" style={{ maxWidth: 280, marginTop: 6 }}>
              <label>Overdue reminder after</label>
              <select defaultValue="3"><option value="1">1 day</option><option value="3">3 days</option><option value="7">7 days</option></select>
            </div>
          </div>
        </Card>
      )}

      {addOpen && (
        <Modal onClose={closeAdd}>
          {!addKind ? (
            <>
              <div className="card-title">Add an account</div>
              <p style={{ fontSize: 13.5, color: 'var(--grey-dark)', marginBottom: 16 }}>Where should clients be able to pay you?</p>
              <div className="grid g2">
                <button className="ob-card" onClick={() => setAddKind('crypto')}>
                  <div className="ob-icon"><Wallet size={18} /></div>
                  <div className="ob-card-title">Crypto wallet</div>
                  <div className="ob-card-text">Bitcoin, or an EVM address for USDC / EURC. Your keys, your coins.</div>
                </button>
                <button className="ob-card" onClick={() => setAddKind('bank')}>
                  <div className="ob-icon"><Landmark size={18} /></div>
                  <div className="ob-card-title">Bank account</div>
                  <div className="ob-card-text">An IBAN shown on invoices for clients who pay by SEPA transfer.</div>
                </button>
              </div>
            </>
          ) : addKind === 'crypto' ? (
            <AddCryptoForm onCancel={closeAdd} onSave={saveAdd} />
          ) : (
            <AddBankForm onCancel={closeAdd} onSave={saveAdd} />
          )}
        </Modal>
      )}
      {toast}
    </div>
  )
}

function AddCryptoForm({ onCancel, onSave }: { onCancel: () => void; onSave: (l: string, d: string, a: string) => void }) {
  const [label, setLabel] = useState('')
  const [network, setNetwork] = useState('Bitcoin')
  const [addr, setAddr] = useState('')
  return (
    <>
      <div className="card-title">Add a crypto wallet</div>
      <div className="stack" style={{ gap: 14 }}>
        <div className="field"><label>Name</label><input value={label} placeholder="e.g. Ledger — BTC" onChange={e => setLabel(e.target.value)} /></div>
        <div className="field">
          <label>Network</label>
          <select value={network} onChange={e => setNetwork(e.target.value)}>
            <option>Bitcoin</option><option>Base (EVM)</option><option>Ethereum (EVM)</option>
          </select>
          <span className="hint">One EVM address covers USDC and EURC on that chain.</span>
        </div>
        <div className="field"><label>Address</label><input value={addr} placeholder={network === 'Bitcoin' ? 'bc1q…' : '0x…'} onChange={e => setAddr(e.target.value)} /></div>
      </div>
      <div className="row" style={{ marginTop: 18 }}>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
        <span className="spacer" />
        <button className="btn btn-primary btn-sm" disabled={!label || !addr} onClick={() => onSave(label, network, addr)}>Add wallet</button>
      </div>
    </>
  )
}

function AddBankForm({ onCancel, onSave }: { onCancel: () => void; onSave: (l: string, d: string, a: string) => void }) {
  const [label, setLabel] = useState('')
  const [iban, setIban] = useState('')
  return (
    <>
      <div className="card-title">Add a bank account</div>
      <div className="stack" style={{ gap: 14 }}>
        <div className="field"><label>Name</label><input value={label} placeholder="e.g. Banca Intesa — business" onChange={e => setLabel(e.target.value)} /></div>
        <div className="field"><label>IBAN</label><input value={iban} placeholder="IT60 X054 2811 1010 0000 0123 456" onChange={e => setIban(e.target.value)} /><span className="hint">Shown on invoices as display-only — you confirm SEPA payments manually.</span></div>
      </div>
      <div className="row" style={{ marginTop: 18 }}>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
        <span className="spacer" />
        <button className="btn btn-primary btn-sm" disabled={!label || !iban} onClick={() => onSave(label, 'SEPA', iban)}>Add account</button>
      </div>
    </>
  )
}
