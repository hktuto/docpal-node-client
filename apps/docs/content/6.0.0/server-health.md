---
title: "Server Health Check"
description: "Server health monitoring and downtime handling for version 6.0.0"
---

# Server Health Check System (v6.0.0)

The DocPal Node Client v6.0.0 includes a comprehensive server health monitoring system that provides graceful error handling during server downtime.

## Quick Start

The server health check system works automatically out of the box. No configuration required!

### What it does:

1. **Monitors server health** every 30 seconds
2. **Redirects to server-down page** when server is unavailable  
3. **Auto-recovers** when server comes back online
4. **Provides user-friendly error handling** instead of broken pages

## Implementation

### Files Added

- `~/composables/serverHealth.ts` - Health check logic
- `~/pages/server-down.vue` - User-friendly error page
- `~/plugins/serverHealth.client.ts` - Auto-start monitoring
- `~/middleware/auth.global.ts` - Enhanced with health checks
- Updated i18n translations in `en-US.json`, `zh-CN.json`, `zh-HK.json`

### Health Check Flow

1. App starts → Plugin starts health monitoring
2. User navigates → Middleware checks server health  
3. Server down → Redirect to `/server-down`
4. Server recovers → Auto-redirect back to app

## Configuration

The system uses these default settings:

```typescript
const HEALTH_CHECK_INTERVAL = 30000 // 30 seconds
const HEALTH_CHECK_TIMEOUT = 5000   // 5 seconds  
const MAX_RETRY_ATTEMPTS = 3        // Max retries
```

## API Endpoint

The system calls `GET /health` endpoint and expects a response like:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345
}
```

## Composable Usage

### Check Current Health Status

```typescript
const serverHealthy = useServerHealthy()
console.log(serverHealthy.value) // true | false
```

### Force Health Check

```typescript
const isHealthy = await refreshServerHealth()
```

### Start/Stop Monitoring

```typescript
startHealthCheck()  // Start monitoring
stopHealthCheck()   // Stop monitoring
```

## Server Down Page Features

- 🎨 **Professional Design** - Clean, branded error page
- 🔄 **Manual Retry** - Users can manually check server status
- ⚡ **Auto-Recovery** - Automatically redirects when server is back
- 📊 **Progress Indicators** - Visual feedback during retry attempts
- 🌐 **Multilingual** - Available in English, Chinese (Simplified/Traditional)
- 📱 **Responsive** - Works on all device sizes

## Middleware Integration

The auth middleware now includes health checking:

```typescript
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip health check for server-down page  
  if (to.path === '/server-down') return
  
  // Check server health first
  if (!serverHealthy.value) {
    return navigateTo('/server-down')
  }
  
  // Continue with authentication...
})
```

## Error Handling

### Automatic Retry Logic

The system uses exponential backoff for retries:

- Attempt 1: Immediate
- Attempt 2: 1 second delay
- Attempt 3: 2 second delay
- etc.

### Fallback Behavior

When health check fails:

1. Set `serverHealthy` to `false`
2. Redirect user to `/server-down` page
3. Continue monitoring in background
4. Auto-redirect when server recovers

## Troubleshooting

### Common Issues

**Health check not working?**
- Ensure `/health` endpoint exists on your server
- Check network connectivity
- Verify server returns `{"status": "ok"}` response

**Infinite redirects?**
- The system prevents this automatically
- Server-down page skips health checks

**Translations missing?**
- Check i18n files contain `serverDown` translations
- Verify locale files are properly imported

### Debug Mode

Enable debug logging in development:

```typescript
// The system automatically logs in development mode
console.log('Health check result:', isHealthy)
```

## Best Practices

### Server Implementation

Your backend should implement a lightweight health endpoint:

```typescript
// Express example
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})
```

### Performance

- Health checks run every 30 seconds (configurable)
- Short timeout prevents hanging requests (5 seconds)
- Minimal server load from health endpoint

### Security

- Health endpoint should not expose sensitive information
- Consider rate limiting the health endpoint
- Use HTTPS in production

## Migration from v5.x

If upgrading from v5.x, the health check system is automatically included. No migration steps required!

### What's New in v6.0.0

- ✅ Automatic server health monitoring
- ✅ Graceful error handling during downtime
- ✅ User-friendly server-down page
- ✅ Auto-recovery when server returns
- ✅ Multilingual support
- ✅ Zero-configuration setup

## Related Documentation

- [Getting Started](/6.0.0/getting-started) - Basic app setup
- [Authentication](/6.0.0/authentication) - Auth system overview
- [Full Server Health Guide](/server-health) - Comprehensive documentation

---

*Server Health Check system introduced in DocPal Node Client v6.0.0*