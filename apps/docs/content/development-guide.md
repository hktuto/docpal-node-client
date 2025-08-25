---
title: "Development Guide"
description: "Comprehensive guide for developing with DocPal Node Client"
---

# Development Guide

This comprehensive guide covers all aspects of developing with the DocPal Node Client application, from architecture understanding to best practices and troubleshooting.

## Quick Start for Developers

```bash
# Clone and setup
git clone <repo-url>
cd docpal-node-client
pnpm install

# Start development
pnpm dev          # Web app on :3000
pnpm docs:dev     # Docs on :3001

# Generate API client
pnpm run getApi
```

## Architecture Deep Dive

### Application Structure

The DocPal Node Client follows a modern, layered architecture designed for scalability and maintainability:

#### Core Application (`apps/web/app/`)

```
app/
├── middleware/     # Global middleware (auth, route protection)
├── composables/    # Reusable Vue composition functions
├── components/     # Shared Vue components
├── pages/         # Application routes and views
├── plugins/       # Nuxt plugins for integrations
├── utils/         # Utility functions and TypeScript types
├── assets/        # Stylesheets and static assets
├── app.vue        # Root Vue component
└── app.config.ts  # Application configuration
```

#### Layers Architecture (`apps/web/layers/`)

The application leverages Nuxt layers for modular feature development:

**🔐 Auth Layer** (`layers/auth/`)
- Authentication components
- User management interfaces
- Auth-specific utilities

**📁 Browse Layer** (`layers/browse/`)
- File browsing functionality
- Content navigation
- Search capabilities

**🏢 Company Layers** (`layers/companyProfile/`, `layers/companyUser/`)
- Company profile management
- User management for organizations
- Role-based access controls

**📑 Tabs Layer** (`layers/tabs/`) - [📖 Full Documentation](/developing/layer/tabs/)
- Tab system for navigation
- Workspace management
- Multi-document interface
- Advanced drag & drop functionality
- Split panel management

Each layer is completely self-contained with:
- Dedicated components
- Layer-specific pages
- Custom composables
- Independent configuration
- Isolated TypeScript settings

### Technology Stack Details

#### Frontend Framework
- **Nuxt 4**: Universal Vue.js framework with SSR/SPA capabilities
- **Vue 3**: Progressive JavaScript framework with Composition API
- **TypeScript**: Strict type checking for enhanced developer experience

#### UI and Styling
- **Element Plus**: Comprehensive Vue 3 component library
- **SCSS**: Advanced CSS preprocessing with variables and mixins
- **CSS Custom Properties**: Dynamic theming and design tokens

#### State Management
- **Vue Composables**: Reactive state management with Composition API
- **Event Bus**: Global event system for cross-component communication
- **Server State**: Built-in server health monitoring and connectivity

#### Development Tools
- **pnpm**: Fast, efficient package manager with workspace support
- **ESLint**: Code linting for consistency and error prevention
- **Prettier**: Code formatting for maintainable code style

## Development Workflow

### 1. Environment Setup

**Prerequisites:**
- Node.js 18+ (LTS recommended)
- pnpm 10.14.0+ (latest stable)
- Git for version control
- VS Code (recommended IDE)

**Recommended VS Code Extensions:**
```json
{
  "recommendations": [
    "Vue.volar",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "streetsidesoftware.code-spell-checker",
    "esbenp.prettier-vscode"
  ]
}
```

### 2. Working with Layers

**Creating a New Layer:**
```bash
# Create layer structure
mkdir -p apps/web/layers/myFeature/{components,pages,composables,utils}
cd apps/web/layers/myFeature

# Initialize layer configuration
cat > nuxt.config.ts << EOF
export default defineNuxtConfig({
  // Layer-specific configuration
})
EOF

# Setup TypeScript
cat > tsconfig.json << EOF
{
  "extends": "../../tsconfig.json"
}
EOF
```

**Layer Development Best Practices:**
- **Single Responsibility**: Each layer should focus on one domain/feature
- **Clear Boundaries**: Minimize dependencies between layers
- **Documentation**: Document layer purpose and public APIs
- **Testing**: Test layers independently when possible
- **Naming**: Use descriptive, consistent naming conventions

### 3. Component Development

#### Component Organization Strategy

```
components/
├── app/              # Application-specific components
│   ├── menu/        # Navigation and menu systems
│   ├── contextmenu/ # Context menu functionality
│   └── tab/         # Tab system components
├── svg/             # SVG icon components and utilities
└── LoadingBg/       # Loading states and backgrounds
```

