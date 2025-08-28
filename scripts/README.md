# Nuxt Layer CLI Tools

A comprehensive set of CLI tools to automate the creation and management of Nuxt layers in the Docpal project. These tools eliminate the manual process of creating folders, configuration files, and boilerplate code while providing powerful layer management capabilities.

## 🛠️ Available Tools

### 1. Layer Generator (`create-layer.js`)
Creates new Nuxt layers with interactive configuration

### 2. Layer Manager (`manage-layers.js`)
Manages existing layers (list, analyze, delete)

## ✨ Features

- **Interactive Setup**: Guided prompts for layer configuration
- **Multiple Layer Types**: Choose from predefined structures or create custom ones
- **Menu Integration**: Automatic app.config.ts generation for menu integration
- **Template Generation**: Creates boilerplate components, pages, composables, and utilities
- **Auto-prepare**: Optionally runs `pnpm run prepare` after layer creation
- **Validation**: Prevents naming conflicts and validates layer names
- **Extensible**: Easy to add new templates and features

## 🚀 Quick Start

### Creating a New Layer

```bash
# Using pnpm scripts (recommended)
pnpm run create:layer
# or
pnpm run layer:create

# Direct execution
node scripts/create-layer.js

# Make executable and run directly
chmod +x scripts/create-layer.js
./scripts/create-layer.js
```

### Managing Existing Layers

```bash
# List all layers
pnpm run layers:list

# List layers with detailed information
node scripts/manage-layers.js list --detailed

# Analyze a specific layer
pnpm run layers:analyze auth

# Delete a layer (requires --force)
node scripts/manage-layers.js delete old_layer --force

# General management
pnpm run manage:layers <command> [options]
```

### Interactive Prompts

The CLI will guide you through:

1. **Layer Name**: Enter a valid layer name (lowercase, underscores allowed)
2. **Layer Type**: Choose from predefined structures:
   - Component Layer (global components)
   - Page Layer (pages)
   - Full Layer (components + pages + composables + utils)
   - Minimal Layer (config files only)
   - Custom Structure (pick individual folders)
3. **Menu Configuration**: Optional app.config.ts setup
4. **Auto-prepare**: Option to run preparation script

## 📁 Generated Structure

### Minimal Layer
```
my_layer/
├── nuxt.config.ts
└── tsconfig.json
```

### Component Layer
```
my_layer/
├── components/
│   └── global/
│       └── myLayer/              # camelCase component folder
│           └── index.vue
├── nuxt.config.ts
├── tsconfig.json
└── app.config.ts (optional)
```

### Full Layer
```
my_layer/
├── components/
│   └── global/
│       └── myLayer/              # camelCase component folder
│           └── index.vue
├── pages/
│   └── myLayer/                  # camelCase page folder
│       └── index.vue
├── composables/
│   └── useMyLayer.ts             # camelCase composable name
├── utils/
│   └── myLayerUtils.ts           # camelCase utils name
├── nuxt.config.ts
├── tsconfig.json
└── app.config.ts (optional)
```

## 🛠️ Configuration Files

### nuxt.config.ts
Standard Nuxt layer configuration with:
- DevTools enabled
- Compatibility date set
- SSR disabled

### tsconfig.json
Extends the parent Nuxt TypeScript configuration

### app.config.ts (Optional)
Menu integration configuration with:
- Menu ID and name
- Icon configuration (Material Symbols, Element Plus, DP Icons)
- Component mapping
- Feature flags

## ⚙️ Layer Management Features

### List Layers
- **Basic List**: Shows all layer names
- **Detailed List**: Shows size, features, file count for each layer
- **Feature Detection**: Identifies components, pages, composables, utils, configs

### Analyze Layers
- **Structure Analysis**: Complete breakdown of layer contents
- **Size Calculation**: Accurate file and directory size reporting
- **Health Check**: Identifies missing required files or potential issues
- **Feature Overview**: Shows what capabilities each layer provides

### Delete Layers
- **Safe Deletion**: Requires explicit `--force` flag
- **Confirmation**: Shows warning before deletion
- **Recursive Removal**: Completely removes layer and all contents

## 📝 Available Scripts

### Root Package.json Scripts
```bash
# Layer Creation
pnpm run create:layer      # Interactive layer creation
pnpm run layer:create      # Alias for create:layer

# Layer Management
pnpm run manage:layers     # General management command
pnpm run layers:list       # Quick layer listing
pnpm run layers:analyze    # Layer analysis (requires layer name as arg)
```

