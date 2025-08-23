import { useIsAuthenticated } from "~/composables/auth"

export default defineNuxtRouteMiddleware((to, from) => {
  const isAuthenticated = useIsAuthenticated()
  if(!to.meta.public && !isAuthenticated.value) {
    return navigateTo('/login')
  }
})