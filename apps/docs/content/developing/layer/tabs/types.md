---
title: "Tab Types Reference"
description: "TypeScript type definitions for the tabs layer system"
---

# Tab Types Reference

This document provides comprehensive documentation for all TypeScript types, interfaces, and injection keys used in the tabs layer system.

## Core Type Definitions

### TabItem Interface

The fundamental type representing a single tab within the system.

```typescript
export interface TabItem {
  parent?: string         // ID of the parent panel containing this tab
  initized?: boolean     // Whether the tab content has been loaded/initialized
  [key: string]: any     // Extensible properties for additional tab data
}
```

#### Core Properties

**Required Properties:**
- `name: string` - Unique identifier for the tab type/route
- `label: string` - Display name shown in the tab header
- `component: string` - Name of the Vue component to render

**Optional Properties:**
- `parent?: string` - Parent panel ID (auto-assigned during tab creation)
- `initized?: boolean` - Initialization state (managed by the system)
- `icon?: string` - Icon identifier for tab display
- `props?: Record<string, any>` - Properties passed to the tab component
- `id?: string` - Unique instance ID (auto-generated)

#### Extended Properties

The interface uses an index signature allowing for additional properties:

```typescript
interface ExtendedTabItem extends TabItem {
  // Standard properties
  name: string
  label: string
  component: string
  icon?: string
  props?: Record<string, any>
  
  // Custom properties
  closable?: boolean
  pinned?: boolean
  modified?: boolean
  data?: any
  metadata?: {
    createdAt: Date
    lastAccessed: Date
    customData: Record<string, any>
  }
}
```

### TabPanel Type

Represents a panel container that holds multiple tabs.

```typescript
export type TabPanel = {
  id: string              // Unique panel identifier
  size?: number          // Panel width as percentage of container
  parent: string         // Parent container ID (usually 'root')
  showingTabIndex?: number // Index of currently active tab (0-based)
  tabs: TabItem[]        // Array of tabs contained in this panel
}
```

#### Panel Properties

**Required Properties:**
- `id: string` - Unique identifier for the panel
- `parent: string` - ID of parent container
- `tabs: TabItem[]` - Array of tabs in this panel

**Optional Properties:**
- `size?: number` - Panel width percentage (managed by split pane system)
- `showingTabIndex?: number` - Currently visible tab index (defaults to 0)

#### Panel State Management

```typescript
// Panel creation
const newPanel: TabPanel = {
  id: `panel-${Date.now()}`,
  parent: 'root',
  showingTabIndex: 0,
  tabs: []
}

// Panel with tabs
const populatedPanel: TabPanel = {
  id: 'main-panel',
  parent: 'root',
  showingTabIndex: 1,
  size: 60, // 60% of container width
  tabs: [
    { name: 'home', label: 'Home', component: 'HomePage' },
    { name: 'settings', label: 'Settings', component: 'SettingsPage' }
  ]
}
```

## Context and Injection Keys

### TabManager Interface

Defines the contract for tab management functionality provided through Vue's injection system.

```typescript
interface TabManager {
  dialogOpened: Ref<boolean>           // State of URL paste dialog
  menuStick: Ref<boolean>             // State of sidebar attachment
  closeDialog: () => void             // Close URL paste dialog
  openNewDialog: (args: any) => void  // Open URL paste dialog with data
  openTab: (tab: TabItem) => void     // Open tab (focus if exists, create if not)
  openInNewTab: (tab: TabItem) => void // Force open in new panel
  openInCurrentTab: (tab: TabItem) => void // Open in current tab content
  toggleMenuStick: () => void         // Toggle sidebar attachment state
}
```

#### TabManager Usage

```typescript
// Inject tab manager in components
const tabManager = inject(TabManagerKey)

// Open a new tab
tabManager?.openTab({
  name: 'document',
  label: 'Document View',
  component: 'DocumentViewer',
  props: { documentId: '123' }
})

// Toggle sidebar
tabManager?.toggleMenuStick()

// Control dialog state
if (tabManager?.dialogOpened.value) {
  tabManager.closeDialog()
}
```

### TabComponentHelper Interface

Provides utilities for tab component management.

```typescript
interface TabComponentHelper {
  renameTab: (panelId: string, tabId: string, newName: string) => void
  tabDataKey: symbol                  // Unique key for drag & drop operations
}
```

#### Component Helper Usage

```typescript
// Inject component helper
const tabHelper = inject(TabComponentKey)

// Rename a tab
tabHelper?.renameTab('panel-1', 'tab-123', 'New Tab Name')

// Access drag key for drop operations
const dragKey = tabHelper?.tabDataKey
```

