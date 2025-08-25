---
title: "Event Bus System - v6.0.0"
description: "Global event bus using eventbus library for system-wide communication"
---

# Event Bus System (v6.0.0)

The DocPal Node Client v6.0.0 uses a custom eventbus library for type-safe application-wide event handling.

## Quick Start

The eventbus library provides predefined event types and helper functions for consistent event handling.

### What's included:

1. **EventType enum** with predefined event types
2. **emitBus function** for easy event emission
3. **VueUse integration** - built on top of VueUse's `useEventBus`
4. **Authentication integration** - login/logout events automatically emitted

## Basic Usage

### Listen to Events

```typescript
import { useEventBus, EventType } from 'eventbus'

// Event listening
const loginBus = useEventBus(EventType.USER_LOGIN__SUCCESS)

loginBus.on((payload) => {
  console.log('User logged in:', payload.user.email)
  console.log('Login method:', payload.loginMethod)
})
```

### Emit Events

```typescript
import { emitBus, EventType } from 'eventbus'

// Emit an event
emitBus(EventType.OPEN_SETTINGS, {
  timestamp: Date.now(),
  source: 'user_action'
})
```

## Event Categories

### Authentication Events
- `USER_LOGIN__SUCCESS` - User successfully logged in
- `USER_LOGIN__EXPIRE` - User logged out or session expired

### User Preference Events
- `USER_PREFERENCE_CHANGE__TIME` - User time preference changed

### UI Operation Events
- `OPEN_SETTINGS` - Settings dialog opened
- `CLOSE_SETTINGS` - Settings dialog closed
- `TABLE_CONTEXT_MENU_OPEN` - Table context menu opened
- `TABLE_CONTEXT_MENU_CLOSE` - Table context menu closed
- `TABLE_ZOOM_MAX` - Table zoomed to maximum
- `TABLE_ZOOM_REVERT` - Table zoom reverted

### File Operation Events
- `FILE_NEED_REFRESH` - File list needs refresh
- `FILE_DELETED` - File was deleted
- `FILE_PREVIEW_OPEN` - File preview opened
- `FILE_PREVIEW_CLOSE` - File preview closed
- `CASE_NEED_REFRESH` - Case data needs refresh
- `FILE_CLEAN_SELECTED_ROWS` - Clean selected table rows

## Auto-Integration with Auth

The auth system automatically emits events using the eventbus library:

```typescript
// Login automatically emits events
await loginApi('user@example.com', 'password')
// Emits: EventType.USER_LOGIN__SUCCESS

// Logout automatically emits events
await logout('manual')
// Emits: EventType.USER_LOGIN__EXPIRE
```

## Type Safety

All events are fully typed using TypeScript:

```typescript
// ✅ Type-safe - TypeScript will validate the payload
const bus = useEventBus<SystemEvents[typeof USER_EVENTS.LOGIN]>(USER_EVENTS.LOGIN)
bus.emit({
  user: { id: '123', email: 'user@example.com' },
  timestamp: createEventTimestamp(),
  loginMethod: 'email' // TypeScript ensures this is valid
})

// ❌ Type error - Invalid loginMethod
bus.emit({
  user: { id: '123', email: 'user@example.com' },
  timestamp: createEventTimestamp(),
  loginMethod: 'invalid' // TypeScript error!
})
```

## Component Example

``vue
<template>
  <div>
    <p v-if="isLoggedIn">Welcome, {{ userName }}!</p>
    <button @click="openSettings">Open Settings</button>
  </div>
</template>

<script setup>
import { useEventBus, emitBus, EventType } from 'eventbus'

// State
const isLoggedIn = ref(false)
const userName = ref('')

// Event buses
const loginBus = useEventBus(EventType.USER_LOGIN__SUCCESS)
const logoutBus = useEventBus(EventType.USER_LOGIN__EXPIRE)

// Listen to login/logout
loginBus.on((payload) => {
  isLoggedIn.value = true
  userName.value = payload.user.name || payload.user.email
})

logoutBus.on(() => {
  isLoggedIn.value = false
  userName.value = ''
})

