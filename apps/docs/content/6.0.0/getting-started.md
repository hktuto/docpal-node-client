---
title: "Getting Started"
description: "Set up and run the DocPal Node Client application"
version: "6.0.0"
---

# Getting Started

This guide will help you set up and run the DocPal Node Client application.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **pnpm** (recommended package manager)
- **Git**

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd docpal-node-client
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

### 3. Environment Setup

Create environment files for each application:

```bash
# Copy environment templates
cp apps/web/.env.example apps/web/.env
cp apps/docs/.env.example apps/docs/.env
```

### 4. Configure Environment Variables

Edit the environment files with your configuration:

```bash
# apps/web/.env
API_URL=https://api.example.com
AUTH_SECRET=your-secret-key
DATABASE_URL=your-database-url
```

## Running the Applications

### Development Mode

#### Web Application

```bash
# Start the web app
pnpm -F web dev

# Or use the workspace script
pnpm dev
```

The web application will be available at `http://localhost:3000`

#### Documentation Site

```bash
# Start the docs site
pnpm -F docs dev
```

The documentation site will be available at `http://localhost:3001`

### Production Build

#### Web Application

```bash
# Build for production
pnpm -F web build

# Preview production build
pnpm -F web preview
```

#### Documentation Site

```bash
# Generate static site
pnpm -F docs generate

# Preview static site
pnpm -F docs preview
```

## Project Structure

```
docpal-node-client/
├── apps/
│   ├── web/                    # Main web application
│   │   ├── app/                # Core application files
│   │   │   ├── middleware/     # Global middleware (auth.global.ts)
│   │   │   ├── composables/    # Vue composables (auth, serverHealth, etc.)
│   │   │   ├── components/     # Shared Vue components
│   │   │   │   ├── app/        # App-specific components
│   │   │   │   ├── svg/        # SVG icon components
│   │   │   │   └── LoadingBg/  # Loading background components
│   │   │   ├── pages/          # Vue pages (index, login, server-down)
│   │   │   ├── plugins/        # Nuxt plugins (element-plus, i18n, etc.)
│   │   │   ├── utils/          # Utility functions and types
│   │   │   ├── assets/         # Stylesheets and assets
│   │   │   │   └── styles/     # SCSS files
│   │   │   ├── app.vue         # Root Vue component
│   │   │   └── app.config.ts   # App configuration
│   │   ├── layers/             # Nuxt layers for modular features
│   │   │   ├── auth/           # Authentication layer
│   │   │   ├── browse/         # Browse functionality layer
│   │   │   ├── companyProfile/ # Company profile layer
│   │   │   ├── companyUser/    # Company user management layer
│   │   │   └── tabs/           # Tab system layer
│   │   ├── i18n/               # Internationalization
│   │   │   └── locales/        # Translation files (en-US, zh-CN, zh-HK)
│   │   ├── public/             # Static public files
│   │   │   └── icons/          # Icon assets organized by category
│   │   ├── nuxt.config.ts      # Nuxt configuration
│   │   └── package.json        # Web app dependencies
│   └── docs/                   # Documentation site
│       ├── content/            # Markdown content
│       │   └── 6.0.0/         # Versioned documentation
│       ├── app/                # Doc site Vue files
│       └── nuxt.config.ts      # Nuxt configuration
├── libraries/
│   ├── api/                    # API client generation library
│   └── eventbus/               # Global event bus library
├── package.json                # Workspace configuration
└── pnpm-workspace.yaml         # pnpm workspace config
```

## Development Guide

### Architecture Overview

DocPal Node Client uses a modern, layered architecture built on Nuxt 4 with TypeScript. The application is structured as follows:

#### Core Application (`apps/web/app/`)
The main application logic resides in the `app/` directory with clear separation of concerns:

- **Middleware**: Global authentication and route protection
- **Composables**: Reusable Vue composition functions for state management
- **Components**: Shared Vue components organized by functionality
- **Pages**: Application routes and views
- **Plugins**: Nuxt plugins for third-party integrations
- **Utils**: Utility functions and TypeScript types

#### Layers Architecture (`apps/web/layers/`)
The application uses Nuxt layers for modular feature development:

