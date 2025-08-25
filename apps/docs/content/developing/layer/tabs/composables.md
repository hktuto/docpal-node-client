---
title: "useTab Composable"
description: "State management composable for the tabs layer system"
---

# useTab Composable

The `useTab` composable provides centralized state management for the tabs layer system. It handles all tab and panel operations, state synchronization, and provides a reactive interface for tab management.

## Overview

The composable is built around Vue's reactivity system and provides:

- **Centralized State**: All tab and panel state in one place
- **Reactive Updates**: Automatic UI updates when state changes
- **Type Safety**: Full TypeScript support with strict typing
- **Event Coordination**: Integration with global event systems
- **Persistence**: Optional state persistence for user preferences

## Core State Management

### Primary State Stores

```typescript
// Core state composables
export const useTabLayout = () => useState<TabPanel[]>('tabs', () => ([]))
export const useCurrentTargetPanel = () => useState<string>('tab-current-target-panel', () => "")
export const useTabComponent = () => useState<TabItem[]>('tab-component', () => ([]))
export const useAllComponentRef = () => useState('all-component-ref', () => ([]))
```

### State Structure

```typescript
interface TabPanel {
  id: string
  size?: number
  parent: string
  showingTabIndex?: number
  tabs: TabItem[]
}

interface TabItem {
  parent?: string
  initized?: boolean
  name: string
  label: string
  icon?: string
  component: string
  props?: Record<string, any>
  [key: string]: any
}
```

## Primary Functions

### useTabsManager()

The main composable that provides access to all tab management functionality.

```typescript
export const useTabsManager = () => {
  const layout = useTabLayout()
  const allComponents = useTabComponent()
  const allComponentRef = useAllComponentRef()
  const hightLightPanel = useCurrentTargetPanel()
  
  function initLayout(newLayout: TabPanel[]) {
    layout.value = newLayout
    nextTick(() => {
      // Set focus to stored or first panel
      hightLightPanel.value = localStorage.getItem('app-tab-hightLightPanel') || newLayout[0]?.id || ''
      
      // Flatten all tabs into components array
      allComponents.value = newLayout.reduce((prev: TabItem[], panel: TabPanel) => {
        return prev.concat(panel.tabs)
      }, [])
      
      // Initialize selected tabs
      layout.value.forEach((panel: any) => {
        if (panel.tabs[panel.showingTabIndex || 0]) {
          panel.tabs[panel.showingTabIndex || 0].initized = true
        }
      })
    })
  }

  return {
    allComponents,
    initLayout,
    layout,
    allComponentRef
  }
}
```

## Core Operations

### Panel Management

#### Panel Focus Management

```typescript
export function panelTabFocus(panelId: string, tabIndex: number) {
  const layout = useTabLayout()
  const hightLightPanel = useCurrentTargetPanel()
  
  // Find panel and update focus
  const panelIndex = layout.value.findIndex(tab => tab.id === panelId)
  hightLightPanel.value = panelId
  
  if (panelIndex !== -1 && layout.value[panelIndex]) {
    layout.value[panelIndex].showingTabIndex = tabIndex
  }
  
  // Initialize tab if not already done
  if (layout.value[panelIndex]?.tabs[tabIndex] && !layout.value[panelIndex].tabs[tabIndex].initized) {
    layout.value[panelIndex].tabs[tabIndex].initized = true
  }
}
```

#### Panel Resizing

```typescript
export function paneResized(sizes: {min: number, max: number, size: number}[]) {
  const layout = useTabLayout()
  sizes.forEach((size, index) => {
    if (layout.value[index]) {
      layout.value[index].size = size.size
    }
  })
}
```

### Tab Operations

#### Tab Closing

