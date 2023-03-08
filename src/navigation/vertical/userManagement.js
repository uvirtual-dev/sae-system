import { Mail, ChevronsRight, MessageSquare, CheckSquare, Calendar, FileText, Circle, ShoppingCart, User } from 'react-feather'

export default [
  {
    header: 'Gestión de Usuarios'
  },
  {
    id: 'users',
    title: 'Usuarios',
    icon: <ChevronsRight />,
    navLink: '/apps/user/list'
  },
  {
    id: 'roles',
    title: 'Roles',
    icon: <ChevronsRight />,
    navLink: '/apps/role/list'
  },
  {
    id: 'modules',
    title: 'Módules',
    icon: <ChevronsRight />,
    navLink: '/apps/roleModules/list'
  }
  // {
  //   id: 'email',
  //   title: 'Email',
  //   icon: <Mail size={20} />,
  //   navLink: '/apps/email'
  // },
  // {
  //   id: 'chat',
  //   title: 'Chat',
  //   icon: <MessageSquare size={20} />,
  //   navLink: '/apps/chat'
  // },
  // {
  //   id: 'todo',
  //   title: 'Todo',
  //   icon: <CheckSquare size={20} />,
  //   navLink: '/apps/todo'
  // },
  // {
  //   id: 'calendar',
  //   title: 'Calendar',
  //   icon: <Calendar size={20} />,
  //   navLink: '/apps/calendar'
  // },
  // {
  //   id: 'invoiceApp',
  //   title: 'Invoice',
  //   icon: <FileText size={20} />,
  //   children: [
  //     {
  //       id: 'invoiceList',
  //       title: 'List',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/invoice/list'
  //     },
  //     {
  //       id: 'invoicePreview',
  //       title: 'Preview',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/invoice/preview'
  //     },
  //     {
  //       id: 'invoiceEdit',
  //       title: 'Edit',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/invoice/edit'
  //     },
  //     {
  //       id: 'invoiceAdd',
  //       title: 'Add',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/invoice/add'
  //     }
  //   ]
  // },
  // {
  //   id: 'eCommerce',
  //   title: 'eCommerce',
  //   icon: <ShoppingCart size={20} />,
  //   children: [
  //     {
  //       id: 'shop',
  //       title: 'Shop',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/ecommerce/shop'
  //     },
  //     {
  //       id: 'detail',
  //       title: 'Details',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/ecommerce/product-detail'
  //     },
  //     {
  //       id: 'wishList',
  //       title: 'Wish List',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/ecommerce/wishlist'
  //     },
  //     {
  //       id: 'checkout',
  //       title: 'Checkout',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/ecommerce/checkout'
  //     }
  //   ]
  // },
  // {
  //   id: 'gusers',
  //   title: '',
  //   icon: <User size={20} />,
  //   children: [
  //     {
  //       id: 'users',
  //       title: 'Usuarios',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/user/list'
  //     },
  //     {
  //       id: 'roles',
  //       title: 'Roles',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/role/list'
  //     },
  //     {
  //       id: 'modules',
  //       title: 'Módules',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/roleModules/list'
  //     }
  //   ]
 // }
]
