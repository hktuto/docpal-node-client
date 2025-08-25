---
title: "Tab Layer Usage Examples"
description: "Practical examples and implementation guide for the tabs layer system"
---

# Tab Layer Usage Examples

This guide provides practical examples and implementation patterns for using the tabs layer system in your application.

## Basic Implementation

### Setting Up the Tab System

#### 1. Layer Integration

First, ensure the tabs layer is properly integrated into your Nuxt application:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    './layers/tabs'
  ]
})
```

#### 2. Component Usage

Use the main tab application component in your layout:

```vue
<!-- app.vue or layout -->
<template>
  <div>
    <TabApp 
      @ready="onTabSystemReady"
      @layoutChanged="onLayoutChanged"
      @highlightPanelChanged="onPanelChanged"
    />
  </div>
</template>

<script setup lang="ts">
function onTabSystemReady() {
  console.log('Tab system is ready')
  // Initialize with default layout
  initializeDefaultLayout()
}

function onLayoutChanged(newLayout: TabPanel[]) {
  console.log('Layout changed:', newLayout)
  // Save layout to localStorage or server
  localStorage.setItem('app-tab-layout', JSON.stringify(newLayout))
}

function onPanelChanged(panelId: string) {
  console.log('Active panel changed:', panelId)
  // Track analytics or update app state
}
</script>
```

#### 3. Initial Layout Setup

```typescript
// composables/useAppTabs.ts
export const useAppTabs = () => {
  const { initLayout } = useTabsManager()
  
  function initializeDefaultLayout() {
    const defaultLayout: TabPanel[] = [
      {
        id: 'main-panel',
        parent: 'root',
        showingTabIndex: 0,
        tabs: [
          {
            name: 'dashboard',
            label: 'Dashboard',
            icon: 'lucide:layout-dashboard',
            component: 'DashboardPage',
            initized: true
          },
          {
            name: 'welcome',
            label: 'Welcome',
            icon: 'lucide:home',
            component: 'WelcomePage'
          }
        ]
      }
    ]
    
    initLayout(defaultLayout)
  }
  
  function loadSavedLayout() {
    const saved = localStorage.getItem('app-tab-layout')
    if (saved) {
      try {
        const layout = JSON.parse(saved)
        initLayout(layout)
      } catch (error) {
        console.error('Failed to load saved layout:', error)
        initializeDefaultLayout()
      }
    } else {
      initializeDefaultLayout()
    }
  }
  
  return {
    initializeDefaultLayout,
    loadSavedLayout
  }
}
```

## Creating Custom Tab Components

### Basic Tab Component

```vue
<!-- components/tabs/UserProfileTab.vue -->
<template>
  <div class="user-profile-tab">
    <div class="header">
      <h1>{{ user?.name || 'Loading...' }}</h1>
      <el-button @click="refresh" :loading="loading">
        <Icon name="lucide:refresh-ccw" />
        Refresh
      </el-button>
    </div>
    
    <div class="content" v-if="user">
      <el-form :model="user" label-width="120px">
        <el-form-item label="Name">
          <el-input v-model="user.name" @change="markAsModified" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="user.email" @change="markAsModified" />
        </el-form-item>
        <el-form-item label="Role">
          <el-select v-model="user.role" @change="markAsModified">
            <el-option label="Admin" value="admin" />
            <el-option label="User" value="user" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <div class="actions">
        <el-button type="primary" @click="save" :loading="saving">
          Save Changes
        </el-button>
        <el-button @click="navigateToSettings">
          User Settings
        </el-button>
      </div>
    </div>
    
    <div v-else class="loading">
      <LoadingBgInline />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  tab: TabItem
  userId?: string
}

const props = defineProps<Props>()

// Inject tab router for navigation
const router = inject(MenuRouterKey)
if (!router) {
  throw createError('MenuRouter not available')
}

