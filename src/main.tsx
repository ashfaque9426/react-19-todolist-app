import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './styles/index.css'
import { AuthProvider } from './providers/AuthProvider.tsx'
import {
  RouterProvider
} from "react-router"
import router from './Routes/Routes.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
