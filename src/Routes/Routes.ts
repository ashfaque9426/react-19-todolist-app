import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login";
import ProtectedRoute from './ProtectedRoute';
import Registration from "../pages/Registration";
import HomePage from "../pages/HomePage";
import EditSelectedTodo from "../pages/EditSelectedTodo";
import About from "../pages/About";
import UpdatePassword from "../pages/UpdatePassword";
import AddTodo from "../pages/AddTodo";
import EditTodo from "../pages/EditTodo";
import EmailValidationConfirm from "../pages/EmailValidationConfirm";

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
            path: 'edit-todo/:id',
            Component: EditSelectedTodo
          },
          {
            path: 'add-todo',
            Component: AddTodo
          },
          {
            path: 'edit-todo',
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
            path: 'update-password',
            Component: UpdatePassword
          },
          {
            path: 'verify-email',
            Component: EmailValidationConfirm
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