- **auth**: Authentication-related components and functionality
- **browse**: File/content browsing capabilities
- **companyProfile**: Company profile management
- **companyUser**: User management for companies
- **tabs**: Tab system for navigation and workspace management

Each layer is self-contained with its own:
- Components
- Pages
- Composables
- Configuration (`nuxt.config.ts`)
- TypeScript configuration (`tsconfig.json`)

### Development Workflow

#### 1. Setting Up Your Development Environment

```bash
# Clone and setup
git clone <repo-url>
cd docpal-node-client
pnpm install

# Start development servers
pnpm dev          # Web app on :3000
pnpm docs:dev     # Docs on :3001
```

#### 2. Working with Layers

When developing new features, consider using the layer architecture:

**Creating a New Layer:**
```bash
# Create layer structure
mkdir -p apps/web/layers/myFeature/{components,pages,composables}
cd apps/web/layers/myFeature

# Create layer configuration
echo 'export default defineNuxtConfig({})' > nuxt.config.ts
echo '{ "extends": "../../tsconfig.json" }' > tsconfig.json
```

**Layer Best Practices:**
- Keep layers focused on a single feature or domain
- Use clear naming conventions
- Document layer dependencies
- Test layers independently when possible

#### 3. Component Development

**Component Organization:**
```
app/components/
├── app/           # App-specific components
│   ├── menu/      # Menu system components
│   ├── contextmenu/ # Context menu components
│   └── tab/       # Tab-related components
├── svg/           # SVG icon components
└── LoadingBg/     # Loading and background components
```

**Component Guidelines:**
- Use Vue 3 Composition API
- Follow TypeScript strict mode
- Use Element Plus components when available
- Implement proper prop validation
- Add JSDoc comments for complex components

#### 4. Styling Guidelines

**SCSS Structure:**
```
app/assets/styles/
├── elements/      # Element Plus customizations
├── flex.scss      # Flexbox utilities
├── main.scss      # Main stylesheet entry
└── var.scss       # CSS variables and mixins
```

**Styling Best Practices:**
- Use SCSS for all styling (no Tailwind CSS)
- Follow BEM methodology for class naming
- Use CSS custom properties for theming
- Leverage Element Plus design tokens
- Keep component styles scoped

#### 5. State Management

**Composables Pattern:**
The application uses Vue composables for state management:

```typescript
// Example composable structure
export const useFeature = () => {
  const state = reactive({
    // state properties
  })
  
  const actions = {
    // action methods
  }
  
  const getters = computed(() => {
    // computed properties
  })
  
  return {
    ...toRefs(state),
    ...actions,
    ...getters
  }
}
```

**Key Composables:**
- `useAuth()`: Authentication state and methods
- `useServerHealth()`: Server connectivity monitoring
- `useGlobalSetting()`: Application-wide settings
- `useTab()`: Tab system management

#### 6. Testing Strategy

**Unit Testing:**
```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

**Testing Guidelines:**
- Write tests for all composables
- Test component behavior, not implementation
- Mock external dependencies
- Use Vue Testing Utils for component testing
- Aim for >80% code coverage

#### 7. Internationalization

**Adding New Translations:**
```typescript
// Add to i18n/locales/{locale}.json
{
  "feature": {
    "title": "Feature Title",
    "description": "Feature description"
  }
}
```

**Using in Components:**
```vue
<template>
  <h1>{{ $t('feature.title') }}</h1>
  <p>{{ $t('feature.description') }}</p>
</template>
```

**Supported Locales:**
- `en-US`: English (United States)
- `zh-CN`: Chinese (Simplified)
- `zh-HK`: Chinese (Traditional)

#### 8. API Integration

**Using the API Library:**
```typescript
// Generate API client
pnpm run getApi

// Use in components
import { useApi } from '~/composables/api'

