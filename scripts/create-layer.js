#!/usr/bin/env node

import { mkdir, writeFile, readdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ Error: ${message}`, colors.red);
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function warning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

// Templates for different files
const templates = {
  'nuxt.config.ts': `// https://nuxt.com/docs/api/configuration/nuxt-config

import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-08-24',
  ssr: false,
})
`,

  'tsconfig.json': `{
  "extends": "../../.nuxt/tsconfig.json"
}
`,

  'app.config.ts': (layerName, componentName, menuConfig) => `export default defineAppConfig({
  appMenu: {
    "${menuConfig.id}": {
      id: "${menuConfig.id}",
      name: '${menuConfig.name}',
      label: "${menuConfig.label}",
      icon: "${menuConfig.icon}",
      hoverIcon: "${menuConfig.hoverIcon}",
      component: "${componentName}",
      feature: "CORE",
      props: {},
    },
  }
})
`,

  'component.vue': (componentName) => `<template>
  <div class="${componentName.toLowerCase()}-container">
    <h1>{{ $t('${componentName.toLowerCase()}.title') }}</h1>
    <p>{{ $t('${componentName.toLowerCase()}.description') }}</p>
  </div>
</template>

<script setup lang="ts">
// Component logic here
</script>

<style scoped lang="scss">
.${componentName.toLowerCase()}-container {
  padding: 20px;
  
  h1 {
    margin-bottom: 16px;
    color: var(--el-text-color-primary);
  }
  
  p {
    color: var(--el-text-color-regular);
  }
}
</style>
`,

  'page.vue': (layerName) => `<template>
  <div class="${layerName}-page">
    <h1>{{ $t('${layerName}.title') }}</h1>
    <!-- Page content here -->
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>

<style scoped lang="scss">
.${layerName}-page {
  padding: 20px;
}
</style>
`,

  'composable.ts': (layerName, camelCaseComponentName) => `import { ref, computed } from 'vue'

/**
 * Composable for ${layerName} functionality
 */
