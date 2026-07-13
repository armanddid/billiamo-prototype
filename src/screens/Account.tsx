import { useState } from 'react'
import { Card, Tabs, Chip, Modal, FakeQr, useToast } from '../components/ui'
import { profile } from '../data/fake'

export default function Account() {
  const [tab, setTab] = useState('Fiscal profile')
  const [regime, setRegime] = useState(profile.regime)
  const [twoFA, setTwoFA] = useState(profile.twoFactor)
  const [setupOpen, setSetupOpen] = useState(false)
  const [code, setCode] = useState('')
  const [toast, showToast] = useToast()

  return (
    <div className="stack">
      <Tabs tabs={['Fiscal profile', 'Business details', 'Subscription', 'Login & data']} active={tab} onChange={setTab} />

      {tab === 'Fiscal profile' && (
        <Card title="Fiscal profile" style={{ maxWidth: 680 }}>
          <div className="stack" style={{ gap: 14 }}>
            <div className="grid g2">
              <div className="field"><label>Partita IVA</label><input defaultValue={profile.piva} /></div>
              <div className="field"><label>Codice fiscale</label><input defaultValue={profile.cf} /></div>
            </div>
            <div className="field"><label>Business address</label><input defaultValue={profile.address} /></div>
            <div className="grid g2">
              <div className="field">
                <label>Tax regime</label>
                <select value={regime} onChange={e => setRegime(e.target.value as typeof regime)}>
                  <option value="forfettario">Forfettario</option>
                  <option value="ordinario">Ordinario</option>
                </select>
                {regime !== profile.regime && <span className="error" style={{ fontSize: 12, color: 'var(--warn)' }}>Changing regime mid-year: talk to your commercialista first.</span>}
              </div>
              {regime === 'forfettario' ? (
                <div className="field">
                  <label>Imposta sostitutiva</label>
                  <select defaultValue="5"><option value="5">5% — first 5 years of activity</option><option value="15">15% — standard</option></select>
                </div>
              ) : (
                <div className="field" style={{ justifyContent: 'flex-end' }}>
                  <label className="row" style={{ cursor: 'pointer', fontWeight: 400, fontSize: 14 }}>
                    <input type="checkbox" /> Impatriati regime (D.Lgs. 209/2023)
                  </label>
                  <span className="hint">IRPEF benefit applied at year-end — doesn't change your invoices.</span>
                </div>
              )}
            </div>
            <div className="field">
              <label>ATECO 2025 code</label>
              <input defaultValue={`${profile.ateco.code} — ${profile.ateco.label}`} />
              <span className="hint">Profitability coefficient: {profile.ateco.coeff * 100}% — determines your taxable base.</span>
            </div>
            <div className="field">
              <label>Pension fund (cassa)</label>
              <select defaultValue={profile.cassa}>
                <option>INPS Gestione Separata</option><option>Inarcassa</option><option>ENPAP</option><option>Cassa Forense</option>
              </select>
            </div>
            <div className="row"><span className="spacer" /><button className="btn btn-primary" onClick={() => showToast('Profile saved')}>Save</button></div>
          </div>
        </Card>
      )}

      {tab === 'Business details' && (
        <Card title="Shown on invoices and the payment page" style={{ maxWidth: 680 }}>
          <div className="stack" style={{ gap: 14 }}>
            <div className="field"><label>Display name</label><input defaultValue={profile.name} /></div>
            <div className="field"><label>Logo</label>
              <div className="row">
                <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--grey)', fontFamily: 'var(--serif)', fontSize: 22 }}>{profile.initials}</div>
                <button className="btn btn-secondary btn-sm">Upload logo</button>
              </div>
              <span className="hint">Appears on the PDF and the payment page — builds client trust.</span>
            </div>
            <div className="row"><span className="spacer" /><button className="btn btn-primary" onClick={() => showToast('Saved')}>Save</button></div>
          </div>
        </Card>
      )}

      {tab === 'Subscription' && (
        <div className="grid g2" style={{ maxWidth: 760 }}>
          <Card>
            <div className="eyebrow plain" style={{ color: 'var(--grey)' }}>CURRENT PLAN</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 600, margin: '6px 0' }}>Pro — €19/month</div>
            <ul style={{ fontSize: 14, color: 'var(--grey-dark)', paddingLeft: 18, marginBottom: 16 }}>
              <li>Unlimited invoices</li><li>Full tax pack</li><li>Accountant access</li>
            </ul>
            <div className="row">
              <button className="btn btn-secondary btn-sm" onClick={() => showToast('Switched to annual billing — 2 months free')}>Go annual (–2 months)</button>
              <button className="btn btn-ghost btn-sm" onClick={() => showToast('Downgrading limits you to 3 invoices/month; existing accountant access stays active')}>Switch to Free</button>
            </div>
          </Card>
          <Card title="Billing">
            <div style={{ fontSize: 14, color: 'var(--grey-dark)' }}>
              Card •••• 4242 via Stripe<br />Next charge: 1 August 2026
            </div>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 14 }}>Manage on Stripe</button>
          </Card>
        </div>
      )}

      {tab === 'Login & data' && (
        <div className="stack" style={{ maxWidth: 620 }}>
          <Card title="Login">
            <div className="row">
              <div className="rail-avatar" style={{ width: 44, height: 44 }}>{profile.initials}</div>
              <div>
                <div style={{ fontWeight: 600 }}>{profile.name}</div>
                <div style={{ fontSize: 13, color: 'var(--grey-dark)' }}>{profile.email} · signed in with Google</div>
              </div>
            </div>
          </Card>

          <Card title="Two-factor authentication">
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, color: 'var(--grey-dark)' }}>
                  Add a second step at login with an authenticator app (TOTP). Recommended — your account holds tax-sensitive data and payout addresses.
                </div>
              </div>
              <span className="spacer" />
              {twoFA ? (
                <Chip label="Enabled" cls="chip-ok" dot />
              ) : (
                <button className="btn btn-primary btn-sm" onClick={() => setSetupOpen(true)}>Set up 2FA</button>
              )}
            </div>
            {twoFA && (
              <div className="row" style={{ marginTop: 12, gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => showToast('New recovery codes generated')}>Recovery codes</button>
                <button className="btn btn-ghost btn-sm" onClick={() => { setTwoFA(false); showToast('2FA turned off') }}>Turn off</button>
              </div>
            )}
          </Card>

          <Card title="Your data">
            <div className="stack" style={{ gap: 10 }}>
              <button className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => showToast('Export started — you\'ll receive an email with the full package')}>Export all my data (GDPR)</button>
              <button className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start', color: 'var(--err)' }} onClick={() => showToast('Invoices are fiscal records: you\'ll receive a full export before deletion')}>Delete account…</button>
            </div>
          </Card>
        </div>
      )}

      {setupOpen && (
        <Modal onClose={() => setSetupOpen(false)}>
          <div className="card-title">Set up two-factor authentication</div>
          <p style={{ fontSize: 13.5, color: 'var(--grey-dark)', marginBottom: 16 }}>
            Scan this QR code with an authenticator app (Google Authenticator, Authy, 1Password), then enter the 6-digit code to confirm.
          </p>
          <div className="row" style={{ gap: 20, alignItems: 'flex-start' }}>
            <FakeQr seed={19} size={132} />
            <div style={{ flex: 1 }}>
              <div className="field" style={{ marginBottom: 12 }}>
                <label>Or enter this key manually</label>
                <div className="mono" style={{ fontSize: 12, background: 'var(--surface-alt)', padding: '8px 10px', borderRadius: 6, wordBreak: 'break-all' }}>JBSW Y3DP EHPK 3PXP</div>
              </div>
              <div className="field">
                <label>6-digit code</label>
                <input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" className="mono" style={{ letterSpacing: 4, fontSize: 16 }} />
              </div>
            </div>
          </div>
          <div className="row" style={{ marginTop: 18 }}>
            <span className="spacer" />
            <button className="btn btn-secondary btn-sm" onClick={() => setSetupOpen(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" disabled={code.length !== 6} onClick={() => { setTwoFA(true); setSetupOpen(false); setCode(''); showToast('Two-factor authentication enabled ✓') }}>Enable</button>
          </div>
        </Modal>
      )}
      {toast}
    </div>
  )
}
