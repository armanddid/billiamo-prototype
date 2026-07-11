import { Link } from 'react-router-dom'
import { Card, Kpi, Chip, Progress } from '../components/ui'
import { invoices, actionQueue, ytd, fmt, clientById, lifecycleChip, sdiChip, payChip } from '../data/fake'
import { AlertTriangle, AlertCircle, Info, ArrowRight } from 'lucide-react'
import { useI18n } from '../i18n'
import Heatmap from '../components/Heatmap'
import OnboardingHero from '../components/OnboardingHero'

const kindIcon = { err: <AlertCircle size={18} color="var(--err)" />, warn: <AlertTriangle size={18} color="var(--warn)" />, info: <Info size={18} color="var(--grey-dark)" /> }

export default function Dashboard() {
  const { t } = useI18n()
  const recent = invoices.filter(i => i.lifecycle !== 'draft').slice(0, 5)
  return (
    <div className="stack">
      <OnboardingHero />
      <div className="grid g4">
        <Card><Kpi label={t('kpi.ytd')} value={fmt(ytd.ricavi)} sub={t('kpi.ytd.sub')} /></Card>
        <Card><Kpi label={t('kpi.outstanding')} value={fmt(10500)} sub={t('kpi.outstanding.sub')} /></Card>
        <Card><Kpi label={t('kpi.month')} value={fmt(0)} sub={t('kpi.month.sub')} /></Card>
        <Card>
          <Kpi label={t('kpi.cap')} value={ytd.capPct + '%'} sub={`${fmt(ytd.ricavi)} di € 85.000`} />
          <div style={{ marginTop: 10 }}><Progress pct={ytd.capPct} warn={ytd.capPct >= 80} /></div>
        </Card>
      </div>

      <Heatmap />

      <Card title={t('todo')}>
        {actionQueue.length === 0 && <div style={{ color: 'var(--grey-dark)', fontSize: 14 }}>{t('todo.empty')}</div>}
        <div className="stack" style={{ gap: 4 }}>
          {actionQueue.map(a => (
            <Link key={a.id} to={a.to} className="row" style={{ padding: '12px 12px', borderRadius: 10, textDecoration: 'none' }}
              onMouseOver={e => (e.currentTarget.style.background = 'var(--surface-alt)')}
              onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
              {kindIcon[a.kind]}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{a.title}</div>
                <div style={{ fontSize: 13, color: 'var(--grey-dark)' }}>{a.sub}</div>
              </div>
              <ArrowRight size={16} color="var(--grey)" />
            </Link>
          ))}
        </div>
      </Card>

      <Card title={t('recent')}>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead><tr><th>{t('th.numero')}</th><th>{t('th.cliente')}</th><th>{t('th.importo')}</th><th>{t('th.stato')}</th><th>SDI</th><th>{t('th.pagamento')}</th><th>{t('th.scadenza')}</th></tr></thead>
            <tbody>
              {recent.map(i => {
                const c = clientById(i.clientId)
                return (
                  <tr key={i.id} className="rowlink" onClick={() => (window.location.hash = `#/fatture/${i.id}`)}>
                    <td className="mono">{i.n}</td>
                    <td>{c.name}</td>
                    <td className="num" style={{ fontWeight: 600 }}>{fmt(i.amountEur)}</td>
                    <td><Chip {...lifecycleChip[i.lifecycle]} /></td>
                    <td><Chip {...sdiChip[i.sdi]} /></td>
                    <td><Chip {...payChip[i.pay]} /></td>
                    <td className="mono">{i.due}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 12 }}><Link to="/fatture" style={{ fontSize: 13.5, color: 'var(--orange-deep)', fontWeight: 500 }}>{t('all.invoices')}</Link></div>
      </Card>
    </div>
  )
}
