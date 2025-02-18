import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/main',
      name: 'main',
      component: ()=>import('../views/Main.vue'),      
      children:[
        {
          path:"/home",
          name:"home",
          component:()=>import('../views/children/home.vue')
        },
        {
          path:"/treeData",
          name:"treeData",
          component:()=>import('../views/children/treeData.vue')
        },
        {
          path:"/mapShow",
          name:"mapShow",
          component:()=>import('../views/children/mapShow_copy.vue')
        },
        {
          path:"/page2",
          name:"page2",
          component:()=>import('../views/children/page2.vue')
        },
        {
          path:"/page3",
          name:"page3",
          component:()=>import('../views/children/page3.vue')
        },
        {
          path:"/page4",
          name:"page4",
          component:()=>import('../views/children/page4.vue')
        },
        {
          path:"/page5",
          name:"page5",
          component:()=>import('../views/children/page5.vue')
        }]
    },
    {
      path: '/',
      name: 'login',
      component: ()=>import('../views/Login.vue'),
    }
  ]
})

export default router