```typescript
export function closePanelTab(panelId: string, tabIndex: number, deleteComponent = true) {
  const layout = useTabLayout()
  const components = useTabComponent()
  const panelIndex = layout.value.findIndex(tab => tab.id === panelId)
  
  if (panelIndex !== -1 && layout.value[panelIndex]) {
    // Prevent closing the last tab
    if (components.value.length === 1) return
    
    const data = layout.value[panelIndex].tabs[tabIndex]
    layout.value[panelIndex].tabs.splice(tabIndex, 1)
    
    // Remove from components array if requested
    if (deleteComponent && data?.id) {
      const componentIndex = components.value.findIndex((component) => component.id === data.id)
      if (componentIndex !== -1) components.value.splice(componentIndex, 1)
    }

    // Handle panel cleanup or focus adjustment
    if (layout.value[panelIndex].tabs.length === 0) {
      // Remove empty panel
      layout.value.splice(panelIndex, 1)
      
      // Focus on adjacent panel
      const newFocusTab = panelIndex > 0 ? panelIndex - 1 : 0
      if (layout.value[newFocusTab]) {
        panelTabFocus(layout.value[newFocusTab].id, 0)
      }
    } else {
      // Adjust focus within panel
      layout.value[panelIndex].showingTabIndex = tabIndex > 0 ? tabIndex - 1 : 0
      const currentTab = layout.value[panelIndex].tabs[layout.value[panelIndex].showingTabIndex || 0]
      
      if (currentTab) {
        const componentIndex = components.value.findIndex((component: TabItem) => component.id === currentTab.id)
        if (componentIndex !== -1 && components.value[componentIndex]) {
          components.value[componentIndex].initized = true
        }
      }
    }
  }
}
```

#### Tab Creation

```typescript
export function addTabInCurrentPanel(newTab: TabItem) {
  const layout = useTabLayout()
  const allComponents = useTabComponent()
  const hightLightPanel = useCurrentTargetPanel()
  const parentId = layout.value.findIndex(tab => tab.id === hightLightPanel.value)
  
  // Generate unique ID and setup tab
  newTab.id = "new-tab-" + new Date().getTime()
  newTab.initized = true
  newTab.parent = hightLightPanel.value
  
  if (parentId !== -1 && layout.value[parentId]) {
    layout.value[parentId].tabs.push(newTab)
    
    nextTick(() => {
      if (layout.value[parentId]) {
        panelTabFocus(hightLightPanel.value, layout.value[parentId].tabs.length - 1)
      }
      allComponents.value.push(newTab)
    })
  }
}
```

#### Tab Addition to Specific Panel

```typescript
export function addTabToPanel(panelId: string, newTab: TabItem) {
  const layout = useTabLayout()
  const allComponents = useTabComponent()
  const parentId = layout.value.findIndex(tab => tab.id === panelId)
  
  if (parentId !== -1 && layout.value[parentId]) {
    newTab.id = "new-tab-" + new Date().getTime()
    newTab.initized = true
    newTab.parent = panelId
    layout.value[parentId].tabs.push(newTab)
    
    nextTick(() => {
      if (layout.value[parentId]) {
        panelTabFocus(panelId, layout.value[parentId].tabs.length - 1)
      }
      allComponents.value.push({...newTab})
    })
  }
}
```

### Advanced Operations

#### Tab Reordering

```typescript
export function reorderWithEdge(parent: TabPanel, sourceData: TabItem, targetData: TabItem, direction: 'left' | 'right') {
  const layout = useTabLayout()
  const parentId = layout.value.findIndex(tab => tab.id === parent.id)
  if (parentId === -1 || !layout.value[parentId]) return
  
  // Remove source tab
  const sourceIndex = layout.value[parentId].tabs.findIndex((tabItem) => tabItem.id === sourceData.id)
  layout.value[parentId]?.tabs.splice(sourceIndex, 1)
  
  // Insert at new position
  const targetIndex = layout.value[parentId].tabs.findIndex((tabItem) => tabItem.id === targetData.id)
  const newItemIndex = direction === 'left' ? targetIndex : targetIndex + 1
  layout.value[parentId]?.tabs.splice(newItemIndex, 0, sourceData)
  
  // Focus on moved tab
  nextTick(() => {
    panelTabFocus(sourceData.parent as string, newItemIndex)
  })
}
```