#### Component Development Guidelines

**TypeScript Component Template:**
```vue
<template>
  <div class="my-component">
    <slot name="header" />
    <main class="my-component__content">
      {{ computedValue }}
    </main>
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  size: 'medium'
})

const emit = defineEmits<Emits>()

const computedValue = computed(() => {
  return props.modelValue.toUpperCase()
})

// Lifecycle and logic here
</script>

<style lang="scss" scoped>
.my-component {
  // Component styles
  &__content {
    // BEM methodology
  }
}
</style>
```

**Component Quality Checklist:**
- ✅ TypeScript props and emits interfaces
- ✅ Proper slot usage for flexibility
- ✅ Scoped SCSS styles following BEM
- ✅ Accessibility attributes (ARIA)
- ✅ JSDoc comments for complex logic
- ✅ Error boundary handling
- ✅ Loading and empty states

### 4. Styling Architecture

#### SCSS Structure and Guidelines

```
assets/styles/
├── elements/         # Element Plus customizations
│   ├── index.scss   # Main elements entry
│   └── setting.scss # Element Plus settings
├── flex.scss        # Flexbox utilities
├── main.scss        # Main stylesheet entry
└── var.scss         # CSS variables and mixins
```

**Styling Best Practices:**
```scss
// 1. Use CSS custom properties for theming
:root {
  --primary-color: #409eff;
  --border-radius: 4px;
  --spacing-unit: 8px;
}

// 2. Follow BEM methodology
.block {
  &__element {
    &--modifier {
      // styles
    }
  }
}

// 3. Use SCSS mixins for reusable patterns
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// 4. Organize styles by component structure
.my-component {
  @include flex-center;
  
  // Base styles
  color: var(--primary-color);
  
  // Element styles
  &__header {
    // header styles
  }
  
  // Modifier styles
  &--compact {
    // compact variant
  }
}
```

### 5. State Management Patterns

#### Composables Architecture

**Standard Composable Pattern:**
```typescript
// composables/useFeature.ts
export const useFeature = () => {
  // Reactive state
  const state = reactive({
    items: [] as Item[],
    loading: false,
    error: null as string | null
  })

  // Computed properties
  const hasItems = computed(() => state.items.length > 0)
  const itemCount = computed(() => state.items.length)

  // Actions
  const fetchItems = async () => {
    state.loading = true
    state.error = null
    
    try {
      const response = await $fetch('/api/items')
      state.items = response.data
    } catch (error) {
      state.error = error.message
    } finally {
      state.loading = false
    }
  }

  const addItem = (item: Item) => {
    state.items.push(item)
  }

  const removeItem = (id: string) => {
    const index = state.items.findIndex(item => item.id === id)
    if (index > -1) {
      state.items.splice(index, 1)
    }
  }

  // Cleanup
  onUnmounted(() => {
    // cleanup logic
  })

  return {
    // State (as refs for reactivity)
    ...toRefs(state),
    
    // Computed
    hasItems,
    itemCount,
    
    // Actions
    fetchItems,
    addItem,
    removeItem
  }
}
```

#### Event Bus Integration

```typescript
// Using the global event bus
import { emitBus, useEventBus } from 'eventbus'
import { EventType } from 'eventbus'

// Emit events
const handleUserLogin = (user: User) => {
  emitBus(EventType.USER_LOGIN__SUCCESS, { user })
}

// Listen to events
const bus = useEventBus()
bus.on(EventType.USER_LOGIN__SUCCESS, (payload) => {
  console.log('User logged in:', payload.user)
})
```

### 6. API Integration

#### API Client Usage

```typescript
// Generate API client from OpenAPI spec
// pnpm run getApi

// Using the generated client
import { useApi } from '~/composables/api'

const api = useApi()

// GET request
const { data, pending, error } = await api.get('/users')

// POST request with TypeScript types
interface CreateUserRequest {
  name: string
  email: string
}

const createUser = async (userData: CreateUserRequest) => {
  try {
    const response = await api.post('/users', userData)
    return response.data
  } catch (error) {
    console.error('Failed to create user:', error)
    throw error
  }
}
```

### 7. Testing Strategy

#### Unit Testing Setup

```bash
# Install testing dependencies
pnpm add -D @vue/test-utils vitest @vitejs/plugin-vue
```

