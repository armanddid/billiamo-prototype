import { useState } from 'react'
import { Card } from './ui'
import { fmt } from '../data/fake'
import { useI18n } from '../i18n'

// Daily activity heatmap — 365 cells, 7 rows × 53 week-columns.
// Activity: invoices issued, drafts created, payments received.
// Fiscal deadlines are calendar events: marked with a dot, visible in the future too.

interface Day {
  date: Date; invoices: number; drafts: number; payments: number; eur: number
  future: boolean; deadline?: { it: string; en: string }
}

const TODAY = new Date(2026, 6, 11) // demo "today"
const YEAR_START = new Date(2026, 0, 1)

// Italian fiscal calendar 2026 (forfettario + e-invoicing)
const DEADLINES: Record<string, { it: string; en: string }> = {
  '1-28': { it: 'Bollo e-fatture Q4 2025 (F24)', en: 'E-invoice stamp duty Q4 2025 (F24)' },
  '2-28': { it: 'Bollo e-fatture — scadenza trimestrale', en: 'E-invoice stamp duty — quarterly deadline' },
  '5-31': { it: 'Bollo e-fatture Q1 (F24)', en: 'E-invoice stamp duty Q1 (F24)' },
  '6-30': { it: 'Saldo 2025 + primo acconto 2026 (F24)', en: '2025 balance + first 2026 instalment (F24)' },
  '7-30': { it: 'F24 con maggiorazione 0,4%', en: 'F24 with 0.4% surcharge' },
  '9-30': { it: 'Bollo e-fatture Q2 (F24)', en: 'E-invoice stamp duty Q2 (F24)' },
  '10-31': { it: 'Modello Redditi PF 2026', en: 'Modello Redditi PF 2026 filing' },
  '11-30': { it: 'Secondo acconto 2026 (F24) + bollo Q3', en: 'Second 2026 instalment (F24) + Q3 stamp duty' },
}

function rnd(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

function buildDays(): Day[] {
  return Array.from({ length: 365 }, (_, i) => {
    const date = new Date(2026, 0, 1 + i)
    const future = date > TODAY
    const dow = date.getDay()
    const weekend = dow === 0 || dow === 6
    let invoices = 0, drafts = 0, payments = 0
    if (!future && !weekend) {
      const r = rnd(i)
      if (r > 0.62) invoices = r > 0.92 ? 2 : 1
      const r2 = rnd(i + 500)
      if (r2 > 0.7) payments = r2 > 0.94 ? 2 : 1
      const r3 = rnd(i + 1300)
      if (r3 > 0.68) drafts = 1
    }
    const eur = payments * (900 + Math.round(rnd(i + 900) * 2400))
    const deadline = DEADLINES[`${date.getMonth() + 1}-${date.getDate()}`]
    return { date, invoices, drafts, payments, eur, future, deadline }
  })
}

const DAYS = buildDays()

const level = (d: Day) => {
  const score = d.invoices + d.drafts + d.payments
  if (score === 0) return ''
  if (score === 1) return 'l1'
  if (score === 2) return 'l2'
  if (score <= 4) return 'l3'
  return 'l4'
}

const MONTHS_IT = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function Heatmap() {
  const { lang, t } = useI18n()
  const [hover, setHover] = useState<number | null>(null)
  const months = lang === 'en' ? MONTHS_EN : MONTHS_IT
  const totInv = DAYS.reduce((s, d) => s + d.invoices, 0)

  const startPad = (YEAR_START.getDay() + 6) % 7
  const fmtDate = (d: Date) =>
    d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'it-IT', { weekday: 'short', day: 'numeric', month: 'long' })

  return (
    <Card>
      <div className="row" style={{ alignItems: 'baseline', marginBottom: 16 }}>
        <div>
          <div className="eyebrow plain" style={{ color: 'var(--grey)' }}>{t('heat.eyebrow')}</div>
          <div style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 24, marginTop: 4 }}>
            {totInv} {t('heat.invoices')}
          </div>
        </div>
        <span className="spacer" />
        <div style={{ fontSize: 12.5, color: 'var(--grey)' }}>2026</div>
      </div>
      <div className="heat-scroll">
        <div className="heat-months">{months.map(m => <span key={m}>{m}</span>)}</div>
        <div className="heat-grid">
          {Array.from({ length: startPad }, (_, i) => <span key={'pad' + i} className="heat-cell pad" />)}
          {DAYS.map((d, i) => {
            const isToday = d.date.getTime() === TODAY.getTime()
            const hoverable = !d.future || !!d.deadline
            const isLastRows = ((startPad + i) % 7) >= 4
            const col = Math.floor((startPad + i) / 7)
            const edge = col < 8 ? ' edge-l' : col > 44 ? ' edge-r' : ''
            const cls = ['heat-cell', d.future ? 'future' : level(d), d.deadline ? 'deadline' : '', isToday ? 'today' : ''].filter(Boolean).join(' ')
            return (
              <span
                key={i}
                className={cls}
                onMouseEnter={() => hoverable && setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                {hover === i && (
                  <span className={'heat-tip' + (isLastRows ? '' : ' below') + edge}>
                    <span className="t-week" style={{ display: 'block' }}>
                      {fmtDate(d.date)}{isToday ? ` — ${t('heat.today')}` : ''}
                    </span>
                    {d.deadline && (
                      <span className="t-deadline">◆ {d.deadline[lang as 'it' | 'en']}</span>
                    )}
                    {!d.future && (
                      <>
                        {d.invoices > 0 && <span className="t-row"><span>{t('heat.issued')}</span><b>{d.invoices}</b></span>}
                        {d.drafts > 0 && <span className="t-row"><span>{t('heat.drafts')}</span><b>{d.drafts}</b></span>}
                        {d.payments > 0 && <span className="t-row"><span>{t('heat.received')}</span><b>{d.payments}</b></span>}
                        {d.eur > 0 && <span className="t-row"><span>{t('heat.collected')}</span><b>{fmt(d.eur)}</b></span>}
                        {d.invoices + d.drafts + d.payments === 0 && !d.deadline && <span style={{ color: '#a7a29b' }}>{t('heat.quiet')}</span>}
                      </>
                    )}
                  </span>
                )}
              </span>
            )
          })}
        </div>
      </div>
      <div className="heat-legend">
        {t('heat.less')}
        <span className="heat-cell" /><span className="heat-cell l1" /><span className="heat-cell l2" /><span className="heat-cell l3" /><span className="heat-cell l4" />
        {t('heat.more')}
        <span style={{ marginLeft: 16 }} className="heat-cell deadline" />
        {t('heat.deadline')}
        <span style={{ marginLeft: 16 }} className="heat-cell today l2" />
        {t('heat.today')}
      </div>
    </Card>
  )
}