#### Tab Movement Between Panels

```typescript
export function moveTabBetweenPanel(sourceData: TabItem, targetData: TabItem, direction: 'left' | 'right') {
  const layout = useTabLayout()
  const allComponents = useTabComponent()
  const sourceParentId = layout.value.findIndex(tab => tab.id === sourceData.parent)
  const targetParentId = layout.value.findIndex(tab => tab.id === targetData.parent)
  
  if (sourceParentId === -1 || targetParentId === -1) return
  
  // Same panel reordering
  if (sourceParentId === targetParentId && layout.value[sourceParentId]) {
    reorderWithEdge(layout.value[sourceParentId], sourceData, targetData, direction)
    return
  }
  
  // Cross-panel movement
  if (!layout.value[sourceParentId] || !layout.value[targetParentId]) return
  
  const sourceIndex = layout.value[sourceParentId].tabs.findIndex((tabItem) => tabItem.id === sourceData.id)
  if (sourceIndex === -1) return
  
  // Remove from source panel
  closePanelTab(sourceData.parent as string, sourceIndex, false)
  
  // Add to target panel
  const newSourceData: TabItem = {
    ...sourceData,
    parent: targetData.parent,
  }
  
  const targetIndex = layout.value[targetParentId].tabs.findIndex((tabItem) => tabItem.id === targetData.id)
  const newItemIndex = direction === 'left' ? targetIndex : targetIndex + 1
  layout.value[targetParentId]?.tabs.splice(newItemIndex, 0, newSourceData)
  
  // Update component reference
  const componentIndex = allComponents.value.findIndex((component) => component.id === newSourceData.id)
  nextTick(() => {
    panelTabFocus(targetData.parent as string, newItemIndex)
  })
}
```

#### Panel Splitting

```typescript
export function splitViewToDirection(sourceData: TabItem, targetData: TabPanel, direction: "left" | "right" | 'center') {
  const layout = useTabLayout()
  const allComponents = useTabComponent()
  const sourceParentId = layout.value.findIndex(tab => tab.id === sourceData.parent)
  const targetParentId = layout.value.findIndex(tab => tab.id === targetData.id)
  
  if (sourceParentId === -1 || !layout.value[sourceParentId]) return
  
  const sourceIndex = layout.value[sourceParentId].tabs.findIndex((tabItem) => tabItem.id === sourceData.id)
  if (sourceIndex === -1) return
  
  closePanelTab(sourceData.parent as string, sourceIndex, false)
  
  if (direction === 'center') {
    // Add to existing panel
    const currentTargetIndex = layout.value.findIndex(tab => tab.id === targetData.id)
    if (currentTargetIndex !== -1 && layout.value[currentTargetIndex]) {
      layout.value[currentTargetIndex].tabs.push({
        ...sourceData,
        parent: targetData.id,
      })
      
      nextTick(() => {
        if (layout.value[currentTargetIndex]) {
          panelTabFocus(layout.value[currentTargetIndex].id, layout.value[currentTargetIndex].tabs.length - 1)
        }
        const component = allComponents.value.find((component: TabItem) => component.id === sourceData.id)
        if (component) {
          component.parent = targetData.id
          component.initized = true
        }
      })
    }
  } else {
    // Create new panel
    const newPanelId = "newPanel-" + new Date().getTime()
    const newData: TabPanel = {
      id: newPanelId,
      parent: targetData.id,
      showingTabIndex: 0,
      tabs: [{
        ...sourceData,
        parent: newPanelId,
        initized: true,
      }]
    }
    
    const newItemIndex = direction === 'left' ? targetParentId : targetParentId + 1
    layout.value.splice(newItemIndex, 0, newData)
    
    nextTick(() => {
      panelTabFocus(newPanelId, 0)
      const component = allComponents.value.find((component: TabItem) => component.id === sourceData.id)
      if (component) {
        component.parent = newPanelId
        component.initized = true
      }
    })
  }
}
```

