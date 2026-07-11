import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'it' | 'en'

const dict: Record<string, { it: string; en: string }> = {
  // shell
  'nav.dashboard': { it: 'Dashboard', en: 'Dashboard' },
  'nav.fatture': { it: 'Fatture', en: 'Invoices' },
  'nav.clienti': { it: 'Clienti', en: 'Clients' },
  'nav.pagamenti': { it: 'Pagamenti', en: 'Payments' },
  'nav.report': { it: 'Report', en: 'Reports' },
  'nav.impostazioni': { it: 'Impostazioni', en: 'Settings' },
  'nav.account': { it: 'Il tuo account', en: 'Your account' },
  'menu.account': { it: 'Il tuo account', en: 'Your account' },
  'menu.language': { it: 'Lingua', en: 'Language' },
  'menu.help': { it: 'Centro assistenza', en: 'Help center' },
  'menu.support': { it: 'Contatta il supporto', en: 'Customer support' },
  'menu.dark': { it: 'Tema scuro', en: 'Dark mode' },
  'menu.logout': { it: 'Esci', en: 'Log out' },
  // onboarding hero
  'ob.hey': { it: 'Ciao', en: 'Hey' },
  'ob.headline': { it: 'Facciamoci pagare — con il fisco in ordine.', en: "Let's get you paid — taxes included." },
  'ob.step': { it: 'Passo', en: 'Step' },
  'ob.s1.title': { it: 'Aggiungi dove ricevere i pagamenti', en: 'Add a way to get paid' },
  'ob.s1.text': { it: 'Il tuo wallet o IBAN: è lì che arrivano i soldi. Direttamente a te — mai a noi.', en: 'Your wallet or IBAN — this is where the money shows up. Straight to you, never through us.' },
  'ob.s2.title': { it: 'Completa il profilo fiscale', en: 'Complete your fiscal profile' },
  'ob.s2.text': { it: 'P.IVA, regime, ATECO. Serve solo quando premi Invia — le bozze funzionano già.', en: "P.IVA, regime, ATECO. Only needed when you hit Send — drafts already work." },
  'ob.s3.title': { it: 'Invia la tua prima fattura', en: 'Send your first invoice' },
  'ob.s3.text': { it: 'La parte divertente. FatturaPA e SDI li gestiamo noi.', en: 'The fun part. We handle FatturaPA and SDI for you.' },
  'new.invoice': { it: 'Nuova fattura', en: 'New invoice' },
  'banner.fiscal': { it: 'Completa il tuo profilo fiscale', en: 'Complete your fiscal profile' },
  'banner.fiscal.rest': { it: 'per poter inviare fatture — bastano 2 minuti.', en: 'to be able to send invoices — takes 2 minutes.' },
  'banner.cta': { it: 'Completa ora', en: 'Complete now' },
  // dashboard
  'kpi.ytd': { it: 'Ricavi YTD', en: 'YTD revenue' },
  'kpi.outstanding': { it: 'Da incassare', en: 'Outstanding' },
  'kpi.outstanding.sub': { it: '3 fatture aperte', en: '3 open invoices' },
  'kpi.month': { it: 'Incassato — luglio', en: 'Collected — July' },
  'kpi.month.sub': { it: '€1.800 a giugno', en: '€1,800 in June' },
  'kpi.cap': { it: 'Limite forfettario', en: 'Forfettario cap' },
  'kpi.ytd.sub': { it: '+ €3.200 in attesa', en: '+ €3,200 pending' },
  'todo': { it: 'Da fare', en: 'To do' },
  'todo.empty': { it: 'Tutto in ordine — nessuna azione richiesta. 🎉', en: 'All clear — nothing needs you. 🎉' },
  'recent': { it: 'Fatture recenti', en: 'Recent invoices' },
  'all.invoices': { it: 'Tutte le fatture →', en: 'All invoices →' },
  'th.numero': { it: 'Numero', en: 'Number' },
  'th.cliente': { it: 'Cliente', en: 'Client' },
  'th.importo': { it: 'Importo', en: 'Amount' },
  'th.stato': { it: 'Stato', en: 'Status' },
  'th.pagamento': { it: 'Pagamento', en: 'Payment' },
  'th.scadenza': { it: 'Scadenza', en: 'Due' },
  'th.emessa': { it: 'Emessa', en: 'Issued' },
  // heatmap
  'heat.eyebrow': { it: 'Ritmo di fatturazione · 2026', en: 'Invoicing rhythm · 2026' },
  'heat.invoices': { it: 'fatture emesse', en: 'invoices issued' },
  'heat.issued': { it: 'Fatture emesse', en: 'Invoices issued' },
  'heat.received': { it: 'Pagamenti ricevuti', en: 'Payments received' },
  'heat.collected': { it: 'Incassato', en: 'Collected' },
  'heat.quiet': { it: 'Settimana tranquilla', en: 'Quiet week' },
  'heat.less': { it: 'Meno', en: 'Less' },
  'heat.more': { it: 'Più', en: 'More' },
  'heat.drafts': { it: 'Bozze create', en: 'Drafts created' },
  'heat.deadline': { it: 'Scadenza fiscale', en: 'Tax deadline' },
  'heat.today': { it: 'Oggi', en: 'Today' },
}

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }>({
  lang: 'it', setLang: () => {}, t: k => k,
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const t = (k: string) => dict[k]?.[lang] ?? k
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>
}

export const useI18n = () => useContext(Ctx)
