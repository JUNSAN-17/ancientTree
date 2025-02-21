import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/main', // 父路由
      name: 'main',
      component: () => import('../views/Main.vue'),
      children: [
        {
          path: 'home',  // 使用相对路径
          name: 'home',
          component: () => import('../views/children/home.vue')
        },
        {
          path: 'treeData', // 使用相对路径
          name: 'treeData',
          component: () => import('../views/children/treeData.vue')
        },
        {
          path: 'mapShow', // 使用相对路径
          name: 'mapShow',
          component: () => import('../views/children/mapShow_copy.vue')
        },
        {
          path: 'page2', // 使用相对路径
          name: 'page2',
          component: () => import('../views/children/page2.vue')
        },
        {
          path: 'page3', // 使用相对路径
          name: 'page3',
          component: () => import('../views/children/page3.vue')
        },
        {
          path: 'page4', // 使用相对路径
          name: 'page4',
          component: () => import('../views/children/page4.vue')
        },
        {
          path: 'page5', // 使用相对路径
          name: 'page5',
          component: () => import('../views/children/page5.vue')
        }
      ]
    },
    {
      path: '/',
      name: 'login',
      component: () => import('../views/Login.vue'),
    }
  ]
})

// 路由守卫：验证登录状态
router.beforeEach((to, from, next) => {
  // 如果是访问登录页面，直接放行
  if (to.name === 'login') {
    return next();
  }

  // 判断是否已经登录（这里假设我们用 localStorage 存储登录状态）
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (isAuthenticated) {
    // 如果已登录，继续访问
    return next();
  } else {
    // 如果未登录，跳转到登录页面
    next({ name: 'login' });
  }
})

export default router;
