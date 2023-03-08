import { lazy } from 'react'
import { Redirect } from 'react-router-dom'

const Role = [
    {
        path: "/apps/role/list",
        component: lazy(() => import("../../views/apps/role/list")),
        meta: {
          navLink: "/apps/role/list",
          action: 'read',
          resource: 'roles'
        }
   },
      {
        path: "/apps/role/edit",
        exact: true,
        component: () => <Redirect to="/apps/role/edit/1" />,
        meta: {
          navLink: "/apps/role/edit",
          action: 'update',
          resource: 'role'
        }
      },
      {
        path: "/apps/role/editPermissions/:id",
        component: lazy(() => import("../../views/apps/role/editPermissions")),
        meta: {
          navLink: "/apps/role/editPermissions",
          action: 'update',
          resource: 'rolePermissions'
        }
      },
      {
        path: "/apps/role/roleModulesRelation/:id",
        component: lazy(() => import("../../views/apps/role/roleModulesRelation")),
        meta: {
          navLink: "/apps/role/roleModulesRelation",
          action: 'update',
          resource: 'rolePermissions'
        }
      },
      {
        path: "/apps/role/edit/:id",
        component: lazy(() => import("../../views/apps/role/edit")),
        meta: {
          navLink: "/apps/role/edit",
          action: 'update',
          resource: 'role'
        }
      },
      {
        path: "/apps/role/view",
        exact: true,
        component: () => <Redirect to="/apps/role/view/1" />,
        meta: {
          navLink: "/apps/role/view",
          action: 'read',
          resource: 'role'
        }
      },
      {
        path: "/apps/role/view/:id",
        component: lazy(() => import("../../views/apps/role/view")),
        meta: {
          navLink: "/apps/role/view",
          action: 'read',
          resource: 'role'
        }
      }
]

export default Role