// State management
const user = ref<User | null>(null)
const loading = ref(false)
const saving = ref(false)
const modified = ref(false)

// Load user data
async function loadUser() {
  if (!props.userId) return
  
  loading.value = true
  try {
    const response = await $fetch(`/api/users/${props.userId}`)
    user.value = response.data
    
    // Update tab title with user name
    router.updateTabName(`${user.value.name} Profile`)
  } catch (error) {
    router.message.error('Failed to load user profile')
    console.error('Failed to load user:', error)
  } finally {
    loading.value = false
  }
}

// Save changes
async function save() {
  if (!user.value || !props.userId) return
  
  saving.value = true
  try {
    await $fetch(`/api/users/${props.userId}`, {
      method: 'PUT',
      body: user.value
    })
    
    modified.value = false
    router.message.success('Profile saved successfully')
  } catch (error) {
    router.message.error('Failed to save profile')
    console.error('Failed to save user:', error)
  } finally {
    saving.value = false
  }
}

// Refresh data
async function refresh() {
  await loadUser()
  router.message.info('Profile refreshed')
}

// Mark as modified
function markAsModified() {
  modified.value = true
}

// Navigate to settings
function navigateToSettings() {
  router.navigateTo({
    name: 'user-settings',
    label: 'User Settings',
    icon: 'lucide:settings',
    component: 'UserSettingsTab',
    props: { userId: props.userId }
  })
}

// Register refresh action for tab system
onMounted(() => {
  router.refeshActions.push(refresh)
  loadUser()
})

// Lifecycle
watch(() => props.userId, loadUser, { immediate: true })

// Prevent navigation if modified
onBeforeUnmount(() => {
  if (modified.value) {
    const confirmed = confirm('You have unsaved changes. Are you sure you want to leave?')
    if (!confirmed) {
      // In a real app, you might want to prevent navigation
      console.log('Navigation prevented due to unsaved changes')
    }
  }
})
</script>

