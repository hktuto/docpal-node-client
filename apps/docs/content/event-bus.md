---
title: "Global Event Bus System"
description: "Comprehensive guide to the eventbus library for type-safe application-wide event handling"
---

# Global Event Bus System

This guide explains how to use the global event bus system built with the custom `eventbus` library for type-safe system-wide event handling in the DocPal Node Client.

## Overview

The event bus system provides a centralized way to handle application-wide events like user login/logout, theme changes, server health status updates, and more. The system uses a custom eventbus library that wraps VueUse's `useEventBus` with predefined event types for better consistency and type safety.

## Key Components

### 1. EventBus Library (`libraries/eventbus`)

This library contains:
- **EventType Enum**: Predefined event types for consistent usage
- **GlobalPasteEvent Enum**: Special paste events for clipboard operations
- **emitBus Function**: Helper function for event emission
- **VueUse Integration**: Built on top of VueUse's useEventBus

### 2. Event Types

The system uses enum-based event types defined in `EventType`:

```typescript
export enum EventType {
  // Authentication related
  USER_LOGIN__SUCCESS = 'user-login--success',
  USER_LOGIN__EXPIRE = 'user-login--expire',
  
  // User preferences
  USER_PREFERENCE_CHANGE__TIME = 'user-preference-change--time',
  
  // Table operations
  TABLE_CONTEXT_MENU_OPEN = 'table-context-menu-open',
  TABLE_CONTEXT_MENU_CLOSE = 'table-context-menu-close',
  TABLE_ZOOM_MAX = 'table-zoom-max',
  TABLE_ZOOM_REVERT = 'table-zoom-revert',
  
  // UI operations
  OPEN_SETTINGS = 'open-settings',
  CLOSE_SETTINGS = 'close-settings',
  
  // File operations
  FILE_NEED_REFRESH = 'file-need-refresh',
  FILE_DELETED = 'FILE_DELETED',
  FILE_PREVIEW_OPEN = 'file-preview-open',
  FILE_PREVIEW_CLOSE = 'file-preview-close',
  CASE_NEED_REFRESH = 'case-need-refresh',
  FILE_CLEAN_SELECTED_ROWS = 'file-clean-selected-rows'
}
```

## Usage Examples

### Basic Event Listening

```typescript
import { useEventBus } from 'eventbus'
import { EventType } from 'eventbus'

// In a Vue component
const loginBus = useEventBus(EventType.USER_LOGIN__SUCCESS)

// Listen to user login events
loginBus.on((payload) => {
  console.log('User logged in:', payload.user)
  console.log('Login method:', payload.loginMethod)
  console.log('Timestamp:', payload.timestamp)
})
```

### Event Emission

```typescript
import { emitBus, EventType } from 'eventbus'

// Emit a login event
emitBus(EventType.USER_LOGIN__SUCCESS, {
  user: {
    id: '123',
    email: 'user@example.com',
    name: 'John Doe',
    role: 'user'
  },
  timestamp: Date.now(),
  loginMethod: 'email'
})
```

### Multiple Event Listeners

```vue
<template>
  <div>
    <p v-if="isLoggedIn">Welcome, {{ userName }}!</p>
    <p v-if="userExpired">Your session has expired</p>
  </div>
</template>

<script setup>
import { useEventBus, EventType } from 'eventbus'

const isLoggedIn = ref(false)
const userName = ref('')
const userExpired = ref(false)

// Listen to user login
const loginBus = useEventBus(EventType.USER_LOGIN__SUCCESS)
loginBus.on((payload) => {
  isLoggedIn.value = true
  userName.value = payload.user.name || payload.user.email
  userExpired.value = false
})

// Listen to user logout/expire
const expireBus = useEventBus(EventType.USER_LOGIN__EXPIRE)
expireBus.on(() => {
  isLoggedIn.value = false
  userName.value = ''
  userExpired.value = true
})
</script>
```

## Available Event Types

### Authentication Events

- `USER_LOGIN__SUCCESS`: User successfully logged in
- `USER_LOGIN__EXPIRE`: User logged out or session expired

### User Preference Events

- `USER_PREFERENCE_CHANGE__TIME`: User time preference changed

### Table Operation Events

- `TABLE_CONTEXT_MENU_OPEN`: Table context menu opened
- `TABLE_CONTEXT_MENU_CLOSE`: Table context menu closed
- `TABLE_ZOOM_MAX`: Table zoomed to maximum
- `TABLE_ZOOM_REVERT`: Table zoom reverted

