import { createBrowserRouter } from "react-router";
import App from "./App";
import ProtectedRoute from "../components/common/ProtectedRoute";
import GlobalErrorBoundary from "../components/common/ErrorBoundary";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProjectsDashboard from "../pages/projects/ProjectsDashboard";
import ProjectDetail from "../pages/projects/ProjectDetail";
import OrganizationPage from "../pages/organization/OrganizationPage";
import BoardPage from "../pages/board/BoardPage";
import BacklogPage from "../pages/project/BacklogPage";
import IssueDetailPage from "../pages/board/IssueDetailPage";
import MainLayout from "../components/layout/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "projects",
            element: <ProjectsDashboard />,
          },
          {
            path: "projects/:id",
            element: <ProjectDetail />,
          },
          {
            path: "projects/:id/board",
            element: <BoardPage />,
          },
          {
            path: "projects/:id/backlog",
            element: <BacklogPage />,
          },
          {
            path: "issues/:issueId",
            element: <IssueDetailPage />,
          },
          {
            path: "organization",
            element: <OrganizationPage />,
          },
        ],
      },
    ],
  },
]);