export const use${camelCaseComponentName.charAt(0).toUpperCase() + camelCaseComponentName.slice(1)} = () => {
  const isLoading = ref(false)
  
  const doSomething = async () => {
    isLoading.value = true
    try {
      // Implementation here
      await new Promise(resolve => setTimeout(resolve, 1000))
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    isLoading: readonly(isLoading),
    doSomething
  }
}
`,

  'utils.ts': (layerName, camelCaseComponentName) => `/**
 * Utility functions for ${layerName} layer
 */

export const ${camelCaseComponentName}Utils = {
  /**
   * Format data for display
   */
  formatData: (data: any) => {
    return data
  },
  
  /**
   * Validate input
   */
  validate: (input: string): boolean => {
    return input.length > 0
  }
}
`
};

// Interactive prompts
async function prompt(question) {
  process.stdout.write(`${colors.cyan}${question}${colors.reset} `);
  
  return new Promise((resolve) => {
    let input = '';
    
    const onData = (chunk) => {
      const char = chunk.toString();
      
      if (char === '\n' || char === '\r') {
        process.stdout.write('\n');
        process.stdin.removeListener('data', onData);
        resolve(input.trim());
      } else if (char === '\u0003') { // Ctrl+C
        process.stdout.write('\n');
        process.exit(0);
      } else if (char === '\u007f') { // Backspace
        if (input.length > 0) {
          input = input.slice(0, -1);
          process.stdout.write('\b \b');
        }
      } else if (char >= ' ' && char <= '~') { // Printable characters
        input += char;
        process.stdout.write(char);
      }
    };
    
    process.stdin.on('data', onData);
  });
}

async function promptSelect(question, options) {
  log(question, colors.cyan);
  options.forEach((option, index) => {
    log(`  ${index + 1}. ${option}`);
  });
  
  const answer = await prompt('Select an option (number):');
  const index = parseInt(answer) - 1;
  
  if (index >= 0 && index < options.length) {
    return options[index];
  } else {
    error('Invalid selection. Please try again.');
    return promptSelect(question, options);
  }
}

async function confirmAction(message) {
  const answer = await prompt(`${message} (y/N):`);
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

// Layer creation functions
async function createDirectory(dirPath) {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
    success(`Created directory: ${dirPath}`);
  } else {
    warning(`Directory already exists: ${dirPath}`);
  }
}

async function createFile(filePath, content) {
  if (!existsSync(filePath)) {
    await writeFile(filePath, content);
    success(`Created file: ${filePath}`);
  } else {
    const overwrite = await confirmAction(`File ${filePath} already exists. Overwrite?`);
    if (overwrite) {
      await writeFile(filePath, content);
      success(`Overwrote file: ${filePath}`);
    } else {
      warning(`Skipped file: ${filePath}`);
    }
  }
}

async function getLayerStructure() {
  const structureType = await promptSelect(
    'What type of layer do you want to create?',
    [
      'Component Layer (with global components)',
      'Page Layer (with pages)',
      'Full Layer (components + pages + composables + utils)',
      'Minimal Layer (just config files)',
      'Custom Structure'
    ]
  );
  
  switch (structureType) {
    case 'Component Layer (with global components)':
      return ['components'];
    case 'Page Layer (with pages)':
      return ['pages'];
    case 'Full Layer (components + pages + composables + utils)':
      return ['components', 'pages', 'composables', 'utils'];
    case 'Minimal Layer (just config files)':
      return [];
    case 'Custom Structure':
      const customStructure = [];
      const availableOptions = ['components', 'pages', 'composables', 'utils'];
      
      for (const option of availableOptions) {
        const include = await confirmAction(`Include ${option} folder?`);
        if (include) {
          customStructure.push(option);
        }
      }
      return customStructure;
    default:
      return [];
  }
}

async function getExistingMenuIds() {
  const layersPath = path.join(__dirname, '../apps/web/layers');
  const menuIds = new Set();
  
  try {
    const layers = await readdir(layersPath, { withFileTypes: true });
    
    for (const layer of layers) {
      if (layer.isDirectory()) {
        const appConfigPath = path.join(layersPath, layer.name, 'app.config.ts');
        if (existsSync(appConfigPath)) {
          try {
            const content = await readFile(appConfigPath, 'utf8');
            // Simple regex to extract menu IDs from app.config.ts
            const menuMatches = content.match(/["']([a-z-_]+)["']:\s*{[^}]*id:\s*["']([^"']+)["']/g);
            if (menuMatches) {
              menuMatches.forEach(match => {
                const idMatch = match.match(/["']([a-z-_]+)["']/);
                if (idMatch) {
                  menuIds.add(idMatch[1]);
                }
              });
            }
          } catch (err) {
            // Ignore file read errors
          }
        }
      }
    }
  } catch (err) {
    // Ignore directory read errors
  }
  
  return Array.from(menuIds);
}

async function getMenuConfiguration(layerName) {
  const includeAppConfig = await confirmAction('Include app.config.ts for menu integration?');
  
  if (!includeAppConfig) {
    return null;
  }
  
  info('Configure menu settings:');
  log('  Menu ID should be unique and descriptive (e.g., "user-management", "data-analytics")', colors.yellow);
  log('  Leave empty to use layer name as default\n', colors.yellow);
  
  let id;
  do {
    id = await prompt(`Menu ID (default: ${layerName}):`);
    if (!id) {
      id = layerName;
      break;
    }
    
    // Validate menu ID format
    if (!/^[a-z][a-z0-9-_]*$/.test(id)) {
      error('Menu ID must start with lowercase letter and contain only lowercase letters, numbers, hyphens, and underscores');
      continue;
    }
    
    // Check for conflicts with existing menu IDs
    const existingMenuIds = await getExistingMenuIds();
    if (existingMenuIds.includes(id)) {
      error(`Menu ID "${id}" already exists in another layer`);
      info(`Existing menu IDs: ${existingMenuIds.join(', ')}`);
      continue;
    }
    
    // Check for potential conflicts with existing layers
    const existingLayers = await listExistingLayers();
    if (existingLayers.includes(id.replace(/-/g, '_'))) {
      const proceed = await confirmAction(`Menu ID "${id}" might conflict with existing layer. Continue anyway?`);
      if (proceed) break;
    } else {
      break;
    }
  } while (true);
  
  const name = (await prompt(`Menu name (default: ${layerName}):`) || layerName);
  
  let label;
  do {
    label = await prompt(`Menu label for i18n (default: menu.${layerName}):`);
    if (!label) {
      label = `menu.${layerName}`;
      break;
    }
    
    // Validate i18n key format
    if (!/^[a-zA-Z][a-zA-Z0-9._-]*$/.test(label)) {
      error('Menu label should be a valid i18n key (e.g., "menu.feature", "adminMenu.users")');
      continue;
    }
    break;
  } while (true);
  
  const iconType = await promptSelect(
    'Choose icon type:',
    [
      'Material Symbols (material-symbols:icon-name)',
      'Element Plus (ep:icon-name)',
      'Custom DP Icon (dp-icon:icon-name)',
      'Custom icon string'
    ]
  );
  
  let icon, hoverIcon;
  
  switch (iconType) {
    case 'Material Symbols (material-symbols:icon-name)':
      const materialIcon = await prompt('Icon name (e.g., dashboard):');
      icon = hoverIcon = `material-symbols:${materialIcon}`;
      break;
    case 'Element Plus (ep:icon-name)':
      const epIcon = await prompt('Icon name (e.g., user):');
      icon = hoverIcon = `ep:${epIcon}`;
      break;
    case 'Custom DP Icon (dp-icon:icon-name)':
      const dpIcon = await prompt('Icon name (e.g., user):');
      icon = hoverIcon = `dp-icon:${dpIcon}`;
      break;
    case 'Custom icon string':
      icon = await prompt('Icon string:');
      hoverIcon = await prompt('Hover icon string (same as icon):') || icon;
      break;
  }
  
  return { id, name, label, icon, hoverIcon };
}

async function createLayerStructure(layerName, layerPath, structure, menuConfig) {
  // Convert snake_case layer name to camelCase for component names
  const camelCaseComponentName = layerName.split('_').map((part, index) => 
    index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
  ).join('');
  const componentName = `Lazy${camelCaseComponentName.charAt(0).toUpperCase() + camelCaseComponentName.slice(1)}`;
  
  // Create base configuration files
  await createFile(
    path.join(layerPath, 'nuxt.config.ts'),
    templates['nuxt.config.ts']
  );
  
  await createFile(
    path.join(layerPath, 'tsconfig.json'),
    templates['tsconfig.json']
  );
  
  // Create app.config.ts if menu configuration is provided
  if (menuConfig) {
    await createFile(
      path.join(layerPath, 'app.config.ts'),
      templates['app.config.ts'](layerName, componentName, menuConfig)
    );
  }
  
  // Create structure-specific directories and files
  for (const folder of structure) {
    const folderPath = path.join(layerPath, folder);
    await createDirectory(folderPath);
    
    switch (folder) {
      case 'components':
        // Create global component structure with camelCase component folder name
        const globalPath = path.join(folderPath, 'global', camelCaseComponentName);
        await createDirectory(globalPath);
        await createFile(
          path.join(globalPath, 'index.vue'),
          templates['component.vue'](componentName)
        );
        break;
        
      case 'pages':
        // Create page structure using camelCase for folder name
        const pagePath = path.join(folderPath, camelCaseComponentName);
        await createDirectory(pagePath);
        await createFile(
          path.join(pagePath, 'index.vue'),
          templates['page.vue'](layerName)
        );
        break;
        
      case 'composables':
        // Use camelCase for composable names
        await createFile(
          path.join(folderPath, `use${camelCaseComponentName.charAt(0).toUpperCase() + camelCaseComponentName.slice(1)}.ts`),
          templates['composable.ts'](layerName, camelCaseComponentName)
        );
        break;
        
      case 'utils':
        // Use camelCase for utility names
        await createFile(
          path.join(folderPath, `${camelCaseComponentName}Utils.ts`),
          templates['utils.ts'](layerName, camelCaseComponentName)
        );
        break;
    }
  }
}

async function runNuxtPrepare() {
  const shouldRunPrepare = await confirmAction('Run "pnpm run prepare" after layer creation?');
  
  if (shouldRunPrepare) {
    info('Running pnpm run prepare...');
    try {
      const webAppPath = path.join(__dirname, '../apps/web');
      const { stdout, stderr } = await execAsync('pnpm run prepare', { 
        cwd: webAppPath,
        timeout: 60000 
      });
      
      if (stdout) {
        log(stdout);
      }
      if (stderr) {
        warning(stderr);
      }
      
      success('Successfully ran pnpm run prepare');
    } catch (error) {
      error(`Failed to run prepare: ${error.message}`);
    }
  }
}

async function listExistingLayers() {
  const layersPath = path.join(__dirname, '../apps/web/layers');
  try {
    const layers = await readdir(layersPath, { withFileTypes: true });
    const layerDirs = layers.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
    
    if (layerDirs.length > 0) {
      info('Existing layers:');
      layerDirs.forEach(layer => log(`  • ${layer}`));
    }
    
    return layerDirs;
  } catch (error) {
    error(`Could not read layers directory: ${error.message}`);
    return [];
  }
}

async function validateLayerName(layerName, existingLayers) {
  if (!layerName || layerName.trim() === '') {
    error('Layer name cannot be empty');
    return false;
  }
  
  if (!/^[a-z][a-z0-9_]*$/.test(layerName)) {
    error('Layer name must start with lowercase letter and contain only lowercase letters, numbers, and underscores');
    return false;
  }
  
  if (existingLayers.includes(layerName)) {
    const overwrite = await confirmAction(`Layer "${layerName}" already exists. Continue anyway?`);
    return overwrite;
  }
  
  return true;
}

function showHelp() {
  log('🚀 Nuxt Layer Generator CLI', colors.bright + colors.magenta);
  log('================================', colors.magenta);
  log('\nUsage:', colors.bright);
  log('  pnpm run create:layer         # Interactive mode');
  log('  node scripts/create-layer.js  # Direct execution');
  log('  ./scripts/create-layer.js     # If executable');
  log('\nOptions:', colors.bright);
  log('  -h, --help                    # Show this help message');
  log('\nFeatures:', colors.bright);
  log('  • Interactive layer configuration');
  log('  • Multiple layer types (component, page, full, minimal)');
  log('  • Automatic menu integration');
  log('  • Template generation');
  log('  • Auto-prepare option');
  log('\nFor detailed documentation, see scripts/README.md');
}

// Main CLI function
async function main() {
  // Check for help flag
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showHelp();
    return;
  }
  
  log('🚀 Nuxt Layer Generator', colors.bright + colors.magenta);
  log('===============================', colors.magenta);
  log('Press Ctrl+C to exit at any time\n', colors.yellow);
  
  // Enable raw mode for interactive input
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  
  try {
    // List existing layers
    const existingLayers = await listExistingLayers();
    
    // Get layer name
    let layerName;
    do {
      layerName = await prompt('\n📝 Enter layer name (lowercase, e.g., "my_feature"):');
    } while (!(await validateLayerName(layerName, existingLayers)));
    
    // Get layer structure
    const structure = await getLayerStructure();
    
    // Get menu configuration
    const menuConfig = await getMenuConfiguration(layerName);
    
    // Create layer directory
    const layerPath = path.join(__dirname, '../apps/web/layers', layerName);
    await createDirectory(layerPath);
    
    // Create layer structure
    await createLayerStructure(layerName, layerPath, structure, menuConfig);
    
    // Run prepare
    await runNuxtPrepare();
    
    // Success message
    log('\n🎉 Layer created successfully!', colors.bright + colors.green);
    info(`Layer location: apps/web/layers/${layerName}`);
    
    if (structure.length > 0) {
      info('Created structure:');
      structure.forEach(folder => log(`  • ${folder}/`));
    }
    
    if (menuConfig) {
      info(`Menu integration: ${menuConfig.id} -> ${menuConfig.label}`);
    }
    
    log('\n📚 Next steps:', colors.bright + colors.blue);
    log('  1. Update your main nuxt.config.ts to include the new layer');
    log('  2. Add translations for your labels if using i18n');
    log('  3. Implement your component/page logic');
    log('  4. Test your layer integration');
    
  } catch (error) {
    error(`An error occurred: ${error.message}`);
    process.exit(1);
  } finally {
    if (process.stdin.isTTY && process.stdin.isRaw) {
      process.stdin.setRawMode(false);
    }
    process.stdin.pause();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main as createLayer };