// Emit settings event
const openSettings = () => {
  emitBus(EventType.OPEN_SETTINGS, {
    timestamp: Date.now()
  })
}

</script>
```

## EventBus Benefits

Built on VueUse's `useEventBus`:
- ✅ **Automatic cleanup** on component unmount
- ✅ **Vue reactivity** integration
- ✅ **Memory efficient** 
- ✅ **Predefined event types** for consistency
- ✅ **Simple API** with emitBus helper

## Migration Notes

Migrating from systemEvents to eventbus library:

- Replace `USER_EVENTS.LOGIN` with `EventType.USER_LOGIN__SUCCESS`
- Replace `bus.emit(payload)` with `emitBus(EventType.EVENT_NAME, payload)`
- Update imports from `~/utils/systemEvents` to `eventbus`

For complete documentation, see the [full Event Bus guide](/event-bus).

## File Structure

```
apps/web/
├── app/
│   ├── utils/
│   │   └── systemEvents.ts     # Event definitions
│   ├── composables/
│   │   └── auth.ts             # Auto-emits events
│   └── components/
│       └── examples/
│           └── EventBusExample.vue  # Demo component
```

## Configuration

No configuration needed! The system works out of the box.

### Optional: Enable Debug Logging

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      eventBusDebug: process.env.NODE_ENV === 'development'
    }
  }
})
```

## Best Practices

### 1. Always Use Constants
```typescript
// ✅ Good
const bus = useEventBus(USER_EVENTS.LOGIN)

// ❌ Bad
const bus = useEventBus('user:login')
```

### 2. Include Timestamps
```typescript
// ✅ Good
bus.emit({
  user: userData,
  timestamp: createEventTimestamp(), // Always include
  loginMethod: 'email'
})
```

### 3. Handle Errors
```typescript
try {
  bus.emit(payload)
} catch (error) {
  console.error('Event emission failed:', error)
}
```

## Migration from v5.x

The event bus system is new in v6.0.0. No migration needed!

### What's New

- ✅ Type-safe event handling with VueUse
- ✅ Comprehensive event categories
- ✅ Automatic auth system integration
- ✅ Zero-configuration setup
- ✅ Full TypeScript support

## Common Patterns

### Multiple Event Listener

```typescript
const useUserStatus = () => {
  const isLoggedIn = ref(false)
  
  const loginBus = useEventBus(USER_EVENTS.LOGIN)
  const logoutBus = useEventBus(USER_EVENTS.LOGOUT)
  
  loginBus.on(() => isLoggedIn.value = true)
  logoutBus.on(() => isLoggedIn.value = false)
  
  return { isLoggedIn }
}
```

### Event Aggregation

```typescript
const useNotifications = () => {
  const notifications = ref([])
  
  const successBus = useEventBus(APP_EVENTS.SUCCESS_MESSAGE)
  const errorBus = useEventBus(APP_EVENTS.ERROR_OCCURRED)
  const warningBus = useEventBus(APP_EVENTS.WARNING_MESSAGE)
  
  successBus.on((payload) => addNotification('success', payload.message))
  errorBus.on((payload) => addNotification('error', payload.error.message))
  warningBus.on((payload) => addNotification('warning', payload.message))
  
  return { notifications }
}
```

## Troubleshooting

### Events Not Firing
- Check event key constants are correct
- Ensure proper import paths
- Verify TypeScript payload structure

### Type Errors
- Use the correct `SystemEvents` type
- Import event constants from `~/utils/systemEvents`
- Check payload structure matches interface

### Memory Issues
- VueUse handles cleanup automatically in components
- Be careful with global event buses outside components

## Related Documentation

- [Event Bus System (Full Guide)](/event-bus) - Complete documentation
- [Server Health Check](/6.0.0/server-health) - System health monitoring
- [Authentication](/6.0.0/authentication) - Auth system overview
- [Getting Started](/6.0.0/getting-started) - Project setup

---

*Global Event Bus system introduced in DocPal Node Client v6.0.0*