### UI Operation Events

- `OPEN_SETTINGS`: Settings dialog opened
- `CLOSE_SETTINGS`: Settings dialog closed

### File Operation Events

- `FILE_NEED_REFRESH`: File list needs refresh
- `FILE_DELETED`: File was deleted
- `FILE_PREVIEW_OPEN`: File preview opened
- `FILE_PREVIEW_CLOSE`: File preview closed
- `CASE_NEED_REFRESH`: Case data needs refresh
- `FILE_CLEAN_SELECTED_ROWS`: Clean selected table rows

### Global Paste Events

- `TAB_COPY_PATH`: Copy path operation
- `TAB_PASTE_PATH`: Paste path operation

## Advanced Usage

### Creating Custom Event Bus Composables

```typescript
// ~/composables/useAuthEvents.ts
import { useEventBus, EventType } from 'eventbus'

export function useAuthEvents() {
  const loginBus = useEventBus(EventType.USER_LOGIN__SUCCESS)
  const expireBus = useEventBus(EventType.USER_LOGIN__EXPIRE)

  const onLogin = (callback: (payload: any) => void) => {
    loginBus.on(callback)
  }

  const onLogout = (callback: (payload: any) => void) => {
    expireBus.on(callback)
  }

  return {
    onLogin,
    onLogout
  }
}
```

### Using in Components

```vue
<script setup>
import { useAuthEvents } from '~/composables/useAuthEvents'
import { emitBus, EventType } from 'eventbus'

const { onLogin, onLogout } = useAuthEvents()

// Handle login events
onLogin((payload) => {
  console.log('User logged in:', payload)
})

// Handle logout events
onLogout((payload) => {
  console.log('User logged out:', payload)
})

// Emit events
const handleLogin = () => {
  emitBus(EventType.USER_LOGIN__SUCCESS, {
    user: { id: '123', name: 'John' },
    timestamp: Date.now()
  })
}
</script>
```

### Global Paste Events

For clipboard operations, use the special GlobalPasteEvent enum:

```typescript
import { useEventBus, GlobalPasteEvent, GlobalPasteItem } from 'eventbus'

const pasteBus = useEventBus<GlobalPasteItem>(GlobalPasteEvent.TAB_PASTE_PATH)

pasteBus.on((item) => {
  console.log('Paste event:', item.type, item.data)
})
```

## Integration with Authentication

The authentication composable (`~/composables/auth.ts`) automatically emits events:

- **Login Success**: Emits `USER_LOGIN__SUCCESS` with user data
- **Logout/Expire**: Emits `USER_LOGIN__EXPIRE` with logout reason

```typescript
// Example auth integration
export async function loginApi(email: string, password: string) {
  try {
    const response = await apiClient.auth.postAuthLogin({ email, password })
    
    if (response.success) {
      // Automatically emits USER_LOGIN__SUCCESS event
      emitBus(EventType.USER_LOGIN__SUCCESS, {
        user: {
          id: response.data?.id || 'unknown',
          email: response.data?.email || email,
          name: response.data?.name,
        },
        timestamp: Date.now(),
        loginMethod: 'email',
        sessionId: response.data?.sessionId
      })
    }
    
    return response
  } catch(error) {
    throw error
  }
}
```

## Best Practices

### 1. Use Predefined Event Types

Always use the predefined `EventType` enum values:

```typescript
// ✅ Good
emitBus(EventType.USER_LOGIN__SUCCESS, data)

// ❌ Bad
emitBus('user-login--success', data)
```

### 2. Consistent Event Payloads

Keep event payloads consistent and include timestamps:

```typescript
// ✅ Good
emitBus(EventType.USER_LOGIN__SUCCESS, {
  user: userObject,
  timestamp: Date.now(),
  loginMethod: 'email'
})
```

### 3. Component Cleanup

VueUse automatically handles cleanup, but you can manually remove listeners:

```typescript
const bus = useEventBus(EventType.USER_LOGIN__SUCCESS)
const off = bus.on(callback)

// Manual cleanup
onBeforeUnmount(() => {
  off()
})
```

### 4. Type Safety

While the eventbus library doesn't enforce payload types, maintain consistency:

```typescript
// Define interfaces for your payloads
interface LoginPayload {
  user: {
    id: string
    email: string
    name?: string
  }
  timestamp: number
  loginMethod: string
  sessionId?: string
}

// Use with emitBus
emitBus(EventType.USER_LOGIN__SUCCESS, loginPayload)
```

