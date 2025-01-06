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
          path: 'manage',
          name: 'manage',
          component: () => import('../views/ManageView.vue'),
          children: [
            {
              path: 'account-settings',
              name: 'account-settings',
              component: () => import('../components/AccountSettings.vue'),
            },
            {
              path: 'users',
              name: 'users',
              component: () => import('../components/UserList.vue'),
            },
            {
              path: 'products',
              name: 'products',
              component: () => import('../components/ProductList.vue'),
            },
            {
              path: 'products/add',
              name: 'add-product',
              component: () => import('../components/ProductForm.vue'),
            },
            {
              path: 'products/:id/edit',
              name: 'edit-product',
              component: () => import('../components/ProductForm.vue'),
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
