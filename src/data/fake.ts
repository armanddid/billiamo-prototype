// Fake data for the Billiamo prototype. Entities mirror wiki/product/Information Architecture.md.

export type ClientType = 'it_business' | 'it_consumer' | 'eu_business' | 'non_eu_business'
export type Lifecycle = 'draft' | 'sent' | 'viewed' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled'
export type SdiStatus = 'none' | 'submitted' | 'processing' | 'delivered' | 'not_delivered' | 'rejected'
export type PayStatus = 'none' | 'awaiting' | 'detected' | 'confirmed'
export type Rail = 'BTC' | 'USDC' | 'EURC' | 'IBAN'

export const profile = {
  name: 'Giulia Ferraro',
  initials: 'GF',
  email: 'giulia.ferraro@gmail.com',
  piva: '02847610392',
  cf: 'FRRGLI91T55D704X',
  address: 'Via Mazzini 24, 48121 Ravenna (RA)',
  regime: 'forfettario' as 'forfettario' | 'ordinario',
  impatriati: false,
  ateco: { code: '62.02.00', label: 'Consulenza nel settore delle tecnologie dell\'informatica', coeff: 0.67 },
  rate: 0.05,
  cassa: 'INPS Gestione Separata',
  complete: true, // flip to false to see the deferred-onboarding banner + send gate
  logo: null,
  settlement: [
    { id: 'w1', label: 'Ledger — BTC', chain: 'Bitcoin', addr: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
    { id: 'w2', label: 'Metamask — Base', chain: 'Base (EVM)', addr: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
  ],
  rails: { BTC: true, USDC: true, EURC: false, IBAN: true },
  iban: 'IT60 X054 2811 1010 0000 0123 456',
  defaultMethod: 'USDC' as Rail,
  plan: 'pro' as 'free' | 'pro',
}

export const clients = [
  { id: 'c1', type: 'non_eu_business' as ClientType, name: 'Nakamoto Labs Inc.', country: 'USA', vat: 'EIN 84-2931077', email: 'billing@nakamotolabs.io', invoiced: 18400, pec: '', dest: '' },
  { id: 'c2', type: 'eu_business' as ClientType, name: 'Chainwerk GmbH', country: 'Germania', vat: 'DE 314 259 076', email: 'accounts@chainwerk.de', invoiced: 9600, pec: '', dest: '' },
  { id: 'c3', type: 'it_business' as ClientType, name: 'Borgo Digitale S.r.l.', country: 'Italia', vat: 'P.IVA 04512870159', email: 'amministrazione@borgodigitale.it', invoiced: 6200, pec: 'borgodigitale@legalmail.it', dest: 'M5UXCR1' },
  { id: 'c4', type: 'it_business' as ClientType, name: 'Studio Venturi & Associati', country: 'Italia', vat: 'P.IVA 01988320399', email: 'info@studioventuri.it', invoiced: 3100, pec: 'studioventuri@pec.it', dest: '0000000' },
  { id: 'c5', type: 'it_consumer' as ClientType, name: 'Marco Bellini', country: 'Italia', vat: 'CF BLLMRC88E14H199K', email: 'marco.bellini@gmail.com', invoiced: 950, pec: '', dest: '' },
]

export const clientTypeLabel: Record<ClientType, string> = {
  it_business: 'IT · Azienda',
  it_consumer: 'IT · Privato',
  eu_business: 'UE · Azienda',
  non_eu_business: 'Extra-UE',
}

export interface Invoice {
  id: string; n: string; clientId: string; date: string; due: string
  amountEur: number; bollo: boolean
  lifecycle: Lifecycle; sdi: SdiStatus; pay: PayStatus
  rails: Rail[]
  lines: { desc: string; qty: number; price: number }[]
  payments: { id: string; rail: Rail; date: string; eur: number; crypto?: string; tx?: string; source: string }[]
  sdiError?: { code: string; msg: string }
}

export const invoices: Invoice[] = [
  {
    id: 'i15', n: '2026/0015', clientId: 'c1', date: '2026-07-08', due: '2026-08-07',
    amountEur: 3200, bollo: true, lifecycle: 'sent', sdi: 'processing', pay: 'awaiting',
    rails: ['BTC', 'USDC', 'IBAN'],
    lines: [{ desc: 'Sviluppo smart contract — milestone 2', qty: 1, price: 3200 }],
    payments: [],
  },
  {
    id: 'i14', n: '2026/0014', clientId: 'c2', date: '2026-07-03', due: '2026-08-02',
    amountEur: 2400, bollo: true, lifecycle: 'sent', sdi: 'rejected', pay: 'awaiting',
    rails: ['USDC', 'IBAN'],
    lines: [{ desc: 'Audit di sicurezza — sprint luglio', qty: 1, price: 2400 }],
    payments: [],
    sdiError: { code: '00305', msg: 'IdFiscaleIVA del CessionarioCommittente non valido — il numero di partita IVA del cliente non risulta in Anagrafe Tributaria.' },
  },
  {
    id: 'i13', n: '2026/0013', clientId: 'c3', date: '2026-06-24', due: '2026-07-24',
    amountEur: 1800, bollo: true, lifecycle: 'paid', sdi: 'delivered', pay: 'confirmed',
    rails: ['USDC'],
    lines: [{ desc: 'Consulenza architettura cloud', qty: 3, price: 600 }],
    payments: [{ id: 'p3', rail: 'USDC', date: '2026-06-30', eur: 1800, crypto: '1.802,41 USDC', tx: '0x8f3a…c21d', source: 'tx-paste (cliente)' }],
  },
  {
    id: 'i12', n: '2026/0012', clientId: 'c1', date: '2026-06-10', due: '2026-07-10',
    amountEur: 5200, bollo: true, lifecycle: 'overdue', sdi: 'delivered', pay: 'awaiting',
    rails: ['BTC', 'USDC', 'IBAN'],
    lines: [{ desc: 'Sviluppo smart contract — milestone 1', qty: 1, price: 5200 }],
    payments: [],
  },
  {
    id: 'i11', n: '2026/0011', clientId: 'c4', date: '2026-05-28', due: '2026-06-27',
    amountEur: 3100, bollo: true, lifecycle: 'partially_paid', sdi: 'delivered', pay: 'detected',
    rails: ['BTC', 'IBAN'],
    lines: [{ desc: 'Sito web + area riservata', qty: 1, price: 3100 }],
    payments: [{ id: 'p2', rail: 'BTC', date: '2026-06-04', eur: 1500, crypto: '0,01710 BTC', tx: 'a91b…44e0', source: 'tx-paste (freelancer)' }],
  },
  {
    id: 'i10', n: '2026/0010', clientId: 'c2', date: '2026-05-12', due: '2026-06-11',
    amountEur: 7200, bollo: true, lifecycle: 'paid', sdi: 'not_delivered', pay: 'confirmed',
    rails: ['BTC', 'USDC'],
    lines: [{ desc: 'Integrazione API pagamenti', qty: 1, price: 7200 }],
    payments: [{ id: 'p1', rail: 'BTC', date: '2026-05-20', eur: 7200, crypto: '0,08154 BTC', tx: 'f3c9…8ab2', source: 'tx-paste (cliente)' }],
  },
  {
    id: 'i09', n: '— bozza —', clientId: 'c5', date: '2026-07-11', due: '2026-08-10',
    amountEur: 950, bollo: true, lifecycle: 'draft', sdi: 'none', pay: 'none',
    rails: ['BTC', 'IBAN'],
    lines: [{ desc: 'Manutenzione sito annuale', qty: 1, price: 950 }],
    payments: [],
  },
]

export const lots = [
  { id: 'l1', asset: 'BTC', qty: '0,08154', eur: 7200, rate: '88.298 €/BTC', src: 'Kraken', ts: '2026-05-20 14:32', invoice: '2026/0010', disposed: false },
  { id: 'l2', asset: 'BTC', qty: '0,01710', eur: 1500, rate: '87.719 €/BTC', src: 'Kraken', ts: '2026-06-04 09:15', invoice: '2026/0011', disposed: false },
  { id: 'l3', asset: 'USDC', qty: '1.802,41', eur: 1800, rate: '0,9987 €/USDC', src: 'CoinGecko', ts: '2026-06-30 16:48', invoice: '2026/0013', disposed: false },
]

export const snapshots = [
  { id: 's2', v: 2, date: '2026-07-01 10:22', by: 'Giulia', sent: true, note: 'Inviata al commercialista' },
  { id: 's1', v: 1, date: '2026-04-14 18:03', by: 'Giulia', sent: false, note: 'Prima bozza acconto' },
]

export const ytd = {
  ricavi: 22850,
  imponibile: Math.round(22850 * 0.67),
  imposta: Math.round(22850 * 0.67 * 0.05),
  inps: Math.round(22850 * 0.67 * 0.2607),
  capPct: Math.round((22850 / 85000) * 100),
  gains26: 0,
  gains33: 0,
}

export const actionQueue = [
  { id: 'a1', kind: 'err' as const, title: 'Invoice 2026/0014 rejected by SDI', sub: 'Error 00305 — 4 days left to correct and resubmit', to: '/fatture/i14/correzione' },
  { id: 'a2', kind: 'warn' as const, title: 'Invoice 2026/0012 is 1 day overdue', sub: 'Nakamoto Labs Inc. — €5,200.00 · send a reminder', to: '/fatture/i12' },
  { id: 'a3', kind: 'info' as const, title: 'Partial payment on 2026/0011', sub: 'Received €1,500 of €3,100 — request the balance', to: '/fatture/i11' },
]

export const commercialista = {
  name: 'Dott. Andrea Rossini',
  studio: 'Studio Rossini — Commercialisti Associati',
  email: 'rossini@studiorossini.it',
  grantExpiry: '31 marzo 2027',
  checklist: [
    { ok: false, label: '1 fattura scartata da SDI non risolta', detail: '2026/0014 — codice 00305' },
    { ok: true, label: 'Esterometro: nessuna scadenza mancante', detail: '' },
    { ok: true, label: 'Tutte le fatture pagate hanno lotti di carico', detail: '' },
    { ok: true, label: 'Marca da bollo: aggregato Q2 completo', detail: '' },
  ],
}

export const fmt = (n: number) => '€ ' + n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const clientById = (id: string) => clients.find(c => c.id === id)!

export const lifecycleChip: Record<Lifecycle, { label: string; cls: string }> = {
  draft: { label: 'Draft', cls: 'chip-info' },
  sent: { label: 'Sent', cls: 'chip-info' },
  viewed: { label: 'Viewed', cls: 'chip-info' },
  paid: { label: 'Paid', cls: 'chip-ok' },
  partially_paid: { label: 'Partial', cls: 'chip-warn' },
  overdue: { label: 'Overdue', cls: 'chip-err' },
  cancelled: { label: 'Cancelled', cls: 'chip-info' },
}
export const sdiChip: Record<SdiStatus, { label: string; cls: string }> = {
  none: { label: '—', cls: 'chip-info' },
  submitted: { label: 'SDI · Submitted', cls: 'chip-info' },
  processing: { label: 'SDI · Processing', cls: 'chip-info' },
  delivered: { label: 'SDI · Delivered', cls: 'chip-ok' },
  not_delivered: { label: 'SDI · Not delivered', cls: 'chip-warn' },
  rejected: { label: 'SDI · Rejected', cls: 'chip-err' },
}
export const payChip: Record<PayStatus, { label: string; cls: string }> = {
  none: { label: '—', cls: 'chip-info' },
  awaiting: { label: 'Awaiting', cls: 'chip-info' },
  detected: { label: 'Detected', cls: 'chip-warn' },
  confirmed: { label: 'Confirmed', cls: 'chip-ok' },
}