The CLI includes smart templates for:

### Components (`LazyComponentName`)
- Vue 3 Composition API setup
- TypeScript support
- SCSS styling with Element Plus variables
- i18n integration

### Pages
- Nuxt page structure
- Layout configuration
- i18n integration
- Responsive design ready

### Composables (`useLayerName`)
- Vue 3 composable pattern
- TypeScript types
- Loading states
- Async operation handling

### Utils (`layerNameUtils`)
- Utility function collection
- TypeScript support
- Validation helpers
- Data formatting functions

## 🔧 Advanced Usage

### Custom Templates

You can extend the CLI by modifying the `templates` object in `create-layer.js`:

```javascript
const templates = {
  'my-custom-file.ts': (layerName) => `
    // Custom template for ${layerName}
    export const ${layerName}Config = {
      // Your custom configuration
    }
  `
}
```

### Adding New Layer Types

Add new layer types by extending the `getLayerStructure()` function:

```javascript
'My Custom Layer Type': ['custom-folder1', 'custom-folder2']
```

### Menu Icon Types

The CLI supports multiple icon types:
- **Material Symbols**: `material-symbols:dashboard`
- **Element Plus**: `ep:user`
- **DP Icons**: `dp-icon:custom-icon`
- **Custom**: Any icon string

## 🎯 Best Practices

### Naming Conventions
- Use lowercase letters with underscores: `user_management`
- Avoid spaces and special characters
- Keep names descriptive but concise

### Naming Conventions
- **Layer Names**: Use lowercase letters with underscores: `user_management`
- **Component Folders**: Use camelCase: `userManagement`
- **Page Folders**: Use camelCase: `userManagement`
- **Composables**: Use camelCase with `use` prefix: `useUserManagement.ts`
- **Utils**: Use camelCase with `Utils` suffix: `userManagementUtils.ts`
- **Component Names**: Use PascalCase with `Lazy` prefix: `LazyUserManagement`

### Layer Structure Planning
- **Component Layer**: For reusable UI components
- **Page Layer**: For specific routes/pages
- **Full Layer**: For complete feature modules
- **Minimal Layer**: For configuration-only layers

### Menu Integration
The CLI provides comprehensive menu configuration with advanced validation:
- **Custom Menu ID Input**: Users can specify unique menu identifiers with format validation
- **Conflict Detection**: Automatically scans existing layers to prevent duplicate menu IDs
- **Smart Defaults**: Uses layer name as default when no input is provided
- **Format Validation**: Ensures menu IDs follow proper naming conventions
- **i18n Label Support**: Custom internationalization keys with validation
- **Icon Selection**: Multiple icon types (Material Symbols, Element Plus, DP Icons)
- **Real-time Feedback**: Immediate validation with helpful error messages

## 🔍 Troubleshooting

### Common Issues

**Permission Denied**
```bash
chmod +x scripts/create-layer.js
```

**Module Import Error**
Ensure the scripts directory has a `package.json` with `"type": "module"`

**Layer Already Exists**
The CLI will prompt for confirmation when overwriting existing layers

**Prepare Script Fails**
The CLI will continue even if `pnpm run prepare` fails. Run it manually:
```bash
cd apps/web && pnpm run prepare
```

## 🚀 Future Enhancements

Planned features:
- [ ] Layer deletion command
- [ ] Layer duplication/cloning
- [ ] Template customization via config file
- [ ] Integration with existing layers
- [ ] Auto-documentation generation
- [ ] Layer dependency management
- [ ] Batch layer operations
- [ ] CI/CD integration helpers

## 📄 Example Usage

### Creating a User Management Layer

```bash
pnpm run create:layer

# Prompts:
# Layer name: user_management
# Layer type: Full Layer
# Menu ID: user-management
# Menu name: userManagement
# Menu label: menu.userManagement
# Icon type: Material Symbols
# Icon name: group
# Run prepare: yes
```

This creates a complete user management layer with all necessary files and menu integration.

## 🤝 Contributing

To extend the CLI:

1. Add new templates to the `templates` object
2. Extend the interactive prompts in `main()`
3. Add new layer types in `getLayerStructure()`
4. Update this documentation

## 📋 Requirements

- Node.js (ES modules support)
- pnpm package manager
- Nuxt 3 project structure