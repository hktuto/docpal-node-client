# Docpal Node Client

A modular monorepo-based Node.js client project for managing documentation and web interfaces for the Docpal platform. Built with Nuxt 3, Vue 3, and TypeScript using a layered architecture approach.

## 🚀 Quick Start

### Prerequisites

- Node.js (compatible with Nuxt 3)
- pnpm v10.14.0

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd docpal-node-client

# Install dependencies
pnpm install

# Generate API client
pnpm run getApi

# Start development server
pnpm run dev
```

## 📁 Project Structure

```
docpal-node-client/
├── apps/
│   ├── docs/                 # Documentation site (Nuxt Content)
│   └── web/                  # Main web application (Nuxt 3)
│       ├── app/              # Application core
│       ├── layers/           # Modular Nuxt layers
│       │   ├── auth/         # Authentication layer
│       │   ├── browse/       # Browse functionality
│       │   ├── company_*/    # Company management layers
│       │   ├── home/         # Home dashboard
│       │   └── tabs/         # Tab management system
│       ├── i18n/             # Internationalization
│       └── test/             # Test files
├── libraries/
│   ├── api/                  # API client generation
│   └── eventbus/             # Event bus system
└── scripts/                  # Development CLI tools
    ├── create-layer.js       # Layer creation CLI
    ├── manage-layers.js      # Layer management CLI
    └── README.md            # CLI documentation
```

## 🛠️ Development CLI Tools

This project includes powerful CLI tools to streamline development:

### Layer Creation
```bash
# Interactive layer creation with advanced features:
# - Multiple layer types (component, page, full, minimal)
# - Custom Menu ID input with validation and conflict detection
# - Automatic template generation with TypeScript support
# - Icon selection and i18n integration
# - Auto-prepare option
pnpm run create:layer
```

### Layer Management
```bash
# List all layers
pnpm run layers:list

# Detailed layer information
pnpm run manage:layers list --detailed

# Analyze specific layer
pnpm run layers:analyze <layer-name>

# Delete layer (with confirmation)
pnpm run manage:layers delete <layer-name> --force
```

See [`scripts/README.md`](scripts/README.md) for comprehensive CLI documentation.

## 📦 Available Scripts

### Development
```bash
pnpm run dev              # Start web app development server
pnpm run web:build        # Build web application
pnpm run web:generate     # Generate static site
pnpm run web:preview      # Preview built application
```

### API Management
```bash
pnpm run getApi           # Generate API client from OpenAPI spec
```

### Layer Management
```bash
pnpm run create:layer     # Create new Nuxt layer
pnpm run layers:list      # List all layers
pnpm run layers:analyze   # Analyze layer structure
pnpm run manage:layers    # General layer management
```

### Testing
```bash
cd apps/web
pnpm run test            # Run tests
pnpm run test:watch      # Run tests in watch mode
pnpm run test:ui         # Run tests with UI
pnpm run test:coverage   # Generate coverage report
```

## 🏗️ Architecture

### Layered Modular Architecture
- **Monorepo**: PNPM workspaces for dependency management
- **Nuxt Layers**: Modular feature separation
- **Component Composition**: Vue 3 Composition API
- **Type Safety**: Full TypeScript integration
- **Event-Driven**: Custom event bus system

### Technology Stack
- **Frontend**: Vue 3, Nuxt 3, TypeScript
- **Styling**: SCSS, Element Plus UI library
- **State Management**: Composables and Pinia
- **Testing**: Vitest, Vue Test Utils
- **Build Tools**: Nuxt CLI, Vite
- **Package Manager**: pnpm

### Key Features
- **Server-Side Rendering (SSR)** with Nuxt 3
- **Internationalization (i18n)** with multi-language support
- **Authentication & Authorization** with role-based access
- **API Client Generation** from OpenAPI specifications
- **Tab Management System** for multi-workspace navigation
- **Server Health Monitoring** with auto-recovery
- **Responsive Design** with Element Plus components

## 🌐 Applications

### Web Application (`apps/web`)
Main web interface built with Nuxt 3:
- Dashboard and workspace management
- User authentication and authorization
- Multi-language support (en-US, zh-CN, zh-HK)
- Modular layer-based architecture
- Real-time server health monitoring

### Documentation Site (`apps/docs`)
Content-driven documentation using Nuxt Content:
- API documentation
- Development guides
- Architecture documentation
- Version-specific content management

## 📚 Development Guide

### Adding New Features
1. Use the CLI to create a new layer: `pnpm run create:layer`
2. Implement components, pages, or composables as needed
3. Add internationalization keys to language files
4. Write tests for new functionality
5. Update documentation

### Layer Development
Each layer is self-contained with:
- **Components**: Reusable UI components
- **Pages**: Route-specific pages
- **Composables**: Business logic and state management
- **Utils**: Helper functions and utilities
- **Configuration**: Nuxt and app configuration

### Best Practices
- Follow TypeScript strict mode
- Use Element Plus for UI components
- Implement proper error handling
- Write comprehensive tests
- Document new features
- Use semantic commit messages

## 🧪 Testing

The project uses Vitest for unit testing:
- Component testing with Vue Test Utils
- Composable testing
- Utility function testing
- UI interaction testing

See [`apps/web/test/README.md`](apps/web/test/README.md) for testing guidelines.

## 🌍 Internationalization

Multi-language support with:
- **Languages**: English (en-US), Simplified Chinese (zh-CN), Traditional Chinese (zh-HK)
- **Implementation**: @nuxtjs/i18n
- **Structure**: JSON language files in `apps/web/i18n/locales/`

## 📖 Documentation

- **CLI Tools**: [`scripts/README.md`](scripts/README.md)
- **Web App**: [`apps/web/README.md`](apps/web/README.md)
- **API Library**: [`libraries/api/README.md`](libraries/api/README.md)
- **Event Bus**: [`libraries/eventbus/README.md`](libraries/eventbus/README.md)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes following the coding standards
3. Add/update tests as needed
4. Update documentation
5. Submit a pull request

## 📄 License

[Add your license information here]

---

Built with ❤️ using Vue 3, Nuxt 3, and TypeScript