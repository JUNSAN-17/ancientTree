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
          path: 'home',
          name: 'home',
          component: () => import('../views/children/home.vue')
        },
        {
          path: 'treeData',
          name: 'treeData',
          component: () => import('../views/children/treeData.vue')
        },
        {
          path: 'mapShow',
          name: 'mapShow',
          component: () => import('../views/children/mapShow_copy.vue')
        },
        {
          path: 'userManagement',
          name: 'userManagement',
          component: () => import('../views/children/userManagement.vue')
        },
        {
          path: 'roleManagement',
          name: 'roleManagement',
          component: () => import('../views/children/roleManagement.vue')
        },
        {
          path: 'systemSetting',
          name: 'systemSetting',
          component: () => import('../views/children/systemSetting.vue')
        },
        {
          path: 'treeStatistics',
          name: 'treeStatistics',
          component: () => import('../views/children/treeStatistics.vue')
        },
        {
          path: 'userStatistics',
          name: 'userStatistics',
          component: () => import('../views/children/userStatistics.vue')
        },
        {
          path: 'bigShow',
          name: 'bigShow',
          component: () => import('../views/children/bigShow.vue')
        },
        {
          path: 'threeShow',
          name: 'threeShow',
          component: () => import('../views/children/threeShow.vue')
        },
        {
          path: 'chatOnline',
          name: 'chatOnline',
          component: () => import('../views/children/chatOnline.vue')
        },
        {
          path: 'bodyShow',
          name: 'bodyShow',
          component: () => import('../views/children/bodyShow.vue')
        },
        {
          path: 'userAsk',
          name: 'userAsk',
          component: () => import('../views/children/userAsk.vue')
        },
        {
          path: 'expertResponse',
          name: 'expertResponse',
          component: () => import('../views/children/expertResponse.vue')
        },
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
