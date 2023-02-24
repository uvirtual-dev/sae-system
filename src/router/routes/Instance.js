import { lazy } from 'react'
import { Redirect } from 'react-router-dom'

const instance = [
    {
        path: "/apps/instance/list",
        component: lazy(() => import("../../views/apps/instance/list")),
        meta: {
          action: 'read',
          resource: 'instance'
        }
      },
      {
        path: "/apps/program/edit",
        exact: true,
        component: () => <Redirect to="/apps/instance/edit/1" />,
        meta: {
          action: 'update',
          resource: 'instance'
        }
      },
      {
        path: "/apps/instance/edit/:id",
        component: lazy(() => import("../../views/apps/instance/edit")),
        meta: {
          action: 'update',
          resource: 'instance',
          navLink: "/apps/instance/edit"
        }
      },
      {
        path: "/apps/instance/view",
        exact: true,
        component: () => <Redirect to="/apps/instance/view/1" />,
        meta: {
          action: 'read',
          resource: 'instance'
        }
      },
      {
        path: "/apps/instance/view/:id",
        component: lazy(() => import("../../views/apps/instance/view")),
        meta: {
          action: 'read',
          resource: 'instance',
          navLink: "/apps/instance/view"
        }
      }
      
]

export default instance
