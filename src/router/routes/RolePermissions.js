import { lazy } from 'react'

const RolePermissions = [
    {
        path: "/apps/rolePermissions/list",
        component: lazy(() => import("../../views/apps/rolePermissions/list")),
        meta: {
          NavLink: "/apps/rolePermissions/list",
          action: 'read',
          resource: 'rolePermissions'
        }
    },
      {
        path: "/apps/rolePermissions/edit",
        exact: true,
        component: () => <Redirect to="/apps/rolePermissions/edit/1" />,
        meta: {
          action: 'update',
          resource: 'rolePermissions'
        }
      },
      {
        path: "/apps/rolePermissions/edit/:id",
        component: lazy(() => import("../../views/apps/rolePermissions/edit")),
        meta: {
          navLink: "/apps/rolePermissions/edit",
          action: 'update',
          resource: 'rolePermissions'
        }
      },
      {
        path: "/apps/rolePermissions/view",
        exact: true,
        component: () => <Redirect to="/apps/rolePermissions/view/1" />,
        meta: {
          navLink: "/apps/rolePermissions/edit",
          action: 'read',
          resource: 'rolePermissions'
        }
      },
      {
        path: "/apps/rolePermissions/view/:id",
        component: lazy(() => import("../../views/apps/rolePermissions/view")),
        meta: {
          navLink: "/apps/rolePermissions/view",
          action: 'read',
          resource: 'rolePermissions'
        }
      }
]

export default RolePermissions