const { data, pending, error } = await useApi().get('/endpoint')
```

#### 9. Performance Optimization

**Best Practices:**
- Use `defineAsyncComponent` for large components
- Implement proper loading states
- Use `v-memo` for expensive list renders
- Optimize images and assets
- Leverage Nuxt's built-in optimizations

#### 10. Debugging and Development Tools

**Recommended VS Code Extensions:**
- Vue Language Features (Volar)
- TypeScript Importer
- SCSS IntelliSense
- Element Plus Snippets

**Browser DevTools:**
- Vue DevTools for component inspection
- Network tab for API debugging
- Console for error tracking

### Code Standards

#### TypeScript Guidelines
- Use strict mode TypeScript
- Prefer interfaces over types for object shapes
- Use type guards for runtime type checking
- Document complex types with JSDoc
- Avoid `any` type usage

#### Vue Guidelines
- Use `<script setup>` syntax
- Prefer Composition API over Options API
- Use `defineProps` and `defineEmits` with TypeScript
- Implement proper component documentation
- Follow Vue style guide conventions

#### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature
# ... make changes ...
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
# Create pull request
```

**Commit Message Convention:**
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/modifications
- `chore:` Maintenance tasks

### Troubleshooting

#### Common Issues

**Build Errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules .nuxt
pnpm install
pnpm dev
```

**Type Errors:**
```bash
# Regenerate TypeScript definitions
pnpm run postinstall
pnpm run dev
```

**Hot Reload Issues:**
```bash
# Restart development server
pnpm dev
```

#### Getting Help

1. Check the [Authentication](/6.0.0/authentication) guide for auth-related issues
2. Review the [Event Bus](/6.0.0/event-bus) documentation for state management
3. Check layer-specific documentation in each layer's README
4. Contact the development team for complex issues

## Development Best Practices

The application uses a global authentication middleware. To set up authentication:

### 1. Create Login Page

Create a login page at `apps/web/app/pages/login.vue`:

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

const loading = ref(false)

const handleLogin = async () => {
  // Implement your login logic here
}
</script>
```

### 2. Implement Auth Composable

Create the authentication composable at `apps/web/app/composables/auth.ts`:

```typescript
export const useIsAuthenticated = () => {
  // Implement your authentication state logic
  return useState('isAuthenticated', () => false)
}
```

## Development Workflow

### 1. Making Changes

1. Create a feature branch
2. Make your changes
3. Test the application
4. Update documentation if needed
5. Create a pull request

### 2. Code Standards

- Follow the cursor rules in `.cursor/` directory
- Use TypeScript for all new code
- Follow Vue 3 Composition API patterns
- Use Element Plus components in web app
- Use Tailwind CSS in docs app

### 3. Testing

```bash
# Run tests for web app
pnpm -F web test

# Run tests for docs app
pnpm -F docs test
```

## Common Commands

### Workspace Commands

```bash
# Install dependencies
pnpm install

# Start web app development
pnpm dev

# Start docs app development
pnpm -F docs dev

# Build all applications
pnpm build

# Run tests
pnpm test
```

### Individual App Commands

```bash
# Web app
pnpm -F web dev
pnpm -F web build
pnpm -F web preview

# Docs app
pnpm -F docs dev
pnpm -F docs generate
pnpm -F docs preview
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **Dependencies Not Found**
   ```bash
   # Clear cache and reinstall
   pnpm store prune
   pnpm install
   ```

3. **TypeScript Errors**
   ```bash
   # Check TypeScript configuration
   pnpm -F web typecheck
   ```

4. **Authentication Issues**
   - Ensure login page has `public: true` meta
   - Check authentication composable implementation
   - Verify middleware configuration

### Getting Help

If you encounter issues:

1. Check the [Authentication](/6.0.0/authentication) documentation
2. Review the [API Reference](/6.0.0/api) for endpoint information
3. Look at [Examples](/6.0.0/examples) for common patterns
4. Contact the development team

## Next Steps

Now that you have the application running:

1. **Explore the Authentication System** - Read the [Authentication](/6.0.0/authentication) guide
2. **Learn the API** - Check the [API Reference](/6.0.0/api) documentation
3. **See Examples** - Review [Examples](/6.0.0/examples) for common use cases
4. **Start Developing** - Begin building your features

## Version Information

This documentation corresponds to version **6.0.0** of the DocPal Node Client application.
