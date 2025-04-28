import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { AuthProvider } from './providers/AuthProvider.tsx'
import {
  RouterProvider
} from "react-router"
import router from './Routes/Routes.ts'
import ErrorBoundary from './ErrorBoundary.tsx'
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallback={"Something went wrong about auth context"}>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthProvider>
          <RouterProvider router={router} />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthProvider>
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
)
