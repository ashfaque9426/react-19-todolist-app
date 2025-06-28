import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login";
import ProtectedRoute from './ProtectedRoute';
import Registration from "../pages/Registration";
import HomePage from "../pages/HomePage";
import About from "../pages/About";
import AddTodo from "../pages/AddTodo";
import EditTodo from "../pages/EditTodo";
import EmailVerificationAndPassUpdate from "../pages/EmailVerificationAndPassUpdate";

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
            Component: HomePage
          },
          {
            path: 'add-todo',
            Component: AddTodo
          },
          {
            path: 'edit-todo/:recordId',
            Component: EditTodo
          },
          {
            path: 'login',
            Component: Login
          },
          {
            path: 'register',
            Component: Registration
          },
          {
            path: 'update-password/:token',
            Component: EmailVerificationAndPassUpdate
          },
          {
            path: 'verify-email/:token',
            Component: EmailVerificationAndPassUpdate
          }
        ]
      },
      {
        path: 'about',
        Component: About
      }
    ],
  },
]);

export default router;
