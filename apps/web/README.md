# Nuxt v4 Web App

A basic Nuxt v4 application with internationalization (i18n) and color mode support.

## Features

- **Nuxt v4**: Latest version of Nuxt with Vue 3 and Vite
- **Internationalization**: Built-in i18n support with English and French
- **Color Mode**: Dark and light theme support with system preference detection
- **Tailwind CSS**: Utility-first CSS framework for styling
- **TypeScript**: Full TypeScript support

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm generate` - Generate static site
- `pnpm preview` - Preview production build

## Project Structure

```
apps/web/
├── assets/css/main.css    # Main CSS file with Tailwind imports
├── locales/               # i18n translation files
│   ├── en.json           # English translations
│   └── fr.json           # French translations
├── pages/                 # Vue pages
│   └── index.vue         # Home page
├── app.vue               # Main app component
├── nuxt.config.ts        # Nuxt configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
└── package.json          # Dependencies and scripts
```

## Configuration

- **i18n**: Configured with English and French locales, using prefix strategy
- **Color Mode**: System preference detection with light/dark theme toggle
- **Tailwind CSS**: Configured with dark mode support using class strategy
