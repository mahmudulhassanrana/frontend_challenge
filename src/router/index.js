import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Wallet from '../pages/Wallet.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/wallet', name: 'Wallet', component: Wallet }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
