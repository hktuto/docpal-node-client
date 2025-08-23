---
title: "Authentication System"
description: "Learn about the authentication system and middleware configuration"
version: "6.0.0"
---

# Authentication System

The DocPal Node Client uses a global middleware-based authentication system to protect routes and manage user sessions.

## Overview

The authentication system consists of:

- **Global Middleware** - Automatically checks authentication on all routes
- **Auth Composable** - Provides authentication state and methods
- **Route Protection** - Redirects unauthenticated users to login
- **Public Routes** - Allows access to specific routes without authentication

## Global Middleware

The authentication middleware is located at `apps/web/app/middleware/auth.global.ts` and runs on every route change.

### Middleware Code

```typescript
import { useIsAuthenticated } from "~/composables/auth"

export default defineNuxtRouteMiddleware((to, from) => {
  const isAuthenticated = useIsAuthenticated()
  if(!to.meta.public && !isAuthenticated.value) {
    return navigateTo('/login')
  }
})
```

### How It Works

1. **Route Check** - The middleware runs on every navigation
2. **Authentication Check** - Uses `useIsAuthenticated()` composable
3. **Public Route Check** - Checks if the route has `meta.public` flag
4. **Redirect Logic** - Redirects to `/login` if not authenticated and route is not public

## Route Protection

### Protected Routes (Default)

By default, all routes require authentication. Users will be redirected to `/login` if they're not authenticated.

### Public Routes

To make a route publicly accessible, add the `public` meta flag:

```vue
<script setup lang="ts">
definePageMeta({
  public: true
})
</script>
```

### Example: Public Landing Page

```vue
<template>
  <div>
    <h1>Welcome to DocPal</h1>
    <p>This page is accessible without authentication</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  public: true
})
</script>
```

### Example: Protected Dashboard

```vue
<template>
  <div>
    <h1>Dashboard</h1>
    <p>This page requires authentication</p>
  </div>
</template>

<script setup lang="ts">
// No definePageMeta needed - protected by default
</script>
```

## Auth Composable

The authentication system uses a composable to manage authentication state.

### Usage

```vue
<script setup lang="ts">
const isAuthenticated = useIsAuthenticated()

// Check authentication status
if (isAuthenticated.value) {
  console.log('User is authenticated')
} else {
  console.log('User is not authenticated')
}
</script>
```

### Template Usage

```vue
<template>
  <div>
    <div v-if="isAuthenticated">
      <h1>Welcome, User!</h1>
      <button @click="logout">Logout</button>
    </div>
    <div v-else>
      <h1>Please log in</h1>
      <NuxtLink to="/login">Login</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const isAuthenticated = useIsAuthenticated()

const logout = () => {
  // Implement logout logic
}
</script>
```

## Login Page

The authentication system expects a login page at `/login`. Here's an example implementation:

```vue
<template>
  <div class="login-container">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" type="email" />
      </el-form-item>
      
      <el-form-item label="Password" prop="password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="handleLogin" :loading="loading">
          Login
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  public: true
})

const form = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' }
  ]
}

const loading = ref(false)
const formRef = ref()

const handleLogin = async () => {
  try {
    loading.value = true
    // Implement login logic here
    // After successful login, user will be redirected to intended page
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}
</style>
```

## Best Practices

### 1. Public Routes

Only mark routes as public if they truly don't require authentication:

- Landing pages
- Login/Register pages
- Public documentation
- Error pages

### 2. Authentication State

Always check authentication state before making API calls:

```typescript
const isAuthenticated = useIsAuthenticated()

const fetchUserData = async () => {
  if (!isAuthenticated.value) {
    return
  }
  
  // Make authenticated API call
  const { data } = await useFetch('/api/user/profile')
}
```

### 3. Loading States

Handle loading states during authentication checks:

```vue
<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="isAuthenticated">
    <!-- Authenticated content -->
  </div>
  <div v-else>
    <!-- Not authenticated content -->
  </div>
</template>
```

### 4. Error Handling

Implement proper error handling for authentication failures:

```typescript
const handleAuthError = (error: any) => {
  if (error.status === 401) {
    // Redirect to login
    navigateTo('/login')
  } else {
    // Handle other errors
    console.error('Authentication error:', error)
  }
}
```

## Configuration

### Middleware Configuration

The global middleware is automatically loaded by Nuxt. To customize:

1. Modify `apps/web/app/middleware/auth.global.ts`
2. Update the redirect path if needed
3. Add additional authentication logic

### Environment Variables

Set up authentication-related environment variables:

```bash
# .env
AUTH_SECRET=your-secret-key
AUTH_REDIRECT_URL=/login
```

## Troubleshooting

### Common Issues

1. **Infinite Redirect Loop**
   - Ensure login page has `public: true` meta
   - Check authentication state logic

2. **Middleware Not Running**
   - Verify file is named `auth.global.ts`
   - Check for TypeScript errors

3. **Authentication State Not Updating**
   - Ensure composable is properly implemented
   - Check for reactive state issues

### Debug Mode

Enable debug logging for authentication:

```typescript
// In middleware
console.log('Route:', to.path, 'Public:', to.meta.public, 'Auth:', isAuthenticated.value)
```

## Security Considerations

- Always validate authentication on the server side
- Use HTTPS in production
- Implement proper session management
- Consider implementing refresh tokens
- Log authentication events for security monitoring
