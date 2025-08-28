# CLI Quick Reference

## 🚀 Layer Creation
```bash
pnpm run create:layer                    # Interactive layer creation
```

## 📋 Layer Management
```bash
# List layers
pnpm run layers:list                     # Basic list
pnpm run manage:layers list --detailed   # Detailed info

# Analyze layer  
pnpm run layers:analyze <layer-name>     # Full analysis
pnpm run manage:layers analyze auth      # Example

# Delete layer
pnpm run manage:layers delete <name> --force
```

## 🔧 Other Commands
```bash
pnpm run dev              # Start dev server
pnpm run getApi           # Generate API client
pnpm run web:build        # Build for production
```

## 📁 Layer Types
- **Component Layer**: Global components only
- **Page Layer**: Pages/routes only  
- **Full Layer**: Components + Pages + Composables + Utils
- **Minimal Layer**: Config files only
- **Custom**: Pick your own structure

## 🎯 Menu Integration
When creating layers, you can optionally add menu integration with:
- **Custom Menu ID**: Input unique identifiers with validation and conflict detection
- **Smart Defaults**: Press Enter to use layer name as Menu ID
- **Format Validation**: Automatic checking for proper naming conventions (lowercase, hyphens, underscores)
- **Conflict Prevention**: Scans existing layers to prevent duplicate menu IDs
- **Icon Selection**: Choose from Material Symbols, Element Plus, or DP Icons
- **i18n Labels**: Custom internationalization keys with format validation
- **Real-time Feedback**: Immediate validation with helpful error messages

## 📂 Generated Structure Example
```
my_layer/                           # snake_case layer name
├── nuxt.config.ts                    # Required
├── tsconfig.json                    # Required  
├── app.config.ts                    # Optional (menu integration)
├── components/global/myLayer/index.vue # camelCase component folder
├── pages/myLayer/index.vue            # camelCase page folder
├── composables/useMyLayer.ts          # camelCase composable
└── utils/myLayerUtils.ts              # camelCase utils
```

## 📝 Naming Conventions
- **Layer Name**: `snake_case` (e.g., `user_management`)
- **Component Folder**: `camelCase` (e.g., `userManagement`)
- **Page Folder**: `camelCase` (e.g., `userManagement`)
- **Composable**: `camelCase` with `use` prefix (e.g., `useUserManagement`)
- **Utils**: `camelCase` with `Utils` suffix (e.g., `userManagementUtils`)
- **Component Name**: `PascalCase` with `Lazy` prefix (e.g., `LazyUserManagement`)

## 🔍 Quick Commands
```bash
# Create a new feature layer quickly
pnpm run create:layer

# Check what layers exist  
pnpm run layers:list

# See details about a specific layer
pnpm run layers:analyze tabs

# Get help on any command
pnpm run create:layer --help
pnpm run manage:layers --help
```