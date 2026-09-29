import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/HomeView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    // Fixed bottom action bar → pad footer so it isn't covered
    stickyBar?: 'always' | 'mobile'
    requiresAuth?: boolean
    guestOnly?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(),
  // Wait for the outgoing page to fade (page-leave ~150ms) before jumping to top
  scrollBehavior: (to, from, saved) => new Promise(resolve => setTimeout(() => resolve(saved ?? { top: 0 }), to.path === from.path ? 0 : 160)),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/exercises', name: 'exercises', component: () => import('@/views/ExercisesView.vue') },
    { path: '/calories', name: 'calories', component: () => import('@/views/CaloriesView.vue') },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: () => import('@/views/RegisterView.vue'), meta: { guestOnly: true } },
    { path: '/programs', name: 'programs', component: () => import('@/views/ProgramsView.vue'), meta: { requiresAuth: true } },
    { path: '/programs/new', name: 'program-new', component: () => import('@/views/ProgramEditView.vue'), meta: { requiresAuth: true, stickyBar: 'mobile' } },
    { path: '/programs/:id/edit', name: 'program-edit', component: () => import('@/views/ProgramEditView.vue'), props: true, meta: { requiresAuth: true, stickyBar: 'mobile' } },
    { path: '/workout/:logId', name: 'workout', component: () => import('@/views/WorkoutSessionView.vue'), props: true, meta: { requiresAuth: true, stickyBar: 'always' } },
    { path: '/profile', name: 'profile', component: () => import('@/views/ProfileView.vue'), meta: { requiresAuth: true } },
    { path: '/history', name: 'history', component: () => import('@/views/HistoryView.vue'), meta: { requiresAuth: true } },
    { path: '/history/:id', name: 'log-detail', component: () => import('@/views/LogDetailView.vue'), props: true, meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.fetchMe()
  if (to.meta.requiresAuth && !auth.user) return { path: '/login', query: { redirect: to.fullPath } }
  if (to.meta.guestOnly && auth.user) return '/programs'
})

export default router
