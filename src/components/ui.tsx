import { type ReactNode, useState } from 'react'

export function Eyebrow({ children, plain }: { children: ReactNode; plain?: boolean }) {
  return <div className={'eyebrow' + (plain ? ' plain' : '')}>{children}</div>
}

export function Card({ children, title, className, style }: { children: ReactNode; title?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={'card ' + (className ?? '')} style={style}>
      {title && <div className="card-title">{title}</div>}
      {children}
    </div>
  )
}

export function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="kpi">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  )
}

export function Chip({ label, cls, dot }: { label: string; cls: string; dot?: boolean }) {
  return <span className={`chip ${cls}` + (dot ? ' chip-dot' : '')}>{label}</span>
}

export function Toast({ msg }: { msg: string }) {
  return <div className="toast">✓ {msg}</div>
}

export function useToast(): [ReactNode, (msg: string) => void] {
  const [msg, setMsg] = useState<string | null>(null)
  const show = (m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(null), 2600)
  }
  return [msg ? <Toast msg={msg} /> : null, show]
}

export function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  )
}

export function Progress({ pct, warn }: { pct: number; warn?: boolean }) {
  return (
    <div className={'progress' + (warn ? ' warn' : '')}>
      <div style={{ width: Math.min(pct, 100) + '%' }} />
    </div>
  )
}

export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="tabs">
      {tabs.map(t => (
        <button key={t} className={t === active ? 'active' : ''} onClick={() => onChange(t)}>{t}</button>
      ))}
    </div>
  )
}

// Fake QR code — deterministic noise grid, good enough to *read* as a QR
export function FakeQr({ seed = 7, size = 148 }: { seed?: number; size?: number }) {
  const n = 21
  const cell = size / n
  const rects = []
  let s = seed
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647 }
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const finder = (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7)
    if (finder) {
      const fx = x >= n - 7 ? x - (n - 7) : x, fy = y >= n - 7 ? y - (n - 7) : y
      const ring = fx === 0 || fy === 0 || fx === 6 || fy === 6
      const core = fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4
      if (ring || core) rects.push(<rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} />)
    } else if (rnd() > 0.52) {
      rects.push(<rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} />)
    }
  }
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="#1a1614" style={{ background: '#fff', borderRadius: 8, padding: 6, boxSizing: 'content-box' }}>{rects}</svg>
}
