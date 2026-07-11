import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom'
import './styles/app.css'
import { I18nProvider } from './i18n'
import AppShell from './layout/AppShell'
import { Landing, Welcome } from './screens/Onboarding'
import Dashboard from './screens/Dashboard'
import { InvoiceList, InvoiceEditor, InvoiceDetail, GuidedCorrection } from './screens/Fatture'
import { ClientList, ClientEdit, ClientImport, ClientDetail } from './screens/Clienti'
import Pagamenti from './screens/Pagamenti'
import Report from './screens/Report'
import Impostazioni from './screens/Impostazioni'
import Account from './screens/Account'
import PayPage from './screens/PayPage'
import CommercialistaView from './screens/Commercialista'

const router = createHashRouter([
  { path: '/', element: <Landing /> },
  { path: '/benvenuto', element: <Welcome /> },
  { path: '/pay/demo', element: <PayPage /> },
  { path: '/commercialista', element: <CommercialistaView /> },
  {
    element: <AppShell />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/fatture', element: <InvoiceList /> },
      { path: '/fatture/nuova', element: <InvoiceEditor /> },
      { path: '/fatture/:id', element: <InvoiceDetail /> },
      { path: '/fatture/:id/correzione', element: <GuidedCorrection /> },
      { path: '/clienti', element: <ClientList /> },
      { path: '/clienti/nuovo', element: <ClientEdit /> },
      { path: '/clienti/importa', element: <ClientImport /> },
      { path: '/clienti/:id', element: <ClientDetail /> },
      { path: '/pagamenti', element: <Pagamenti /> },
      { path: '/report', element: <Report /> },
      { path: '/impostazioni', element: <Impostazioni /> },
      { path: '/account', element: <Account /> },
    ],
  },
  { path: '*', element: <Navigate to="/" /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <RouterProvider router={router} />
    </I18nProvider>
  </StrictMode>,
)