<style lang="scss" scoped>
.user-profile-tab {
  padding: var(--app-space-m);
  height: 100%;
  overflow-y: auto;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--app-space-l);
    
    h1 {
      margin: 0;
      color: var(--app-text-primary);
    }
  }
  
  .content {
    max-width: 600px;
  }
  
  .actions {
    margin-top: var(--app-space-l);
    display: flex;
    gap: var(--app-space-s);
  }
  
  .loading {
    height: 200px;
    position: relative;
  }
}
</style>
```

### Advanced Tab Component with History

```vue
<!-- components/tabs/DocumentViewerTab.vue -->
<template>
  <div class="document-viewer">
    <!-- Document navigation -->
    <div class="document-nav">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item 
          v-for="(item, index) in breadcrumbs" 
          :key="index"
          @click="navigateToBreadcrumb(index)"
        >
          {{ item.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <!-- Document content -->
    <div class="document-content">
      <component 
        :is="currentDocumentComponent" 
        v-bind="currentDocumentProps"
        @navigate="handleNavigate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  tab: TabItem
  documentId: string
  section?: string
  readOnly?: boolean
}

const props = defineProps<Props>()

// Inject router
const router = inject(MenuRouterKey)
if (!router) {
  throw createError('MenuRouter not available')
}

// Navigation state
const breadcrumbs = ref<Array<{ label: string, documentId: string, section?: string }>>([])
const currentDocumentComponent = ref('DocumentRenderer')
const currentDocumentProps = ref({})

// Document loading
async function loadDocument(documentId: string, section?: string) {
  try {
    const response = await $fetch(`/api/documents/${documentId}`)
    const document = response.data
    
    // Update tab title
    router.updateTabName(document.title)
    
    // Update breadcrumbs
    updateBreadcrumbs(document, section)
    
    // Update component props
    currentDocumentProps.value = {
      document,
      section,
      readOnly: props.readOnly
    }
    
    // Add to history if not navigating back
    if (!isNavigatingBack.value) {
      router.addToHistory({
        name: 'document',
        label: document.title,
        component: 'DocumentViewerTab',
        props: { documentId, section, readOnly: props.readOnly }
      })
    }
    
  } catch (error) {
    router.message.error('Failed to load document')
    console.error('Failed to load document:', error)
  }
}

// Navigation handling
const isNavigatingBack = ref(false)

function handleNavigate(documentId: string, section?: string, openInNewTab = false) {
  if (openInNewTab) {
    // Open in new tab using tab manager
    const tabManager = inject(TabManagerKey)
    tabManager?.openInNewTab({
      name: 'document',
      label: 'Document',
      icon: 'lucide:file-text',
      component: 'DocumentViewerTab',
      props: { documentId, section }
    })
  } else {
    // Navigate within current tab
    router.navigateTo({
      name: 'document',
      label: 'Document',
      component: 'DocumentViewerTab',
      props: { documentId, section, readOnly: props.readOnly }
    })
  }
}

function navigateToBreadcrumb(index: number) {
  const item = breadcrumbs.value[index]
  if (item) {
    isNavigatingBack.value = true
    handleNavigate(item.documentId, item.section)
    nextTick(() => {
      isNavigatingBack.value = false
    })
  }
}

function updateBreadcrumbs(document: any, section?: string) {
  breadcrumbs.value = [
    { label: 'Documents', documentId: 'root' },
    { label: document.title, documentId: document.id },
    ...(section ? [{ label: section, documentId: document.id, section }] : [])
  ]
}

// Special navigation method for external access
function navigateTo(documentId: string, section?: string) {
  handleNavigate(documentId, section)
}

// Expose navigation method
defineExpose({
  navigateTo
})

// Initialize
onMounted(() => {
  loadDocument(props.documentId, props.section)
})

// Watch for prop changes
watch(() => [props.documentId, props.section], () => {
  loadDocument(props.documentId, props.section)
})
</script>

<style lang="scss" scoped>
.document-viewer {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .document-nav {
    padding: var(--app-space-s) var(--app-space-m);
    border-bottom: 1px solid var(--app-grey-200);
    
    :deep(.el-breadcrumb__item) {
      cursor: pointer;
      
      &:hover {
        color: var(--app-primary-color);
      }
    }
  }
  
  .document-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--app-space-m);
  }
}
</style>
```

## Tab Management Patterns

### Opening Tabs Programmatically

```typescript
// composables/useTabOperations.ts
export const useTabOperations = () => {
  const tabManager = inject(TabManagerKey)
  
  if (!tabManager) {
    throw createError('TabManager not available')
  }
  
  // Open user profile
  function openUserProfile(userId: string, openInNewTab = false) {
    const tab: TabItem = {
      name: 'user-profile',
      label: 'User Profile',
      icon: 'lucide:user',
      component: 'UserProfileTab',
      props: { userId }
    }
    
    if (openInNewTab) {
      tabManager.openInNewTab(tab)
    } else {
      tabManager.openTab(tab)
    }
  }
  
  // Open document
  function openDocument(documentId: string, section?: string, readOnly = false) {
    const tab: TabItem = {
      name: 'document',
      label: 'Document',
      icon: 'lucide:file-text',
      component: 'DocumentViewerTab',
      props: { documentId, section, readOnly }
    }
    
    tabManager.openTab(tab)
  }
  
  // Open settings with specific section
  function openSettings(section?: string) {
    const tab: TabItem = {
      name: 'settings',
      label: 'Settings',
      icon: 'lucide:settings',
      component: 'SettingsTab',
      props: { section }
    }
    
    tabManager.openTab(tab)
  }
  
  // Open search results
  function openSearchResults(query: string, filters?: any) {
    const tab: TabItem = {
      name: 'search',
      label: `Search: ${query}`,
      icon: 'lucide:search',
      component: 'SearchResultsTab',
      props: { query, filters }
    }
    
    tabManager.openInNewTab(tab) // Always open search in new tab
  }
  
  return {
    openUserProfile,
    openDocument,
    openSettings,
    openSearchResults
  }
}
```

### Menu Integration

```vue
<!-- components/app/AppMenu.vue -->
<template>
  <div class="app-menu">
    <el-menu
      :default-active="activeMenuItem"
      mode="vertical"
      @select="handleMenuSelect"
    >
      <el-menu-item 
        v-for="item in menuItems" 
        :key="item.id"
        :index="item.id"
        @click="openMenuItem(item)"
      >
        <Icon :name="item.icon" />
        <span>{{ $t(item.label) }}</span>
      </el-menu-item>
      
      <el-sub-menu index="admin" v-if="isAdmin">
        <template #title>
          <Icon name="lucide:shield-check" />
          <span>Administration</span>
        </template>
        <el-menu-item 
          v-for="adminItem in adminMenuItems"
          :key="adminItem.id"
          :index="adminItem.id"
          @click="openMenuItem(adminItem)"
        >
          <Icon :name="adminItem.icon" />
          <span>{{ $t(adminItem.label) }}</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
