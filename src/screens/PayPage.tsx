import { useState } from 'react'
import { FakeQr, Chip, useToast } from '../components/ui'
import { profile } from '../data/fake'
import { Wallet, Copy, CheckCircle2 } from 'lucide-react'

type Method = 'wallet' | 'btc' | 'usdc' | 'iban'

export default function PayPage() {
  const [method, setMethod] = useState<Method>('usdc')
  const [stage, setStage] = useState<'pick' | 'walletconnect' | 'confirm' | 'done'>('pick')
  const [toast, showToast] = useToast()

  const done = stage === 'done'

  return (
    <div className="pay-wrap">
      <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 600, color: 'var(--dark)', marginBottom: 18 }}>
        <span style={{ color: 'var(--orange)' }}>B</span> Billiamo
      </div>
      <div className="pay-card">
        <div className="pay-head">
          <div className="row" style={{ marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontWeight: 600 }}>GF</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{profile.name}</div>
              <div style={{ fontSize: 12.5, color: '#a7a29b' }}>Fattura 2026/0015 · scadenza 7 agosto 2026</div>
            </div>
          </div>
          <div className="pay-amount">€ 3.200,00</div>
          <div style={{ marginTop: 8 }}>
            <Chip label="✓ Fattura elettronica emessa via SDI" cls="chip-ok" />
          </div>
        </div>

        <div className="pay-body">
          {done ? (
            <div style={{ textAlign: 'center', padding: '18px 0' }}>
              <CheckCircle2 size={44} color="var(--ok)" style={{ marginBottom: 10 }} />
              <div style={{ fontFamily: 'var(--serif)', fontSize: 21, fontWeight: 600, marginBottom: 6 }}>Pagamento inviato</div>
              <p style={{ fontSize: 14, color: 'var(--grey-dark)', marginBottom: 16 }}>{profile.name} è stata notificata. Grazie!</p>
              <div className="row" style={{ justifyContent: 'center', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => showToast('Aperto su basescan.org')}>Vedi su block explorer</button>
                <button className="btn btn-secondary btn-sm" onClick={() => showToast('Ricevuta PDF scaricata')}>Ricevuta PDF</button>
              </div>
            </div>
          ) : stage === 'walletconnect' ? (
            <div>
              <div className="card-title" style={{ marginBottom: 6 }}>Paga dal tuo wallet</div>
              <p style={{ fontSize: 13.5, color: 'var(--grey-dark)', marginBottom: 14 }}>Scegli con cosa pagare — convertiamo noi verso la destinazione di {profile.name.split(' ')[0]}. Wallet connesso: <span className="mono">0x71C7…976F</span></p>
              <div className="stack" style={{ gap: 8 }}>
                {[
                  { a: 'USDC su Base', bal: 'saldo 5.120,00', fee: '~€0,02' },
                  { a: 'ETH su Ethereum', bal: 'saldo 1,204', fee: '~€1,80' },
                  { a: 'USDT su Tron', bal: 'saldo 4.200,00', fee: '~€0,90' },
                ].map((o, i) => (
                  <button key={i} className="method" onClick={() => setStage('confirm')}>
                    <div><div className="m-name">{o.a}</div><div className="m-sub">{o.bal} · costi di rete (a tuo carico): {o.fee}</div></div>
                  </button>
                ))}
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => setStage('pick')}>← Altri metodi</button>
            </div>
          ) : stage === 'confirm' ? (
            <div>
              <div className="card-title" style={{ marginBottom: 10 }}>Conferma nel wallet</div>
              <div style={{ background: 'var(--surface-alt)', borderRadius: 12, padding: 16, fontSize: 14, marginBottom: 14 }}>
                <div className="row"><span>Invii</span><span className="spacer" /><b className="num">3.204,10 USDC</b></div>
                <div className="row"><span>Riceve</span><span className="spacer" /><span>€ 3.200,00 equivalenti</span></div>
                <div className="row" style={{ color: 'var(--grey-dark)', fontSize: 13 }}><span>Costi di rete (a tuo carico)</span><span className="spacer" /><span>~€ 0,02</span></div>
                <div className="row" style={{ color: 'var(--grey-dark)', fontSize: 13 }}><span>Tempo stimato</span><span className="spacer" /><span>~30 secondi</span></div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setStage('done')}>Firma la transazione</button>
              <p style={{ fontSize: 12, color: 'var(--grey)', marginTop: 10, textAlign: 'center' }}>Il pagamento va direttamente al wallet di {profile.name.split(' ')[0]} — Billiamo non custodisce mai fondi.</p>
            </div>
          ) : (
            <div>
              <div className="stack" style={{ gap: 8, marginBottom: 16 }}>
                <button className={'method' + (method === 'wallet' ? ' sel' : '')} onClick={() => setMethod('wallet')}>
                  <Wallet size={20} color="var(--orange)" />
                  <div><div className="m-name">Paga con il tuo wallet</div><div className="m-sub">Qualsiasi asset, qualsiasi rete · conferma automatica</div></div>
                </button>
                <button className={'method' + (method === 'btc' ? ' sel' : '')} onClick={() => setMethod('btc')}>
                  <span style={{ fontSize: 18 }}>₿</span>
                  <div><div className="m-name">Bitcoin on-chain</div><div className="m-sub">Conferma in 10–30 minuti</div></div>
                </button>
                <button className={'method' + (method === 'usdc' ? ' sel' : '')} onClick={() => setMethod('usdc')}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#2775CA' }}>$</span>
                  <div><div className="m-name">USDC</div><div className="m-sub">Su Base o Ethereum · stabile in dollari</div></div>
                </button>
                <button className={'method' + (method === 'iban' ? ' sel' : '')} onClick={() => setMethod('iban')}>
                  <span style={{ fontSize: 15 }}>🏦</span>
                  <div><div className="m-name">Bonifico bancario</div><div className="m-sub">1–2 giorni lavorativi</div></div>
                </button>
              </div>

              {method === 'wallet' && (
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setStage('walletconnect')}>Connetti wallet</button>
              )}
              {(method === 'btc' || method === 'usdc') && (
                <div className="qr-box">
                  <FakeQr seed={method === 'btc' ? 3 : 11} />
                  <div className="mono" style={{ fontSize: 11, wordBreak: 'break-all', textAlign: 'center', color: 'var(--grey-dark)' }}>
                    {method === 'btc' ? 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' : '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'}
                  </div>
                  <div className="row" style={{ gap: 8 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => showToast('Indirizzo copiato')}><Copy size={13} /> Copia indirizzo</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => showToast('Importo copiato')}>{method === 'btc' ? '0,03624 BTC' : '3.204,10 USDC'}</button>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--grey)' }}>Prezzo aggiornato 12s fa · costi di rete a tuo carico</div>
                  <div className="divider" style={{ width: '100%' }} />
                  <div style={{ width: '100%' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Hai già pagato? Incolla l'hash per la conferma immediata</div>
                    <div className="row">
                      <input placeholder="tx hash…" style={{ flex: 1, border: '1px solid var(--input-border)', borderRadius: 8, padding: '8px 10px', fontSize: 13 }} />
                      <button className="btn btn-primary btn-sm" onClick={() => setStage('done')}>Verifica</button>
                    </div>
                  </div>
                </div>
              )}
              {method === 'iban' && (
                <div style={{ background: 'var(--surface-alt)', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 13, color: 'var(--grey-dark)', marginBottom: 4 }}>Intestato a</div>
                  <div style={{ fontWeight: 600, marginBottom: 10 }}>{profile.name}</div>
                  <div className="mono" style={{ fontSize: 14, marginBottom: 12 }}>{profile.iban}</div>
                  <div style={{ fontSize: 13, color: 'var(--grey-dark)', marginBottom: 12 }}>Causale: <span className="mono">Fattura 2026/0015</span></div>
                  <button className="btn btn-secondary btn-sm" onClick={() => showToast('Grazie! ' + profile.name.split(' ')[0] + ' confermerà la ricezione del bonifico')}>Ho effettuato il bonifico</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: 18, fontSize: 12.5, color: 'var(--grey-dark)', textAlign: 'center' }}>
        <a href="#" onClick={e => { e.preventDefault(); showToast('Guida: cos\'è un wallet crypto (demo)') }} style={{ color: 'var(--orange-deep)' }}>Non sai cos'è un wallet crypto?</a>
        <div style={{ marginTop: 6 }}>Billiamo — fatturazione non-custodial per freelancer italiani</div>
      </div>
      {toast}
    </div>
  )
}
