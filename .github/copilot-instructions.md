# Maple Obsidian Theme - AI Coding Agent Instructions

## Project Overview
Maple is an Obsidian desktop theme built with SCSS, featuring dynamic theming, custom components, and Style Settings integration. The theme emphasizes visual polish with smooth animations, blur effects, and a custom monospace font (Maple Mono).

## Architecture & File Structure

### SCSS Module System
- **Entry point**: `src/index.scss` - imports all modules using `@use` syntax
- **Core modules**: `variable.scss` (CSS custom properties), `fonts.scss`, `utils.scss`
- **Feature directories**: `editor/`, `workspace/`, `plugins/`, `style-settings/`, `mobile/`
- **Each directory has `_index.scss`** that imports all files in that directory

### CSS Custom Properties Pattern
All theming uses HSL-based custom properties defined in `src/variable.scss`:
```scss
--accent-h: var(--setting-accent-h-dark, 207) // Hue only from Style Settings
--accent-s: 32% !important; // Fixed saturation
--accent-l: 58% !important; // Fixed lightness
```

### Style Settings Integration
Theme extensively uses Style Settings plugin for user customization:
- Settings defined in `src/style-settings/` with CSS comments for plugin parsing
- Variable naming: `--setting-{feature}-{property}-{theme}` (e.g., `--setting-accent-h-dark`)
- Only hue values are user-customizable; saturation/lightness are design-controlled

## Development Workflow

### Default: Build & Release (BRAT Compatible)
**Primary workflow** - always use unless explicitly doing live development:
```bash
pnpm build              # Compile src/index.scss → theme.css + copy to vaults
```
- **Automated releases**: Push to main branch triggers GitHub Actions workflow
- **BRAT compatible**: Maintains `versions.json` and release assets for auto-updates
- **Version management**: GitHub Actions auto-bumps patch version and syncs across files
- Manual release: `pnpm release` for local version bumping

### Live Development (Optional)
Only use when explicitly requested for active development:
```bash
pnpm dev                 # Watch src/index.scss → dev vault CSS snippet
pnpm dev:test           # Watch src/snippets/test.scss for isolated testing
```
**Critical**: Dev script compiles to `{devVaultRoot}/.obsidian/snippets/` as CSS snippet, not theme file. Requires personal vault path in `scripts/dev.mjs` (line 8).

### BRAT Integration
- **versions.json**: Maps theme versions to minimum Obsidian versions
- **GitHub Releases**: Automated with `theme.css` and `manifest.json` assets
- **Auto-updates**: Users get automatic updates via BRAT plugin
- **Version sync**: `scripts/version.mjs` keeps package.json, manifest.json, and embedded strings in sync

### Manual Vault Setup (Optional)
For local development vault copying, create `scripts/dir.mjs`:
```javascript
export default [
  '/path/to/vault1',
  '/path/to/vault2'
]
```

## Plugin Integration Patterns

### Plugin-Specific Styling
Each plugin gets dedicated SCSS file in `src/plugins/`:
- Use plugin-specific class selectors (e.g., `.kanban-plugin`, `.better-command-palette`)
- Import in `src/plugins/_index.scss` with descriptive comments
- **Common pattern**: Override plugin variables with theme's custom properties

### Third-Party Plugin Support
Currently supports 15+ plugins including:
- **Dataview**: Table styling, query result formatting
- **Kanban**: Board layout, card styling  
- **Better Command Palette**: Blur effects, custom styling
- **Calendar**: Date highlighting, theme integration
- **Git**: Status indicators, diff highlighting

## Key Component Patterns

### Animation System
Consistent animation variables in `variable.scss`:
- `--animation`: Standard 200ms transitions
- `--animation-slow`: 400ms for complex transitions  
- `--animation-delay`: Staggered animations (600ms)
- Use `var(--anim-motion-smooth)` for easing

### Blur Effects
Backdrop-filter pattern for modern glass morphism:
```scss
backdrop-filter: blur(var(--setting-blur-strength, 20px));
background: hsla(var(--background-primary-hsl), var(--setting-blur-opacity, 0.8));
```

### Dynamic Theme Colors
Theme generates color variations programmatically:
- `@mixin var-color($name, $color)` creates RGB + alpha variants
- HSL manipulation for hover states: `calc(var(--accent-l) + 4%)`
- Separate light/dark theme configurations

## Testing & Debugging

### Isolated Component Testing
- Use `src/snippets/test.scss` for experimental features
- Run `pnpm dev:test` to compile test snippet to development vault
- Create test content in vault using `scripts/dev.mjs` generated markdown

### Style Settings Testing
- Install Style Settings plugin in development vault
- Theme creates sample setting UI in Settings > Style Settings > Maple
- Test color variations by changing only hue values (saturation/lightness are fixed)

### Cross-Plugin Compatibility
- Test with common plugin combinations (Dataview + Kanban, Calendar + Better Command Palette)
- Check for CSS specificity conflicts in plugin overrides
- Verify theme variables don't break plugin functionality

## Common Tasks

### Adding New Plugin Support
1. Create `src/plugins/plugin-name.scss`
2. Add `@use './plugin-name.scss';` to `src/plugins/_index.scss`  
3. Use plugin's root class as selector namespace
4. Override plugin CSS custom properties with theme equivalents

### Adding Style Settings Options
1. Add CSS comment block in relevant SCSS file with Style Settings syntax
2. Use `--setting-{feature}-{property}-{theme}` naming convention
3. Provide fallback values: `var(--setting-feature-prop, defaultValue)`
4. Test in Style Settings UI after rebuilding

### Version Updates
- **Automated via GitHub Actions**: Push to main branch auto-bumps patch version
- **BRAT compatibility**: Maintains `versions.json` (version → minAppVersion mapping)
- **Manual version updates**: Only update `package.json` version, other files sync automatically
- **Release assets**: GitHub workflow creates releases with `theme.css` and `manifest.json` for BRAT
- Ensure `manifest.json` minAppVersion matches Obsidian compatibility
