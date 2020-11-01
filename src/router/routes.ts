import { RouteConfig } from 'vue-router';
import Multiguard from 'vue-router-multiguard';

import Landing from '../layouts/landing.vue';
import DashboardIndex from '../views/dashboard/index.vue';
import Contacts from '../views/dashboard/contacts.vue';
import { isAuthenticationRoute, isAuthenticated } from '../middlewares/index';

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    beforeEnter: Multiguard([isAuthenticationRoute]),
    component: Landing
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../layouts/dashboard.vue'),
    beforeEnter: Multiguard([isAuthenticated]),
    children: [
      {
        path: '/',
        component: DashboardIndex
      },
      {
        path: 'contacts',
        component: Contacts
      }
    ]
  }
];

export default routes;