## Migration Notes

This system replaces the previous VueUse-based systemEvents approach. Key changes:

- **Event Types**: Now use enum-based `EventType` instead of string constants
- **Emission**: Use `emitBus(EventType.EVENT_NAME, payload)` instead of bus.emit()
- **Listening**: Still use `useEventBus(EventType.EVENT_NAME).on(callback)`
- **Simplified**: Fewer event categories, focused on actual application needs

## Troubleshooting

### Common Issues

1. **Event not received**: Ensure you're using the correct EventType
2. **TypeScript errors**: Make sure eventbus library is properly imported
3. **Memory leaks**: VueUse handles cleanup automatically in components

### Debugging Events

```typescript
// Debug all events of a specific type
const bus = useEventBus(EventType.USER_LOGIN__SUCCESS)
bus.on((payload) => {
  console.log('Event received:', EventType.USER_LOGIN__SUCCESS, payload)
})
```

  const onSessionExpired = (callback: (payload: SystemEvents[typeof AUTH_EVENTS.SESSION_EXPIRED]) => void) => {
    sessionExpiredBus.on(callback)
  }

  const emitLogin = (payload: SystemEvents[typeof USER_EVENTS.LOGIN]) => {
    loginBus.emit(payload)
  }

  const emitLogout = (payload: SystemEvents[typeof USER_EVENTS.LOGOUT]) => {
    logoutBus.emit(payload)
  }

  return {
    onLogin,
    onLogout,
    onSessionExpired,
    emitLogin,
    emitLogout
  }
}
```

### Event Bus with Middleware

```typescript
// ~/composables/useEventMiddleware.ts
import { useEventBus } from '@vueuse/core'

interface EventMiddleware<T = any> {
  before?: (payload: T) => T | Promise<T>
  after?: (payload: T) => void | Promise<void>
  catch?: (error: Error, payload: T) => void | Promise<void>
}

export function useEventBusWithMiddleware<T>(
  event: string,
  middleware: EventMiddleware<T> = {}
) {
  const bus = useEventBus<T>(event)

  const emitWithMiddleware = async (payload: T) => {
    try {
      // Before middleware
      let processedPayload = payload
      if (middleware.before) {
        processedPayload = await middleware.before(payload)
      }

      // Emit the event
      bus.emit(processedPayload)

      // After middleware
      if (middleware.after) {
        await middleware.after(processedPayload)
      }
    } catch (error) {
      // Error handling
      if (middleware.catch) {
        await middleware.catch(error as Error, payload)
      } else {
        throw error
      }
    }
  }

  return {
    ...bus,
    emit: emitWithMiddleware
  }
}
```

## Integration with Existing Systems

### Auth System Integration

The auth composable (`~/composables/auth.ts`) automatically emits events:

```typescript
// Login events are emitted automatically
await loginApi('user@example.com', 'password')
// This will emit USER_EVENTS.LOGIN and AUTH_EVENTS.SESSION_STARTED

// Logout events are emitted automatically  
await logout('manual')
// This will emit USER_EVENTS.LOGOUT
```

### Server Health Integration

```typescript
// ~/composables/serverHealth.ts can emit system events
import { useEventBus } from '@vueuse/core'
import { SYSTEM_EVENTS, SystemEvents, createEventTimestamp } from '~/utils/systemEvents'

const serverDownBus = useEventBus<SystemEvents[typeof SYSTEM_EVENTS.SERVER_DOWN]>(SYSTEM_EVENTS.SERVER_DOWN)
const serverRecoveredBus = useEventBus<SystemEvents[typeof SYSTEM_EVENTS.SERVER_RECOVERED]>(SYSTEM_EVENTS.SERVER_RECOVERED)

// Emit when server goes down
serverDownBus.emit({
  timestamp: createEventTimestamp(),
  reason: 'Health check failed',
  affectedServices: ['api', 'auth']
})

// Emit when server recovers
serverRecoveredBus.emit({
  timestamp: createEventTimestamp(),
  downtime: 120000, // 2 minutes
  recoveryDuration: 5000 // 5 seconds
})
```

## Best Practices

### 1. Type Safety

Always use the predefined event types:

```typescript
// ✅ Good - Type safe
const bus = useEventBus<SystemEvents[typeof USER_EVENTS.LOGIN]>(USER_EVENTS.LOGIN)

