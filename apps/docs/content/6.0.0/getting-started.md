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
│   │   ├── app/
│   │   │   ├── middleware/     # Authentication middleware
│   │   │   ├── composables/    # Auth composables
│   │   │   ├── pages/          # Vue pages
│   │   │   └── components/     # Vue components
│   │   ├── assets/             # Static assets
│   │   ├── public/             # Public files
│   │   └── nuxt.config.ts      # Nuxt configuration
│   └── docs/                   # Documentation site
│       ├── content/            # Markdown content
│       │   └── 6.0.0/         # Versioned documentation
│       ├── pages/              # Vue pages
│       └── nuxt.config.ts      # Nuxt configuration
├── libraries/
│   └── api/                    # API client library
├── packages/                   # Shared packages
├── package.json                # Workspace configuration
└── pnpm-workspace.yaml         # pnpm workspace config
```

## Authentication Setup

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