### Injection Keys

Type-safe injection keys for Vue's provide/inject system.

```typescript
export const TabManagerKey: InjectionKey<TabManager> = Symbol('tabManager')
export const TabComponentKey: InjectionKey<TabComponentHelper> = Symbol('tabComponent')
```

#### Usage Pattern

```typescript
// Providing context (in parent component)
provide(TabManagerKey, {
  dialogOpened,
  menuStick,
  openTab,
  openInNewTab,
  // ... other methods
})

// Injecting context (in child component)
const tabManager = inject(TabManagerKey)
if (!tabManager) {
  throw createError('TabManager not provided')
}
```

## Extended Type Definitions

### RouterParams Interface

Used for navigation within tabs (referenced but not defined in the types file).

```typescript
interface RouterParams {
  name: string              // Route/component name
  label: string            // Display label
  component: string        // Component to render
  icon?: string           // Optional icon
  props?: Record<string, any> // Component properties
  id?: string             // Instance identifier
  parent?: string         // Parent panel ID
  initized?: boolean      // Initialization state
}
```

### DropData Interface

For drag and drop operations (inferred from usage).

```typescript
interface DropData {
  key: symbol             // Drag operation identifier
  type: 'tab' | 'menu'   // Type of dragged item
  data: TabItem | any    // Actual data being dragged
}
```

### PanelSizeData Interface

For panel resizing operations.

```typescript
interface PanelSizeData {
  min: number             // Minimum size percentage
  max: number            // Maximum size percentage
  size: number           // Current size percentage
}
```

## Type Guards and Utilities

### Type Guard Functions

```typescript
// Check if data is a valid TabItem
export function isTabItem(data: any): data is TabItem {
  return data && 
         typeof data.name === 'string' && 
         typeof data.label === 'string' && 
         typeof data.component === 'string'
}

// Check if data is a valid TabPanel
export function isTabPanel(data: any): data is TabPanel {
  return data && 
         typeof data.id === 'string' && 
         typeof data.parent === 'string' && 
         Array.isArray(data.tabs)
}

// Check if data is drag-compatible
export function isTabData(data: Record<string | symbol, unknown>): boolean {
  return data.key === tabDataKey // Assumes access to tab data key
}
```

### Type Helpers

```typescript
// Create a new tab with defaults
export function createTab(partial: Partial<TabItem> & { name: string, label: string, component: string }): TabItem {
  return {
    initized: false,
    ...partial
  }
}

// Create a new panel with defaults
export function createPanel(id: string, parent: string = 'root'): TabPanel {
  return {
    id,
    parent,
    showingTabIndex: 0,
    tabs: []
  }
}

// Generate unique IDs
export function generateTabId(): string {
  return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function generatePanelId(): string {
  return `panel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
```

## Advanced Type Patterns

### Generic Tab Types

```typescript
// Tab with typed props
interface TypedTabItem<T = any> extends TabItem {
  props?: T
}

// Specific tab types
interface DocumentTab extends TypedTabItem<{ documentId: string, readOnly?: boolean }> {
  name: 'document'
  component: 'DocumentViewer'
}

interface SettingsTab extends TypedTabItem<{ section?: string }> {
  name: 'settings'
  component: 'SettingsPage'
}

interface UserTab extends TypedTabItem<{ userId: string, tab?: 'profile' | 'settings' }> {
  name: 'user'
  component: 'UserPage'
}

// Union type for all possible tabs
type AppTabItem = DocumentTab | SettingsTab | UserTab | TabItem
```

### State Management Types

```typescript
// Tab state management
interface TabState {
  layout: TabPanel[]
  currentPanel: string
  allComponents: TabItem[]
  componentRefs: any[]
}

// Tab actions
interface TabActions {
  initLayout: (layout: TabPanel[]) => void
  addTab: (tab: TabItem) => void
  closeTab: (panelId: string, tabIndex: number) => void
  focusTab: (panelId: string, tabIndex: number) => void
  moveTab: (source: TabItem, target: TabItem, direction: 'left' | 'right') => void
}

// Complete tab manager type
interface CompleteTabManager extends TabState, TabActions {
  dialogOpened: Ref<boolean>
  menuStick: Ref<boolean>
}
```

### Event Types

```typescript
// Tab-related events
interface TabEvents {
  'tab:created': { tab: TabItem, panel: TabPanel }
  'tab:closed': { tabId: string, panelId: string }
  'tab:focused': { tabId: string, panelId: string }
  'tab:moved': { tabId: string, fromPanel: string, toPanel: string }
  'panel:created': { panel: TabPanel }
  'panel:resized': { panelId: string, size: number }
  'layout:changed': { layout: TabPanel[] }
}

