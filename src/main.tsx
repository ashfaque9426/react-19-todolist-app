import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { AuthProvider } from './providers/AuthProvider.tsx'
import {
  RouterProvider
} from "react-router"
import router from './Routes/Routes.ts'
import ErrorBoundary from './ErrorBoundary.tsx'
import LoadingData from './components/LoadingData.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ErrorBoundary fallback={"Unexpected Error Occured"}>
        <Suspense fallback={<LoadingData />}>
          <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
    </AuthProvider>
  </StrictMode>,
)
