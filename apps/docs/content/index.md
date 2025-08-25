---
title: "DocPal Node Client Documentation"
description: "Comprehensive documentation for the DocPal Node Client application"
---

# DocPal Node Client Documentation

Welcome to the DocPal Node Client documentation. This guide will help you understand and work with the application.

## Quick Start

- [Getting Started](/6.0.0/getting-started) - Set up and run the application
- [Authentication](/6.0.0/authentication) - Learn about the authentication system
- [Event Bus System](/6.0.0/event-bus) - Global event messaging and communication
- [Server Health Check](/6.0.0/server-health) - Server monitoring and downtime handling
- [API Reference](/6.0.0/api) - Explore the available API endpoints
- [Examples](/6.0.0/examples) - See practical examples and use cases

## Application Overview

DocPal Node Client is a modern web application built with:

- **Nuxt 4** - Vue.js framework
- **TypeScript** - Type-safe development
- **Element Plus** - UI component library
- **SCSS** - Styling
- **Authentication** - Global middleware-based auth system

## Key Features

- 🔐 **Authentication System** - Global middleware with route protection
- 📡 **Event Bus System** - Global messaging with VueUse event bus for system events
- 🔄 **Server Health Monitoring** - Automatic downtime detection and graceful error handling
- 🌐 **Internationalization** - Multi-language support (en-US, zh-CN, zh-HK)
- 📱 **Responsive Design** - Mobile-first approach
- 🎨 **Modern UI** - Element Plus components
- ⚡ **Performance** - Optimized for speed and efficiency

## Project Structure

```
apps/
├── web/          # Main web application
│   ├── app/
│   │   ├── middleware/    # Authentication middleware
│   │   └── composables/   # Auth composables
│   └── ...
└── docs/         # This documentation site
```

## Getting Help

If you need assistance:

1. Check the [Getting Started](/6.0.0/getting-started) guide
2. Review the [Authentication](/6.0.0/authentication) documentation
3. Explore [Examples](/6.0.0/examples) for common use cases
4. Contact the development team

---

*Last updated: {{ new Date().toLocaleDateString() }}*