interface MenuItem {
  id: string
  label: string
  icon: string
  component: string
  props?: Record<string, any>
  adminOnly?: boolean
}

// Menu configuration
const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'menu.dashboard',
    icon: 'lucide:layout-dashboard',
    component: 'DashboardPage'
  },
  {
    id: 'documents',
    label: 'menu.documents',
    icon: 'lucide:file-text',
    component: 'DocumentsListPage'
  },
  {
    id: 'users',
    label: 'menu.users',
    icon: 'lucide:users',
    component: 'UsersListPage'
  },
  {
    id: 'settings',
    label: 'menu.settings',
    icon: 'lucide:settings',
    component: 'SettingsPage'
  }
]

const adminMenuItems: MenuItem[] = [
  {
    id: 'admin-users',
    label: 'menu.admin.users',
    icon: 'lucide:user-cog',
    component: 'AdminUsersPage',
    adminOnly: true
  },
  {
    id: 'admin-system',
    label: 'menu.admin.system',
    icon: 'lucide:server',
    component: 'AdminSystemPage',
    adminOnly: true
  }
]

// State
const activeMenuItem = ref('dashboard')
const { user } = useAuth()
const tabManager = inject(TabManagerKey)

// Computed
const isAdmin = computed(() => user.value?.role === 'admin')

// Methods
function openMenuItem(item: MenuItem) {
  if (!tabManager) return
  
  const tab: TabItem = {
    name: item.id,
    label: item.label,
    icon: item.icon,
    component: item.component,
    props: item.props || {}
  }
  
  // Check if Ctrl/Cmd is pressed for new tab
  const shouldOpenInNewTab = event?.ctrlKey || event?.metaKey
  
  if (shouldOpenInNewTab) {
    tabManager.openInNewTab(tab)
  } else {
    tabManager.openTab(tab)
  }
}

function handleMenuSelect(index: string) {
  activeMenuItem.value = index
}

