// ** Routes Imports
import AuthRoutes from './Auth'
import Dashboard from './Dashboard'
import RoleRoutes from './Role'
import RoleModulesRoutes from './RoleModules'
import RolePermissionsRoutes from './RolePermissions'
import UserRoutes from './User'
import InstanceRoutes from './Instance'

// ** Document title
const TemplateTitle = '%s - Sys-SAE - UVirtual'

// ** Default Route
const DefaultRoute = '/apps/instance/view'

// ** Merge Routes
const Routes = [
  ...InstanceRoutes,
  ...Dashboard,
  ...AuthRoutes,
  ...RoleRoutes,
  ...RoleModulesRoutes,
  ...RolePermissionsRoutes,
  ...UserRoutes
]

export { DefaultRoute, TemplateTitle, Routes }
