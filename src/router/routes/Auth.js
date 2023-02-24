import { lazy } from 'react'

const Auth = [
    {
        path: '/login',
        component: lazy(() => import('../../views/pages/authentication/Login')),
        layout: 'BlankLayout',
        meta: {
          authRoute: true
        }
      },
       {
        path: '/misc/not-authorized',
        component: lazy(() => import('../../views/pages/misc/NotAuthorized')),
        layout: 'BlankLayout',
        meta: {
          publicRoute: true
        }
      },
      {
        path: '/misc/maintenance',
        component: lazy(() => import('../../views/pages/misc/Maintenance')),
        layout: 'BlankLayout',
        meta: {
          publicRoute: true
        }
      },
      {
        path: '/misc/error',
        component: lazy(() => import('../../views/pages/misc/Error')),
        layout: 'BlankLayout',
        meta: {
          publicRoute: true
        }
      },
    {
        path: '/logout',
        component: lazy(() => import('../../views/pages/authentication/Logout')),
        layout: 'BlankLayout'
      
    }

]

export default Auth