// Watch for route changes to update active menu item
watch(() => router.currentRoute.value.name, (newRoute) => {
  if (typeof newRoute === 'string') {
    activeMenuItem.value = newRoute
  }
})
</script>
```

### Context Menu Integration

```typescript
// composables/useContextMenu.ts
export const useContextMenu = () => {
  const tabManager = inject(TabManagerKey)
  
  function createContextMenu(item: any, event: MouseEvent) {
    const menuItems = [
      {
        label: 'Open',
        icon: 'lucide:eye',
        action: () => openItem(item)
      },
      {
        label: 'Open in New Tab',
        icon: 'lucide:external-link',
        action: () => openItem(item, true)
      },
      {
        label: 'Edit',
        icon: 'lucide:edit',
        action: () => editItem(item)
      },
      {
        label: 'Delete',
        icon: 'lucide:trash',
        action: () => deleteItem(item),
        dangerous: true
      }
    ]
    
    // Show context menu at cursor position
    showContextMenu(menuItems, event.clientX, event.clientY)
  }
  
  function openItem(item: any, openInNewTab = false) {
    const tab: TabItem = {
      name: getItemType(item),
      label: item.name || item.title,
      icon: getItemIcon(item),
      component: getItemComponent(item),
      props: { itemId: item.id }
    }
    
    if (openInNewTab) {
      tabManager?.openInNewTab(tab)
    } else {
      tabManager?.openTab(tab)
    }
  }
  
  function editItem(item: any) {
    const tab: TabItem = {
      name: `${getItemType(item)}-edit`,
      label: `Edit ${item.name || item.title}`,
      icon: 'lucide:edit',
      component: getItemEditComponent(item),
      props: { itemId: item.id, mode: 'edit' }
    }
    
    tabManager?.openTab(tab)
  }
  
  return {
    createContextMenu
  }
}
```

## Advanced Usage Patterns

### Custom Tab Layouts

```typescript
// composables/useCustomLayouts.ts
export const useCustomLayouts = () => {
  const { initLayout } = useTabsManager()
  
  function createSplitLayout(leftTabs: TabItem[], rightTabs: TabItem[]) {
    const layout: TabPanel[] = [
      {
        id: 'left-panel',
        parent: 'root',
        size: 50,
        showingTabIndex: 0,
        tabs: leftTabs
      },
      {
        id: 'right-panel',
        parent: 'root',
        size: 50,
        showingTabIndex: 0,
        tabs: rightTabs
      }
    ]
    
    initLayout(layout)
  }
  
  function createTripleLayout(leftTabs: TabItem[], centerTabs: TabItem[], rightTabs: TabItem[]) {
    const layout: TabPanel[] = [
      {
        id: 'left-panel',
        parent: 'root',
        size: 25,
        showingTabIndex: 0,
        tabs: leftTabs
      },
      {
        id: 'center-panel',
        parent: 'root',
        size: 50,
        showingTabIndex: 0,
        tabs: centerTabs
      },
      {
        id: 'right-panel',
        parent: 'root',
        size: 25,
        showingTabIndex: 0,
        tabs: rightTabs
      }
    ]
    
    initLayout(layout)
  }
  
  function createDashboardLayout() {
    const layout: TabPanel[] = [
      {
        id: 'main-panel',
        parent: 'root',
        showingTabIndex: 0,
        tabs: [
          {
            name: 'dashboard',
            label: 'Dashboard',
            icon: 'lucide:layout-dashboard',
            component: 'DashboardPage',
            initized: true
          }
        ]
      }
    ]
    
    initLayout(layout)
  }
  
  return {
    createSplitLayout,
    createTripleLayout,
    createDashboardLayout
  }
}
```

### Tab State Persistence

```typescript
// composables/useTabPersistence.ts
export const useTabPersistence = () => {
  const { layout } = useTabsManager()
  
  function saveLayout() {
    try {
      const serializedLayout = JSON.stringify(layout.value)
      localStorage.setItem('app-tab-layout', serializedLayout)
    } catch (error) {
      console.error('Failed to save tab layout:', error)
    }
  }
  
  function loadLayout(): TabPanel[] | null {
    try {
      const saved = localStorage.getItem('app-tab-layout')
      return saved ? JSON.parse(saved) : null
    } catch (error) {
      console.error('Failed to load tab layout:', error)
      return null
    }
  }
  
  function saveToServer() {
    // Save layout to server for cross-device sync
    $fetch('/api/user/layout', {
      method: 'POST',
      body: { layout: layout.value }
    })
  }
  
  async function loadFromServer(): Promise<TabPanel[] | null> {
    try {
      const response = await $fetch('/api/user/layout')
      return response.layout
    } catch (error) {
      console.error('Failed to load layout from server:', error)
      return null
    }
  }
  
  // Auto-save on layout changes
  watch(layout, debounce(saveLayout, 1000), { deep: true })
  
  return {
    saveLayout,
    loadLayout,
    saveToServer,
    loadFromServer
  }
}
```

### Performance Optimization

```typescript
// composables/useTabOptimization.ts
export const useTabOptimization = () => {
  const { allComponents } = useTabsManager()
  
  // Lazy load tab components
  function createLazyTab(componentName: string, props: any = {}): TabItem {
    return {
      name: componentName.toLowerCase(),
      label: componentName,
      component: componentName,
      props,
      // Only initialize when tab becomes active
      initized: false
    }
  }
  
  // Unload inactive tabs to free memory
  function unloadInactiveTabs() {
    allComponents.value.forEach(tab => {
      if (!tab.initized) {
        // Mark for cleanup
        tab.shouldUnload = true
      }
    })
  }
  
  // Virtual scrolling for many tabs
  function createVirtualTabList(tabs: TabItem[], visibleCount = 10) {
    return computed(() => {
      const start = Math.max(0, currentTabIndex.value - Math.floor(visibleCount / 2))
      const end = Math.min(tabs.length, start + visibleCount)
      return tabs.slice(start, end)
    })
  }
  
  return {
    createLazyTab,
    unloadInactiveTabs,
    createVirtualTabList
  }
}
```

## Error Handling and Testing

### Error Boundaries

```vue
<!-- components/TabErrorBoundary.vue -->
<template>
  <NuxtErrorBoundary @error="handleError">
    <slot />
    <template #error="{ error, clearError }">
      <div class="tab-error-container">
        <div class="error-content">
          <Icon name="lucide:alert-circle" class="error-icon" />
          <h3>Something went wrong in this tab</h3>
          <p>{{ error?.message || 'An unexpected error occurred' }}</p>
          <div class="error-actions">
            <el-button @click="clearError" type="primary">
              <Icon name="lucide:refresh-ccw" />
              Retry
            </el-button>
            <el-button @click="closeTab">
              <Icon name="lucide:x" />
              Close Tab
            </el-button>
          </div>
        </div>
      </div>
    </template>
  </NuxtErrorBoundary>
