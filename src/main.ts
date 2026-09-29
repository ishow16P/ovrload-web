import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { vReveal } from './directives/reveal'
import { setUnauthorizedHandler } from './lib/api'
import router from './router'
import { useAuthStore } from './stores/auth'
import './assets/main.css'
import 'vue-sonner/style.css'

const app = createApp(App).use(createPinia()).use(router).directive('reveal', vReveal)

setUnauthorizedHandler(() => {
  useAuthStore().clear()
  const { fullPath, meta } = router.currentRoute.value
  if (meta.requiresAuth) router.replace({ path: '/login', query: { redirect: fullPath } })
})

app.mount('#app')
