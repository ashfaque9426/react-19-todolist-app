import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { AuthProvider } from './providers/AuthProvider.tsx'
import {
  RouterProvider
} from "react-router"
import router from './Routes/Routes.ts'
import ErrorBoundary from './ErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallback={"Something went wrong about auth context"}>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
)
