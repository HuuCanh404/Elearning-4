/**
 * ===========================================
 * MAIN.JS - Entry Point
 * Vue 3 Application Initialization
 * ===========================================
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

// Styles
import './styles/main.css'

// Create Vue App
const app = createApp(App)

// Use Plugins
app.use(createPinia())
app.use(router)
app.use(i18n)

// Global Error Handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global Error:', err)
  console.error('Component:', instance)
  console.error('Error Info:', info)
}

// Mount App
app.mount('#app')
