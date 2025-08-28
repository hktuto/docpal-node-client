#!/usr/bin/env node

import { readdir, stat, rm } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Get layer information
async function getLayerInfo(layerPath) {
  const info = {
    name: path.basename(layerPath),
    path: layerPath,
    size: 0,
    files: [],
    hasNuxtConfig: false,
    hasAppConfig: false,
    hasComponents: false,
    hasPages: false,
    hasComposables: false,
    hasUtils: false,
  };

  try {
    const items = await readdir(layerPath, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(layerPath, item.name);
      
      if (item.isFile()) {
        const stats = await stat(itemPath);
        info.size += stats.size;
        info.files.push(item.name);
        
        // Check for specific files
        if (item.name === 'nuxt.config.ts') info.hasNuxtConfig = true;
        if (item.name === 'app.config.ts') info.hasAppConfig = true;
      } else if (item.isDirectory()) {
        // Check for specific directories
        if (item.name === 'components') info.hasComponents = true;
        if (item.name === 'pages') info.hasPages = true;
        if (item.name === 'composables') info.hasComposables = true;
        if (item.name === 'utils') info.hasUtils = true;
        
        // Calculate directory size
        const dirStats = await getDirSize(itemPath);
        info.size += dirStats;
      }
    }
  } catch (err) {
    warning(`Could not read layer info for ${info.name}: ${err.message}`);
  }

  return info;
}

async function getDirSize(dirPath) {
  let size = 0;
  try {
    const items = await readdir(dirPath, { withFileTypes: true });
    for (const item of items) {
      const itemPath = path.join(dirPath, item.name);
      if (item.isFile()) {
        const stats = await stat(itemPath);
        size += stats.size;
      } else if (item.isDirectory()) {
        size += await getDirSize(itemPath);
      }
    }
  } catch (err) {
    // Ignore errors for individual directories
  }
  return size;
}

// Format file size
function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// List all layers
async function listLayers(detailed = false) {
  const layersPath = path.join(__dirname, '../apps/web/layers');
  
  if (!existsSync(layersPath)) {
    error('Layers directory not found');
    return;
  }

  try {
    const items = await readdir(layersPath, { withFileTypes: true });
    const layers = items.filter(item => item.isDirectory());
    
    if (layers.length === 0) {
      warning('No layers found');
      return;
    }

    log('📁 Available Layers:', colors.bright + colors.blue);
    log('==================', colors.blue);

    for (const layer of layers) {
      const layerPath = path.join(layersPath, layer.name);
      
      if (detailed) {
        const info = await getLayerInfo(layerPath);
        log(`\n🔸 ${info.name}`, colors.bright + colors.cyan);
        log(`   Path: layers/${info.name}`);
        log(`   Size: ${formatSize(info.size)}`);
        
        const features = [];
        if (info.hasNuxtConfig) features.push('nuxt.config');
        if (info.hasAppConfig) features.push('app.config');
        if (info.hasComponents) features.push('components');
        if (info.hasPages) features.push('pages');
        if (info.hasComposables) features.push('composables');
        if (info.hasUtils) features.push('utils');
        
        log(`   Features: ${features.join(', ') || 'none'}`);
        log(`   Files: ${info.files.length}`);
      } else {
        log(`  🔸 ${layer.name}`);
      }
    }
    
    log(`\nTotal layers: ${layers.length}`, colors.bright);
    
  } catch (err) {
    error(`Failed to list layers: ${err.message}`);
  }
}

