import { NavLink, Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, Users, Wallet, PieChart, Settings, Bell, Plus, User, HelpCircle, MessageCircle, Moon, LogOut, Languages } from 'lucide-react'
import { profile, actionQueue } from '../data/fake'
import { useState, useRef, useEffect } from 'react'
import { useI18n, type Lang } from '../i18n'
import Assistant from '../components/Assistant'

const nav = [
  { to: '/dashboard', key: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/fatture', key: 'nav.fatture', icon: FileText },
  { to: '/clienti', key: 'nav.clienti', icon: Users },
  { to: '/pagamenti', key: 'nav.pagamenti', icon: Wallet },
  { to: '/report', key: 'nav.report', icon: PieChart },
]

export default function AppShell() {
  const loc = useLocation()
  const navigate = useNavigate()
  const [bellOpen, setBellOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { lang, setLang, t } = useI18n()

  useEffect(() => {
    const close = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const title = loc.pathname.startsWith('/impostazioni')
    ? t('nav.impostazioni')
    : loc.pathname.startsWith('/account')
      ? t('nav.account')
      : t(nav.find(n => loc.pathname.startsWith(n.to))?.key ?? 'nav.dashboard')

  return (
    <div className="shell">
      <aside className="rail">
        <Link to="/dashboard" className="rail-logo">B</Link>
        <nav className="rail-nav">
          {nav.map(({ to, key, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => 'rail-item' + (isActive ? ' active' : '')}>
              <Icon size={20} strokeWidth={1.8} />
              <span className="tip">{t(key)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="rail-bottom" ref={menuRef} style={{ position: 'relative' }}>
          <NavLink to="/impostazioni" className={({ isActive }) => 'rail-item' + (isActive ? ' active' : '')}>
            <Settings size={20} strokeWidth={1.8} />
            <span className="tip">{t('nav.impostazioni')}</span>
          </NavLink>
          <button className="rail-item" style={{ background: 'none', border: 'none', height: 'auto', padding: '4px 0' }} onClick={() => setMenuOpen(v => !v)} aria-label="Account menu">
            <span className="rail-avatar">{profile.initials}</span>
          </button>
          {menuOpen && (
            <div className="acct-menu">
              <div className="who">
                <span className="rail-avatar" style={{ width: 34, height: 34, fontSize: 12 }}>{profile.initials}</span>
                <div>
                  <div className="nm">{profile.name}</div>
                  <div className="em">{profile.email}</div>
                </div>
              </div>
              <button className="mi" onClick={() => { navigate('/account'); setMenuOpen(false) }}>
                <User size={16} /> {t('menu.account')}
              </button>
              <button className="mi" onClick={() => { navigate('/impostazioni'); setMenuOpen(false) }}>
                <Settings size={16} /> {t('nav.impostazioni')}
              </button>
              <div className="mi" style={{ cursor: 'default' }}>
                <Languages size={16} /> {t('menu.language')}
                <select
                  className="end"
                  value={lang}
                  onChange={e => setLang(e.target.value as Lang)}
                  style={{ border: '1px solid var(--input-border)', borderRadius: 7, padding: '3px 6px', fontSize: 12.5 }}>
                  <option value="en">English</option>
                  <option value="it">Italiano</option>
                </select>
              </div>
              <div className="sep" />
              <button className="mi"><HelpCircle size={16} /> {t('menu.help')}</button>
              <button className="mi"><MessageCircle size={16} /> {t('menu.support')}</button>
              <div className="mi" style={{ cursor: 'default', color: 'var(--grey)' }}>
                <Moon size={16} /> {t('menu.dark')} <span className="end" style={{ fontFamily: 'var(--mono)', fontSize: 9.5 }}>SOON</span>
              </div>
              <div className="sep" />
              <button className="mi" onClick={() => { navigate('/'); setMenuOpen(false) }}>
                <LogOut size={16} /> {t('menu.logout')}
              </button>
            </div>
          )}
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <div className="topbar-title">{title}</div>
          <div className="topbar-actions">
            <div style={{ position: 'relative' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setBellOpen(v => !v)} aria-label="Notifications">
                <Bell size={18} />
                {actionQueue.length > 0 && <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: 4, background: 'var(--orange)' }} />}
              </button>
              {bellOpen && (
                <div className="card" style={{ position: 'absolute', right: 0, top: 42, width: 340, zIndex: 60, padding: 12 }}>
                  {actionQueue.map(a => (
                    <Link key={a.id} to={a.to} onClick={() => setBellOpen(false)} style={{ display: 'block', padding: '10px 10px', borderRadius: 8, textDecoration: 'none' }}
                      onMouseOver={e => (e.currentTarget.style.background = 'var(--surface-alt)')}
                      onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{a.title}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--grey-dark)' }}>{a.sub}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/fatture/nuova" className="btn btn-primary btn-sm"><Plus size={16} /> {t('new.invoice')}</Link>
          </div>
        </header>
        <div className="content">
          {!profile.complete && (
            <div className="banner">
              <span>⚠️</span>
              <span><b>{t('banner.fiscal')}</b> {t('banner.fiscal.rest')}</span>
              <span className="spacer" />
              <Link to="/account" className="btn btn-secondary btn-sm">{t('banner.cta')}</Link>
            </div>
          )}
          <Outlet />
        </div>
      </div>
      <Assistant />
    </div>
  )
}