#### Component Testing Example

```typescript
// components/__tests__/MyComponent.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '../MyComponent.vue'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent, {
      props: {
        title: 'Test Title'
      }
    })
    
    expect(wrapper.text()).toContain('Test Title')
  })
  
  it('emits change event on interaction', async () => {
    const wrapper = mount(MyComponent)
    
    await wrapper.find('button').trigger('click')
    
    expect(wrapper.emitted('change')).toBeTruthy()
  })
})
```

#### Composable Testing

```typescript
// composables/__tests__/useFeature.test.ts
import { describe, it, expect } from 'vitest'
import { useFeature } from '../useFeature'

describe('useFeature', () => {
  it('initializes with empty state', () => {
    const { items, loading } = useFeature()
    
    expect(items.value).toEqual([])
    expect(loading.value).toBe(false)
  })
})
```

### 8. Performance Optimization

#### Code Splitting Strategies

```typescript
// Lazy load heavy components
const HeavyComponent = defineAsyncComponent(() => 
  import('~/components/HeavyComponent.vue')
)

// Route-based code splitting (automatic in Nuxt)
// pages/dashboard.vue will be automatically split

// Dynamic imports for utilities
const utils = await import('~/utils/heavyUtils')
```

#### Performance Best Practices

```vue
<template>
  <!-- Use v-memo for expensive renders -->
  <div v-memo="[item.id, item.updatedAt]">
    {{ expensiveCalculation(item) }}
  </div>
  
  <!-- Use v-once for static content -->
  <div v-once>
    {{ staticContent }}
  </div>
  
  <!-- Optimize list rendering -->
  <div 
    v-for="item in items" 
    :key="item.id"
    class="item"
  >
    {{ item.name }}
  </div>
</template>

<script setup lang="ts">
// Use shallowRef for performance when deep reactivity isn't needed
const items = shallowRef([])

// Debounce expensive operations
const debouncedSearch = useDebounceFn((query: string) => {
  performSearch(query)
}, 300)
</script>
```

## Troubleshooting

### Common Development Issues

#### Build and Runtime Errors

**Issue: Module not found errors**
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules .nuxt
pnpm install
pnpm dev
```

**Issue: TypeScript compilation errors**
```bash
# Solution: Regenerate type definitions
pnpm run postinstall
pnpm dev
```

**Issue: Hot reload not working**
```bash
# Solution: Restart dev server
pnpm dev
```

#### Layer-Specific Issues

**Issue: Layer not loading**
- Check `nuxt.config.ts` extends configuration
- Verify layer path is correct
- Ensure layer has proper `nuxt.config.ts`

**Issue: Component not found in layer**
- Check component registration in layer
- Verify export statements
- Check component naming conventions

### Debugging Tools and Techniques

#### Browser DevTools Setup

```javascript
// Enable Vue DevTools in development
if (process.dev) {
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__ = true
}
```

#### Console Debugging

```typescript
// Development-only debugging
if (process.dev) {
  console.log('Debug info:', debugData)
}

// Use browser debugger
debugger // Remove in production
```

## Best Practices Summary

### Code Quality
- Always use TypeScript strict mode
- Implement comprehensive error handling
- Write meaningful commit messages
- Follow Vue 3 style guide conventions
- Use ESLint and Prettier consistently

### Performance
- Implement proper loading states
- Use lazy loading for heavy components
- Optimize bundle size with code splitting
- Monitor Core Web Vitals

### Security
- Validate all user inputs
- Use HTTPS in production
- Implement proper authentication flows
- Follow OWASP security guidelines

### Maintenance
- Keep dependencies updated
- Write comprehensive documentation
- Implement automated testing
- Use semantic versioning

## Getting Help

### Documentation Resources
1. [Getting Started Guide](/getting-started) - Basic setup and installation
2. [Authentication Guide](/authentication) - Auth system implementation
3. [Event Bus Guide](/event-bus) - Global event handling
4. [Server Health Guide](/server-health) - Monitoring and connectivity

### Community and Support
- Review existing issues in the repository
- Check layer-specific README files
- Consult Vue 3 and Nuxt 4 official documentation
- Contact the development team for complex issues

### Contributing
- Follow the established coding standards
- Write tests for new features
- Update documentation for changes
- Submit pull requests with clear descriptions

---

*This development guide is continuously updated. Last revision: {{ new Date().toLocaleDateString() }}*