// Biome configurations exports
// Note: These are JSON files that should be copied to the target project's root
// and used with the @biomejs/biome CLI

export const base = './base.json';
export const react = './react.json';
export const node = './node.json';
export const packageConfig = './package.json';

// Usage examples:
// For React apps: cp node_modules/@shared/config/biome/react.json ./biome.json
// For Node.js apps: cp node_modules/@shared/config/biome/node.json ./biome.json
// For packages: cp node_modules/@shared/config/biome/package.json ./biome.json