</template>

<script setup lang="ts">
function handleError(error: Error) {
  console.error('Tab error:', error)
  // Log to error reporting service
  // sendErrorReport(error)
}

function closeTab() {
  // Close current tab
  const router = inject(MenuRouterKey)
  router?.back()
}
</script>
```

### Testing Tab Components

```typescript
// tests/tabs/UserProfileTab.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UserProfileTab from '~/components/tabs/UserProfileTab.vue'

describe('UserProfileTab', () => {
  const mockRouter = {
    updateTabName: vi.fn(),
    message: {
      success: vi.fn(),
      error: vi.fn()
    },
    refeshActions: []
  }
  
  it('loads user data on mount', async () => {
    const wrapper = mount(UserProfileTab, {
      props: {
        tab: { name: 'user-profile', label: 'User Profile', component: 'UserProfileTab' },
        userId: '123'
      },
      global: {
        provide: {
          [MenuRouterKey]: mockRouter
        },
        mocks: {
          $fetch: vi.fn().mockResolvedValue({
            data: { id: '123', name: 'John Doe', email: 'john@example.com' }
          })
        }
      }
    })
    
    await nextTick()
    
    expect(wrapper.find('h1').text()).toBe('John Doe')
    expect(mockRouter.updateTabName).toHaveBeenCalledWith('John Doe Profile')
  })
  
  it('handles save operation', async () => {
    // Test implementation
  })
  
  it('prevents navigation with unsaved changes', async () => {
    // Test implementation
  })
})
```

---

*These examples demonstrate practical implementation patterns for the tabs layer system. Adapt them to your specific application requirements and use cases.*