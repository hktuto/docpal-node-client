import { vi } from 'vitest'

// Mock Nuxt's auto-imports and composables
global.definePageMeta = vi.fn()
global.navigateTo = vi.fn()
global.ref = vi.fn()
global.useRouter = vi.fn(() => ({
  push: vi.fn()
}))
global.useState = vi.fn()

// Mock API client
vi.mock('api', () => ({
  apiClient: {
    auth: {
      postAuthLogin: vi.fn(),
      getAuthSession: vi.fn(),
      postAuthLogout: vi.fn()
    },
    health: {
      getHealth: vi.fn()
    }
  }
}))

// Mock eventbus
vi.mock('eventbus', () => ({
  EventType: {
    USER_LOGIN__SUCCESS: 'USER_LOGIN__SUCCESS',
    USER_LOGIN__EXPIRE: 'USER_LOGIN__EXPIRE'
  },
  emitBus: vi.fn()
}))

// Mock Element Plus components with default export
vi.mock('element-plus', () => ({
  default: {},
  ElCard: { name: 'ElCard' },
  ElForm: { name: 'ElForm' },
  ElFormItem: { name: 'ElFormItem' },
  ElInput: { name: 'ElInput' },
  ElButton: { name: 'ElButton' }
}))

// Mock server health with all required exports
vi.mock('../app/composables/serverHealth.ts', () => ({
  useServerHealthy: vi.fn(() => ({ value: true })),
  useServerHealthInit: vi.fn(() => ({ value: false })),
  useLastHealthCheck: vi.fn(() => ({ value: 0 })),
  checkServerHealth: vi.fn(),
  checkServerHealthWithRetry: vi.fn(),
  startHealthCheck: vi.fn(),
  stopHealthCheck: vi.fn(),
  refreshServerHealth: vi.fn(),
  getTimeSinceLastCheck: vi.fn(),
  isHealthCheckStale: vi.fn()
}))