// ❌ Bad - No type safety
const bus = useEventBus('user:login')
```

### 2. Event Naming

Use the predefined constants instead of string literals:

```typescript
// ✅ Good - Using constants
const bus = useEventBus(USER_EVENTS.LOGIN)

// ❌ Bad - Magic strings
const bus = useEventBus('user:login')
```

### 3. Payload Structure

Always include a timestamp and follow the defined payload structure:

```typescript
// ✅ Good - Complete payload
bus.emit({
  user: { id: '123', email: 'user@example.com' },
  timestamp: createEventTimestamp(),
  loginMethod: 'email'
})

// ❌ Bad - Incomplete payload
bus.emit({ user: { id: '123' } })
```

### 4. Error Handling

Always handle potential errors when emitting events:

```typescript
try {
  bus.emit(payload)
} catch (error) {
  console.error('Failed to emit event:', error)
}
```

### 5. Cleanup

VueUse automatically handles cleanup, but be mindful of manual listeners:

```typescript
// Automatic cleanup (recommended)
const bus = useEventBus(USER_EVENTS.LOGIN)
bus.on(handler) // Automatically cleaned up on unmount

// Manual cleanup (if needed)
const unsubscribe = bus.on(handler)
onUnmounted(() => {
  unsubscribe()
})
```

## Performance Considerations

### 1. Event Frequency

Be mindful of high-frequency events:

```typescript
// ✅ Good - Throttled events
const throttledEmit = throttle((data) => bus.emit(data), 100)

// ❌ Bad - Too frequent
mousemove.addEventListener(() => bus.emit(data)) // Don't do this
```

### 2. Large Payloads

Avoid sending large objects through events:

```typescript
// ✅ Good - Send references
bus.emit({ userId: '123', action: 'profile_updated' })

// ❌ Bad - Large payload
bus.emit({ user: largeUserObject, action: 'profile_updated' })
```

### 3. Memory Management

VueUse handles most cleanup, but be aware of potential memory leaks:

```typescript
// ✅ Good - Component-scoped
export default defineComponent({
  setup() {
    const bus = useEventBus(USER_EVENTS.LOGIN)
    // Automatically cleaned up when component unmounts
  }
})

// ⚠️ Caution - Global scope
const globalBus = useEventBus(USER_EVENTS.LOGIN) // Outside component
// This won't be automatically cleaned up
```

## Debugging

### 1. Event Logging

Enable event logging in development:

```typescript
// Add to nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      eventBusDebug: process.env.NODE_ENV === 'development'
    }
  }
})
```

### 2. Vue DevTools

VueUse events are visible in Vue DevTools for debugging.

### 3. Custom Logging

```typescript
const bus = useEventBus(USER_EVENTS.LOGIN)

// Log all events in development
if (process.env.NODE_ENV === 'development') {
  bus.on((payload) => {
    console.log(`[EventBus] ${USER_EVENTS.LOGIN}:`, payload)
  })
}
```

## Migration Guide

### From Custom Event Systems

If migrating from a custom event system:

1. **Replace custom emitters** with VueUse event buses
2. **Update event names** to use the predefined constants
3. **Add TypeScript types** for better type safety
4. **Update listeners** to use the new API

### Example Migration

```typescript
// Before (custom system)
EventBus.$emit('user-login', { userId: '123' })
EventBus.$on('user-login', (data) => { /* handle */ })

// After (VueUse system)
const bus = useEventBus<SystemEvents[typeof USER_EVENTS.LOGIN]>(USER_EVENTS.LOGIN)
bus.emit({
  user: { id: '123', email: 'user@example.com' },
  timestamp: createEventTimestamp(),
  loginMethod: 'email'
})
bus.on((payload) => { /* handle with full type safety */ })
```

## Troubleshooting

### Common Issues

1. **TypeScript Errors**: Ensure you're using the correct event types from `SystemEvents`
2. **Events Not Firing**: Check that you're using the correct event key constants
3. **Memory Leaks**: Make sure you're not creating event buses outside of Vue components without proper cleanup
4. **Type Mismatches**: Verify that your payload matches the expected interface

### Getting Help

- Check the TypeScript definitions in `~/utils/systemEvents.ts`
- Use Vue DevTools to inspect event flow
- Enable development logging for debugging
- Refer to VueUse documentation for advanced usage

---

*This event bus system provides a robust, type-safe foundation for application-wide event handling in the DocPal Node Client.*