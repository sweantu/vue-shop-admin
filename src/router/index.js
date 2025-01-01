import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/DefaultLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/HomePage.vue'),
        },
        {
          path: 'account',
          name: 'account',
          component: () => import('../views/AccountView.vue'),
        },
        {
          path: 'orders',
          name: 'orders',
          // component: () => import('../views/OrdersView.vue'),
        },
        {
          path: 'transactions',
          name: 'transactions',
          // component: () => import('../views/TransactionsView.vue'),
        },
      ],
    },
    {
      path: '/auth',
      component: () => import('../layouts/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../components/LoginForm.vue'),
        },
      ],
    },
  ],
})

export default router
