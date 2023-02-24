import { lazy } from 'react'

const RoleModules = [
    {
        path: "/apps/roleModules/list",
        component: lazy(() => import("../../views/apps/roleModules/list")),
        meta: {
          NavLink: "/apps/roleModules/list",
          action: 'read',
          resource: 'roleModules'
        }
    },
      {
        path: "/apps/roleModules/edit",
        exact: true,
        component: () => <Redirect to="/apps/roleModules/edit/1" />,
        meta: {
          action: 'update',
          resource: 'roleModules'
        }
      },
      {
        path: "/apps/roleModules/edit/:id",
        component: lazy(() => import("../../views/apps/roleModules/edit")),
        meta: {
          navLink: "/apps/roleModules/edit",
          action: 'update',
          resource: 'roleModules'
        }
      },
      {
        path: "/apps/roleModules/view",
        exact: true,
        component: () => <Redirect to="/apps/roleModules/view/1" />,
        meta: {
          navLink: "/apps/roleModules/edit",
          action: 'read',
          resource: 'roleModules'
        }
      },
      {
        path: "/apps/roleModules/view/:id",
        component: lazy(() => import("../../views/apps/roleModules/view")),
        meta: {
          navLink: "/apps/roleModules/view",
          action: 'read',
          resource: 'roleModules'
        }
      }
]

export default RoleModules
