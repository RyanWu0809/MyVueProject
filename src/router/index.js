import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import BindComponentsView from '../views/BindComponentsView.vue'
import BindJigView from '../views/BindJigView.vue'
import SolderingView from '../views/SolderingView.vue'
import TestResultInView from '../views/TestResultInView.vue'
import TestResultInByCsvView from '../views/TestResultInByCsvView.vue'
import QuerySNHistoryView from '../views/QuerySNHistoryView.vue'

const routes = [
  { path: '/', name: 'HomeView', component: HomeView, meta: { requiresAuth: true } },
  { path: '/Login', name: 'LoginView', component: LoginView },
  { path: '/BindComponents', name: 'BindComponentsView', component: BindComponentsView, meta: { requiresAuth: true } },
  { path: '/BindJig', name: 'BindJigView', component: BindJigView, meta: { requiresAuth: true } },
  { path: '/Soldering', name: 'SolderingView', component: SolderingView, meta: { requiresAuth: true }},
  { path: '/TestResultIn', name: 'TestResultInView', component: TestResultInView, meta: { requiresAuth: true } },
  { path: '/TestResultInByCsv', name: 'TestResultInByCsvView', component: TestResultInByCsvView, meta: { requiresAuth: true } },
  { path: '/QuerySNHistory', name: 'QuerySNHistoryView', component: QuerySNHistoryView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 路由守衛
router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem('isLoggedIn'); // 用 sessionStorage 儲存登入狀態

  if ((to.meta.requiresAuth && !isAuthenticated) || !to.matched.length) {
    // 如果需要驗證且未登入，或是未登入亂key網址 ==> 導航到 LoginView
    next('/Login');
  } else if (to.name === 'LoginView' && isAuthenticated) {
    // 如果已登入，防止進入 LoginView，導航到首頁
    next('/');
  } else {
    // 其他情況允許繼續導航
    next();
  }
});

export default router
