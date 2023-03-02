import { Mail, ChevronsRight, MessageSquare, CheckSquare, Calendar, FileText, Circle, ShoppingCart, User } from 'react-feather'

export default [
  {
    header: 'Home',
    action: 'read',
    resource: 'dashboard'
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <ChevronsRight />,
    action: 'read',
    resource: 'dashboard',
    navLink: '/apps/dashboard/view'
  }
 
]
