#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define sensible default colors for different types
const defaults = {
  // Text colors
  text: {
    light: '#24292f',
    dark: '#f0f6fc'
  },
  // Background colors
  background: {
    light: '#ffffff',
    dark: '#0d1117'
  },
  // Secondary background
  backgroundSecondary: {
    light: '#f6f8fa',
    dark: '#161b22'
  },
  // Accent/highlight colors
  accent: {
    light: '#DF7861',
    dark: '#64B5F6'
  },
  // Muted colors
  muted: {
    light: '#8b949e',
    dark: '#656d76'
  },
  // Border/outline colors
  border: {
    light: '#d1d9e0',
    dark: '#30363d'
  }
};

// Function to determine appropriate default based on setting name
function getDefaultsForSetting(settingName) {
  const name = settingName.toLowerCase();
  
  if (name.includes('text') || name.includes('font') || name.includes('color') && !name.includes('bg') && !name.includes('background')) {
    return defaults.text;
  } else if (name.includes('bg') || name.includes('background')) {
    if (name.includes('secondary') || name.includes('container')) {
      return defaults.backgroundSecondary;
    }
    return defaults.background;
  } else if (name.includes('accent') || name.includes('active') || name.includes('highlight') || name.includes('focus')) {
    return defaults.accent;
  } else if (name.includes('muted') || name.includes('faint')) {
    return defaults.muted;
  } else if (name.includes('border') || name.includes('outline') || name.includes('frame')) {
    return defaults.border;
  } else {
    // Default fallback
    return defaults.text;
  }
}

// Process a file
function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Find all invalid defaults
  const lines = content.split('\n');
  const processedLines = lines.map((line, index) => {
    if (line.trim().match(/default-light:\s*'#'\s*$/) || line.trim().match(/default-dark:\s*'#'\s*$/)) {
      // Look backwards to find the setting ID
      let settingId = '';
      for (let i = index - 1; i >= 0; i--) {
        const match = lines[i].match(/id:\s*(.+)/);
        if (match) {
          settingId = match[1].trim();
          break;
        }
      }
      
      const defaultColors = getDefaultsForSetting(settingId);
      
      if (line.includes('default-light:')) {
        modified = true;
        return line.replace(/default-light:\s*'#'\s*$/, `default-light: '${defaultColors.light}'`);
      } else if (line.includes('default-dark:')) {
        modified = true;
        return line.replace(/default-dark:\s*'#'\s*$/, `default-dark: '${defaultColors.dark}'`);
      }
    }
    return line;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, processedLines.join('\n'));
    console.log(`✓ Fixed ${filePath}`);
  } else {
    console.log(`- No changes needed in ${filePath}`);
  }
}

// Process all style-settings files
const styleSettingsDir = path.join(__dirname, 'src', 'style-settings');
const files = ['editor.scss', 'plugin.scss', 'workspace.scss', 'basic.scss'];

files.forEach(file => {
  const filePath = path.join(styleSettingsDir, file);
  if (fs.existsSync(filePath)) {
    processFile(filePath);
  }
});

console.log('Done!');
