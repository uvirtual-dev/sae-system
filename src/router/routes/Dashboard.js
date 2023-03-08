import { lazy } from 'react'
import { Redirect } from 'react-router-dom'

const Dashboard = [
      {
        path: "/apps/dashboard/view",
        exact: true,
        component: () => <Redirect to="/apps/dashboard/view/1" />,
        meta: {
          navLink: "/apps/dashboard/edit",
          action: 'read',
          resource: 'dashboard'
        }
      },
      {
        path: "/apps/dashboard/view/:id",
        component: lazy(() => import("../../views/apps/dashboard/view")),
        meta: {
          navLink: "/apps/dashboard/view",
          action: 'read',
          resource: 'dashboard'
        }
      }
]

export default Dashboard
