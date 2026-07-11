import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, FileCheck, Send, X, Check } from 'lucide-react'
import { profile } from '../data/fake'
import { useI18n } from '../i18n'

// Acctual-inspired first-run hero: greeting + progress + three clear steps.
// Demo state: flip these to see progress fill (real app derives them from data).
const DONE = { getPaid: false, fiscal: false, firstInvoice: false }

export default function OnboardingHero() {
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('billiamo_onboarded') === '1')
  const nav = useNavigate()
  const { t } = useI18n()
  if (dismissed) return null

  const steps = [
    {
      done: DONE.getPaid, icon: Wallet, to: '/impostazioni',
      title: t('ob.s1.title'), text: t('ob.s1.text'),
    },
    {
      done: DONE.fiscal, icon: FileCheck, to: '/account',
      title: t('ob.s2.title'), text: t('ob.s2.text'),
    },
    {
      done: DONE.firstInvoice, icon: Send, to: '/fatture/nuova',
      title: t('ob.s3.title'), text: t('ob.s3.text'),
    },
  ]
  const doneCount = steps.filter(s => s.done).length

  return (
    <div className="ob-hero">
      <div className="row" style={{ alignItems: 'baseline' }}>
        <h2 className="ob-title">{t('ob.hey')} {profile.name.split(' ')[0]}. {t('ob.headline')}</h2>
        <span className="spacer" />
        <span className="ob-step">{t('ob.step')} {doneCount}/3</span>
        <button className="btn btn-ghost btn-sm" aria-label="Dismiss" onClick={() => { sessionStorage.setItem('billiamo_onboarded', '1'); setDismissed(true) }}>
          <X size={16} />
        </button>
      </div>
      <div className="ob-progress"><div style={{ width: Math.max(doneCount / 3 * 100, 4) + '%' }} /></div>
      <div className="ob-steps">
        {steps.map((s, i) => (
          <button key={i} className={'ob-card' + (s.done ? ' done' : '')} onClick={() => nav(s.to)}>
            <div className="ob-icon">{s.done ? <Check size={18} /> : <s.icon size={18} strokeWidth={1.8} />}</div>
            <div className="ob-card-title">{s.title}</div>
            <div className="ob-card-text">{s.text}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