// Analyze layer structure
async function analyzeLayer(layerName) {
  const layerPath = path.join(__dirname, '../apps/web/layers', layerName);
  
  if (!existsSync(layerPath)) {
    error(`Layer "${layerName}" not found`);
    return;
  }

  const info = await getLayerInfo(layerPath);
  
  log(`🔍 Layer Analysis: ${layerName}`, colors.bright + colors.magenta);
  log('==========================', colors.magenta);
  
  log(`\n📊 Basic Information:`, colors.bright);
  log(`   Name: ${info.name}`);
  log(`   Path: apps/web/layers/${info.name}`);
  log(`   Size: ${formatSize(info.size)}`);
  log(`   Files: ${info.files.length}`);
  
  log(`\n🏗️  Structure:`, colors.bright);
  log(`   ✅ Nuxt Config: ${info.hasNuxtConfig ? 'Yes' : 'No'}`);
  log(`   ${info.hasAppConfig ? '✅' : '❌'} App Config: ${info.hasAppConfig ? 'Yes' : 'No'}`);
  log(`   ${info.hasComponents ? '✅' : '❌'} Components: ${info.hasComponents ? 'Yes' : 'No'}`);
  log(`   ${info.hasPages ? '✅' : '❌'} Pages: ${info.hasPages ? 'Yes' : 'No'}`);
  log(`   ${info.hasComposables ? '✅' : '❌'} Composables: ${info.hasComposables ? 'Yes' : 'No'}`);
  log(`   ${info.hasUtils ? '✅' : '❌'} Utils: ${info.hasUtils ? 'Yes' : 'No'}`);
  
  log(`\n📄 Files:`, colors.bright);
  info.files.forEach(file => {
    log(`   • ${file}`);
  });

  // Check for potential issues
  log(`\n🔍 Health Check:`, colors.bright);
  const issues = [];
  
  if (!info.hasNuxtConfig) {
    issues.push('Missing nuxt.config.ts');
  }
  
  if (info.files.length === 0) {
    issues.push('No files found');
  }
  
  if (issues.length === 0) {
    success('No issues found');
  } else {
    issues.forEach(issue => warning(issue));
  }
}

// Delete layer
async function deleteLayer(layerName, force = false) {
  const layerPath = path.join(__dirname, '../apps/web/layers', layerName);
  
  if (!existsSync(layerPath)) {
    error(`Layer "${layerName}" not found`);
    return;
  }

  if (!force) {
    warning(`This will permanently delete the layer "${layerName}" and all its contents.`);
    log('Use --force flag to confirm deletion.', colors.yellow);
    return;
  }

  try {
    await rm(layerPath, { recursive: true, force: true });
    success(`Layer "${layerName}" deleted successfully`);
  } catch (err) {
    error(`Failed to delete layer: ${err.message}`);
  }
}

// Show help
function showHelp() {
  log('🛠️  Layer Management CLI', colors.bright + colors.magenta);
  log('=======================', colors.magenta);
  log('\nUsage:', colors.bright);
  log('  pnpm run manage:layers <command> [options]');
  log('  node scripts/manage-layers.js <command> [options]');
  
  log('\nCommands:', colors.bright);
  log('  list, ls                   # List all layers');
  log('  list --detailed, ls -d     # List layers with detailed info');
  log('  analyze <layer-name>       # Analyze specific layer');
  log('  delete <layer-name>        # Delete layer (requires --force)');
  log('  delete <layer-name> --force # Force delete layer');
  log('  help, --help, -h           # Show this help message');
  
  log('\nExamples:', colors.bright);
  log('  pnpm run manage:layers list');
  log('  pnpm run manage:layers analyze auth');
  log('  pnpm run manage:layers delete old_layer --force');
  
  log('\nOptions:', colors.bright);
  log('  --detailed, -d             # Show detailed information');
  log('  --force, -f                # Force operation without confirmation');
  log('  --help, -h                 # Show help message');
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h') || args.includes('help')) {
    showHelp();
    return;
  }

  const command = args[0];
  const options = args.slice(1);

  switch (command) {
    case 'list':
    case 'ls':
      const detailed = options.includes('--detailed') || options.includes('-d');
      await listLayers(detailed);
      break;

    case 'analyze':
      if (options.length === 0) {
        error('Please specify a layer name to analyze');
        return;
      }
      await analyzeLayer(options[0]);
      break;

    case 'delete':
      if (options.length === 0) {
        error('Please specify a layer name to delete');
        return;
      }
      const layerName = options[0];
      const force = options.includes('--force') || options.includes('-f');
      await deleteLayer(layerName, force);
      break;

    default:
      error(`Unknown command: ${command}`);
      log('Use --help to see available commands', colors.yellow);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main as manageLayers };