#### Menu Item Integration

```typescript
export function addMenuItemToPanel(sourceData: any, targetData: TabPanel, direction: "left" | "right" | 'center') {
  const layout = useTabLayout()
  const allComponents = useTabComponent()
  const targetParentId = layout.value.findIndex(tab => tab.id === targetData.id)
  
  if (targetParentId === -1 || !layout.value[targetParentId]) return
  
  const newPanelId = "newPanel-" + new Date().getTime()
  sourceData.id += new Date().getTime() // Ensure unique ID
  
  if (direction === 'center') {
    // Add to existing panel
    layout.value[targetParentId].tabs.push({
      ...sourceData,
      parent: targetData.id,
    })
    
    nextTick(() => {
      if (layout.value[targetParentId]) {
        panelTabFocus(layout.value[targetParentId].id, layout.value[targetParentId].tabs.length - 1)
      }
      
      const component = allComponents.value.find((component: TabItem) => component.id === sourceData.id)
      if (component) {
        component.parent = targetData.parent
        component.initized = true
      } else {
        allComponents.value.push({
          ...sourceData,
          parent: targetData.id,
          initized: true,
        })
      }
    })
  } else {
    // Create new panel
    const newData: TabPanel = {
      id: newPanelId,
      parent: targetData.id,
      showingTabIndex: 0,
      tabs: [{
        ...sourceData,
        initized: true,
        parent: newPanelId,
      }]
    }
    
    const newItemIndex = direction === 'left' ? targetParentId : targetParentId + 1
    layout.value.splice(newItemIndex, 0, newData)
    
    nextTick(() => {
      panelTabFocus(newPanelId, 0)
      
      const component = allComponents.value.find((component: TabItem) => component.id === sourceData.id)
      if (component) {
        component.parent = newPanelId
        component.initized = true
      } else {
        allComponents.value.push({
          ...sourceData,
          initized: true,
          parent: newPanelId,
        })
      }
    })
  }
}
```

#### Tab Content Updates

```typescript
export function panelRouteUpdate(panelId: string, lastTabId: string, newTabItem: TabItem) {
  const layout = useTabLayout()
  const allComponents = useTabComponent()
  const panelIndex = layout.value.findIndex(panel => panel.id === panelId)
  
  if (panelIndex !== -1 && layout.value[panelIndex]) {
    const index = layout.value[panelIndex].tabs.findIndex(tab => tab.id === lastTabId)
    if (index === -1) throw new Error('Tab not found when router change')
    
    layout.value[panelIndex].tabs[index] = deepCopy(newTabItem)
    
    const indexInAllComponent = allComponents.value.findIndex(item => item.id === newTabItem.id)
    if (indexInAllComponent !== -1) {
      allComponents.value[indexInAllComponent] = newTabItem
    }
  }
}
```

## Usage Patterns

### Basic Tab Management

```typescript
// Initialize tab system
const { layout, allComponents, initLayout } = useTabsManager()
const hightLightPanel = useCurrentTargetPanel()

// Set up initial layout
initLayout([
  {
    id: 'panel-1',
    parent: 'root',
    showingTabIndex: 0,
    tabs: [
      {
        id: 'tab-1',
        name: 'home',
        label: 'Home',
        component: 'HomePage',
        initized: true
      }
    ]
  }
])

// Add new tab to current panel
addTabInCurrentPanel({
  name: 'settings',
  label: 'Settings',
  icon: 'lucide:settings',
  component: 'SettingsPage'
})

// Focus specific tab
panelTabFocus('panel-1', 0)
```

### Advanced Operations

```typescript
// Move tab between panels
moveTabBetweenPanel(sourceTab, targetTab, 'right')

// Split panel with tab
splitViewToDirection(sourceTab, targetPanel, 'left')

// Close tab with cleanup
closePanelTab('panel-1', 2, true)

// Add menu item as new tab
addMenuItemToPanel(menuItem, targetPanel, 'center')
```

### State Monitoring

