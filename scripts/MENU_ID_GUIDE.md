# Menu ID Input Guide

## 🎯 Overview

The Nuxt Layer CLI now supports comprehensive **Menu ID input** with advanced validation and conflict detection. Users can specify custom menu identifiers when creating layers with menu integration.

## 🚀 How It Works

When creating a layer with menu integration, the CLI will prompt:

```
📝 Include app.config.ts for menu integration? (y/N): y

ℹ️  Configure menu settings:
⚠️  Menu ID should be unique and descriptive (e.g., "user-management", "data-analytics")
⚠️  Leave empty to use layer name as default

📝 Menu ID (default: my_layer): user-management
📝 Menu name (default: my_layer): User Management
📝 Menu label for i18n (default: menu.my_layer): adminMenu.users
```

## ✅ Validation Features

### 1. **Format Validation**
- Must start with lowercase letter
- Only lowercase letters, numbers, hyphens (-), and underscores (_) allowed
- Examples: ✅ `user-management` ✅ `data_analytics` ❌ `User-Management` ❌ `123-invalid`

### 2. **Conflict Detection**
- Scans all existing layers automatically
- Prevents duplicate menu IDs across the project
- Shows existing menu IDs when conflicts are detected

### 3. **Smart Defaults**
- Press Enter without input to use layer name as Menu ID
- Automatically converts layer_name format to menu-id format suggestions

### 4. **Real-time Feedback**
- Immediate validation with helpful error messages
- Clear guidance on what needs to be fixed
- Lists existing menu IDs when conflicts occur

## 📋 Current Menu IDs

The CLI automatically detects these existing menu IDs in your project:
- `admin-master-table` (company_master_table layer)
- `admin-user` (company_user layer)  
- `client-work-panel` (home layer)

## 🎨 Menu ID Best Practices

### Recommended Formats

**For Admin Features:**
```
admin-users
admin-settings  
admin-reports
admin-analytics
```

**For User Features:**
```
user-dashboard
user-profile
user-documents
user-preferences
```

**For Business Features:**
```
project-management
data-analytics
content-editor
workflow-designer
```

### Naming Conventions

| ✅ Good | ❌ Avoid | Why |
|---------|----------|-----|
| `user-management` | `UserManagement` | Use lowercase only |
| `data-analytics` | `data analytics` | No spaces |
| `content-editor` | `content@editor` | No special chars |
| `admin-dashboard` | `123-dashboard` | Start with letter |
| `my-feature` | `my--feature` | No double hyphens |

## 🛠️ Advanced Usage

### Menu Configuration Flow

1. **Layer Name**: Enter your layer name (e.g., `user_management`)
2. **Menu Integration**: Choose to include app.config.ts
3. **Menu ID**: Input custom ID (e.g., `admin-users`) or press Enter for default
4. **Menu Name**: Display name for the menu item
5. **i18n Label**: Internationalization key (e.g., `adminMenu.users`)
6. **Icon Selection**: Choose icon type and specific icon

### Example Complete Configuration

```bash
📝 Layer name: user_management
📝 Layer type: Full Layer
📝 Include app.config.ts? y
📝 Menu ID: admin-users
📝 Menu name: User Management
📝 Menu label: adminMenu.users
📝 Icon type: Material Symbols
📝 Icon name: group
```

**Generated app.config.ts:**
```typescript
export default defineAppConfig({
  appMenu: {
    "admin-users": {
      id: "admin-users",
      name: 'User Management',
      label: "adminMenu.users",
      icon: "material-symbols:group",
      hoverIcon: "material-symbols:group",
      component: "LazyUserManagement",  // PascalCase component name
      feature: "CORE",
      props: {},
    },
  }
})
```

**Generated Structure:**
```
user_management/                           # snake_case layer folder
├── components/global/userManagement/index.vue # camelCase component folder
├── pages/userManagement/index.vue            # camelCase page folder
├── composables/useUserManagement.ts          # camelCase composable
├── utils/userManagementUtils.ts              # camelCase utils
├── nuxt.config.ts
├── tsconfig.json
└── app.config.ts
```

## 🔍 Troubleshooting

### Common Issues

**"Menu ID already exists"**
- Choose a different, unique identifier
- Check the list of existing menu IDs shown in the error
- Consider using prefixes like `admin-`, `user-`, `client-`

**"Invalid format"**
- Use only lowercase letters, numbers, hyphens, and underscores
- Start with a lowercase letter
- Avoid spaces and special characters

**"Conflict with existing layer"**
- The Menu ID matches an existing layer name
- You can proceed anyway or choose a different ID
- Consider using a more specific identifier

### Tips for Success

1. **Plan Ahead**: Think about your menu structure before creating layers
2. **Use Prefixes**: Group related features with prefixes (`admin-`, `user-`, etc.)
3. **Be Descriptive**: Use clear, meaningful names that describe the feature
4. **Check Existing**: Review current menu IDs to avoid conflicts
5. **Follow Patterns**: Use consistent naming patterns across your project

## 📖 Related Documentation

- [CLI Quick Reference](QUICK_REFERENCE.md)
- [Full CLI Documentation](README.md)
- [Layer Management Guide](README.md#-layer-management-features)

---

**Need Help?** Run `pnpm run create:layer --help` for quick assistance or check the full documentation for comprehensive guidance.