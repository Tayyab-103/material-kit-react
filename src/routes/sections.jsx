/* eslint-disable */
import { lazy, Suspense } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const MemberPage = lazy(() => import('src/pages/members'));
export const DepartmentPage = lazy(() => import('src/pages/department'));
export const TeamPage = lazy(() => import('src/pages/team'));
export const ProjectPage = lazy(() => import('src/pages/project'));
export const LeadPage = lazy(() => import('src/pages/lead'));
export const ClientPage = lazy(() => import('src/pages/client'));
export const TaskPage = lazy(() => import('src/pages/task'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'members', element: <MemberPage /> },
        { path: 'departments', element: <DepartmentPage /> },
        { path: 'teams', element: <TeamPage /> },
        { path: 'projects', element: <ProjectPage /> },
        { path: 'leads', element: <LeadPage /> },
        { path: 'clients', element: <ClientPage /> },
        { path: 'task', element: <TaskPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