```typescript
// Watch for layout changes
watch(layout, (newLayout) => {
  console.log('Layout updated:', newLayout)
  // Save to localStorage or sync with server
}, { deep: true })

// Monitor active panel changes
watch(hightLightPanel, (newPanel) => {
  localStorage.setItem('app-tab-hightLightPanel', newPanel)
})
```

## Type Safety

### Core Types

```typescript
interface TabItem {
  parent?: string           // Parent panel ID
  initized?: boolean       // Whether tab content is loaded
  name: string            // Unique tab identifier
  label: string           // Display label
  icon?: string           // Icon identifier
  component: string       // Component name to render
  props?: Record<string, any> // Component props
  [key: string]: any      // Additional properties
}

interface TabPanel {
  id: string              // Unique panel identifier
  size?: number           // Panel size percentage
  parent: string          // Parent container ID
  showingTabIndex?: number // Currently active tab index
  tabs: TabItem[]         // Array of tabs in this panel
}
```

### Function Signatures

```typescript
// Panel operations
function panelTabFocus(panelId: string, tabIndex: number): void
function paneResized(sizes: {min: number, max: number, size: number}[]): void

// Tab operations
function closePanelTab(panelId: string, tabIndex: number, deleteComponent?: boolean): void
function addTabInCurrentPanel(newTab: TabItem): void
function addTabToPanel(panelId: string, newTab: TabItem): void

// Advanced operations
function moveTabBetweenPanel(sourceData: TabItem, targetData: TabItem, direction: 'left' | 'right'): void
function splitViewToDirection(sourceData: TabItem, targetData: TabPanel, direction: "left" | "right" | 'center'): void
function addMenuItemToPanel(sourceData: any, targetData: TabPanel, direction: "left" | "right" | 'center'): void

// State updates
function panelRouteUpdate(panelId: string, lastTabId: string, newTabItem: TabItem): void
```

## Performance Considerations

### Reactivity Optimization

```typescript
// Use nextTick for DOM updates
nextTick(() => {
  panelTabFocus(panelId, tabIndex)
})

// Deep copy for state isolation
layout.value[panelIndex].tabs[index] = deepCopy(newTabItem)
```

### Memory Management

```typescript
// Clean component references when closing tabs
if (deleteComponent && data?.id) {
  const componentIndex = components.value.findIndex((component) => component.id === data.id)
  if (componentIndex !== -1) components.value.splice(componentIndex, 1)
}
```

### State Synchronization

```typescript
// Maintain consistency between layout and components
allComponents.value = newLayout.reduce((prev: TabItem[], panel: TabPanel) => {
  return prev.concat(panel.tabs)
}, [])
```

## Error Handling

### Validation

```typescript
// Check for valid panel before operations
if (panelIndex === -1 || !layout.value[panelIndex]) return

// Validate tab existence
if (sourceIndex === -1) {
  console.error('Source tab not found')
  return
}

// Prevent invalid operations
if (components.value.length === 1) {
  console.warn('Cannot close the last tab')
  return
}
```

### Error Recovery

```typescript
// Graceful fallback for missing tabs
if (index === -1) {
  throw new Error('Tab not found when router change')
}

// Safe array access
const currentTab = layout.value[panelIndex]?.tabs[layout.value[panelIndex].showingTabIndex || 0]
```

## Integration Points

### Global State Integration

```typescript
// Use Nuxt's useState for persistence
export const useTabLayout = () => useState<TabPanel[]>('tabs', () => ([]))
export const useCurrentTargetPanel = () => useState<string>('tab-current-target-panel', () => "")
```

### Event Bus Integration

```typescript
// Components can listen to state changes
watch(layout, (newLayout) => {
  emit('layoutChanged', newLayout)
}, { deep: true })
```

### LocalStorage Integration

```typescript
// Persist user preferences
hightLightPanel.value = localStorage.getItem('app-tab-hightLightPanel') || newLayout[0]?.id || ''
```

---

*This composable provides the complete state management foundation for the tabs layer system in version 6.0.0.*