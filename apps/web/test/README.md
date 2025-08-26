# Testing Guide

This document explains how to run and write unit tests for the web application.

## Setup

The testing environment is configured with:
- **Vitest** - Fast unit testing framework
- **Vue Test Utils** - Official testing utilities for Vue components
- **jsdom** - DOM environment for testing
- **@nuxt/test-utils** - Nuxt-specific testing utilities

## Running Tests

### Run all tests
```bash
pnpm test
```

### Run tests in watch mode
```bash
pnpm test:watch
```

### Run tests with UI
```bash
pnpm test:ui
```

### Run tests with coverage
```bash
pnpm test:coverage
```

### Run specific test file
```bash
pnpm test test/pages/login.test.ts
```

## Test Structure

Tests are located in the `test/` directory and follow this structure:
```
test/
├── setup.ts              # Global test setup and mocks
├── pages/
│   └── login.test.ts     # Login component tests
└── components/
    └── [component-tests] # Component-specific tests
```

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '../app/components/MyComponent.vue'

describe('MyComponent', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(MyComponent)
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('renders correctly', () => {
    expect(wrapper.find('.my-component').exists()).toBe(true)
  })
})
```

## Test Categories

### 1. Component Rendering Tests
Test that components render correctly with expected elements and structure.

```typescript
it('renders login form correctly', () => {
  expect(wrapper.find('.container').exists()).toBe(true)
  expect(wrapper.find('.login-form').exists()).toBe(true)
})
```

### 2. User Interaction Tests
Test user interactions like form input and button clicks.

```typescript
it('updates email when user types', async () => {
  const emailInput = wrapper.find('[data-testid="email-input"]')
  await emailInput.setValue('test@example.com')
  expect(wrapper.vm.form.email).toBe('test@example.com')
})
```

### 3. Functionality Tests
Test component logic and business functionality.

```typescript
it('handles successful login', async () => {
  wrapper.vm.form.email = 'test@example.com'
  wrapper.vm.form.password = 'password123'
  
  const result = await wrapper.vm.handleLogin()
  expect(result.success).toBe(true)
})
```

### 4. Validation Tests
Test form validation rules and error handling.

```typescript
it('has email validation rule', () => {
  const emailRule = wrapper.vm.rules.email[0]
  expect(emailRule.required).toBe(true)
  expect(emailRule.message).toBe('Please input email')
})
```

## Best Practices

1. **Use descriptive test names** - Test names should clearly describe what is being tested
2. **Test user behavior, not implementation details** - Focus on what the user sees and does
3. **Use data-testid attributes** - For reliable element selection in tests
4. **Clean up after tests** - Always unmount components in `afterEach`
5. **Mock external dependencies** - Mock API calls, external libraries, and complex dependencies
6. **Test error scenarios** - Include tests for error conditions and edge cases

## Mocking

The `test/setup.ts` file contains global mocks for:
- Nuxt composables and functions
- API client
- Event bus
- Element Plus components

### Adding New Mocks

To add new mocks, update the `test/setup.ts` file:

```typescript
vi.mock('my-library', () => ({
  myFunction: vi.fn(),
  MyComponent: { name: 'MyComponent' }
}))
```

## Example: Login Component Tests

The login component tests cover:
- ✅ Component rendering
- ✅ Form data management  
- ✅ User interactions
- ✅ Login functionality
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states

See `test/pages/login.test.ts` for a complete example.

## Running Tests in CI/CD

Add these scripts to your CI/CD pipeline:

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Generate coverage report
pnpm test:coverage
```

## Troubleshooting

### Common Issues

1. **Module not found errors** - Check that mocks are properly configured in `test/setup.ts`
2. **Component mounting errors** - Ensure all required props and dependencies are provided
3. **Async test failures** - Use `await` and `nextTick()` for async operations

### Debugging Tests

Use the UI mode for debugging:
```bash
pnpm test:ui
```

This opens a web interface where you can:
- See test results in real-time
- Debug failing tests
- View coverage reports
- Inspect component state