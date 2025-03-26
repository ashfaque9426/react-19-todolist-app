import { createBrowserRouter } from "react-router";
import App from "../App";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login";
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        Component: ProtectedRoute,
        children: [
            {
                index: true,
                Component: App
            }
        ]
      },
      {
        path: 'login',
        Component: Login
      }
    ],
  },
]);

export default router;