// Event payload types
type TabEventPayload<T extends keyof TabEvents> = TabEvents[T]
```

## Validation Schemas

### Runtime Validation

```typescript
// Validate TabItem structure
export function validateTabItem(data: unknown): data is TabItem {
  if (typeof data !== 'object' || data === null) return false
  
  const tab = data as any
  return typeof tab.name === 'string' && 
         typeof tab.label === 'string' && 
         typeof tab.component === 'string' &&
         (tab.parent === undefined || typeof tab.parent === 'string') &&
         (tab.initized === undefined || typeof tab.initized === 'boolean')
}

// Validate TabPanel structure
export function validateTabPanel(data: unknown): data is TabPanel {
  if (typeof data !== 'object' || data === null) return false
  
  const panel = data as any
  return typeof panel.id === 'string' &&
         typeof panel.parent === 'string' &&
         Array.isArray(panel.tabs) &&
         panel.tabs.every(validateTabItem) &&
         (panel.size === undefined || typeof panel.size === 'number') &&
         (panel.showingTabIndex === undefined || typeof panel.showingTabIndex === 'number')
}
```

### Error Types

```typescript
// Tab-specific errors
class TabError extends Error {
  constructor(message: string, public tabId?: string, public panelId?: string) {
    super(message)
    this.name = 'TabError'
  }
}

class PanelError extends Error {
  constructor(message: string, public panelId?: string) {
    super(message)
    this.name = 'PanelError'
  }
}

// Error handling
function handleTabOperation<T>(operation: () => T): T | never {
  try {
    return operation()
  } catch (error) {
    if (error instanceof TabError) {
      console.error(`Tab operation failed: ${error.message}`, { tabId: error.tabId, panelId: error.panelId })
    }
    throw error
  }
}
```

## Migration and Compatibility

### Version Compatibility

```typescript
// Legacy tab format (pre-v6.0.0)
interface LegacyTabItem {
  id: string
  title: string
  content: string
  type: string
}

// Migration function
function migrateLegacyTab(legacy: LegacyTabItem): TabItem {
  return {
    name: legacy.type,
    label: legacy.title,
    component: `${legacy.type}Component`,
    props: { content: legacy.content },
    initized: false
  }
}

// Batch migration
function migrateLegacyTabs(legacyTabs: LegacyTabItem[]): TabItem[] {
  return legacyTabs.map(migrateLegacyTab)
}
```

### Future Extensions

```typescript
// Extensible tab system for future features
interface FutureTabItem extends TabItem {
  // Planned features
  pinned?: boolean
  group?: string
  theme?: string
  permissions?: string[]
  lifecycle?: {
    created: Date
    lastAccessed: Date
    modified: Date
  }
  settings?: {
    autoSave: boolean
    showInHistory: boolean
    [key: string]: any
  }
}

// Plugin system support
interface TabPlugin {
  name: string
  version: string
  init: (tab: TabItem) => void
  destroy: (tab: TabItem) => void
  onTabChange?: (tab: TabItem) => void
}
```

## Best Practices

### Type Safety Guidelines

1. **Always use type guards** when working with unknown data
2. **Prefer interfaces over types** for object shapes
3. **Use generic types** for reusable components
4. **Validate data at boundaries** (API responses, user input)
5. **Document complex types** with JSDoc comments

### Performance Considerations

```typescript
// Use readonly for immutable data
interface ReadonlyTabPanel {
  readonly id: string
  readonly parent: string
  readonly tabs: readonly TabItem[]
  showingTabIndex?: number
  size?: number
}

// Use branded types for IDs
type TabId = string & { readonly __brand: 'TabId' }
type PanelId = string & { readonly __brand: 'PanelId' }

function createTabId(id: string): TabId {
  return id as TabId
}
```

### Error Handling

```typescript
// Result type for operations that might fail
type TabResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

// Safe tab operations
function safeOpenTab(tab: TabItem): TabResult<void> {
  try {
    if (!validateTabItem(tab)) {
      return { success: false, error: 'Invalid tab item' }
    }
    // ... tab opening logic
    return { success: true, data: undefined }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

---

*This type reference covers all TypeScript definitions for the tabs layer system in version 6.0.0. For implementation examples, see the component and composable documentation.*