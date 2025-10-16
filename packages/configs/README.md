# @cocrepo/configs

Shared configuration files for TypeScript and build tools across the Cocrepo monorepo.

## Overview

`@cocrepo/configs` provides centralized TypeScript configurations that can be extended by all packages and applications. This ensures consistency in compiler settings, type checking, and build behavior.

## Features

- 📦 **Shared TypeScript Configs** - Base configurations for different project types
- 🔧 **Extensible** - Easy to extend and customize per package
- ⚡ **Optimized** - Configured for best performance and DX
- 🎯 **Type-Safe** - Strict settings for better code quality
- 🏗️ **Monorepo-Ready** - Designed for monorepo setups

## Installation

```bash
pnpm add @cocrepo/configs -D
```

## Available Configurations

### Base Config (`base.json`)

Base TypeScript configuration with common settings:

```json
{
  "extends": "@cocrepo/configs/base"
}
```

**Features:**
- Strict type checking enabled
- Modern ES2022 target
- ESM module system
- Source maps for debugging
- Path alias support

### React Config (`react.json`)

Configuration for React applications and libraries:

```json
{
  "extends": "@cocrepo/configs/react"
}
```

**Features:**
- JSX support with React 19
- React-specific compiler options
- Strict mode enabled
- Declaration files generation

### Node Config (`node.json`)

Configuration for Node.js applications and servers:

```json
{
  "extends": "@cocrepo/configs/node"
}
```

**Features:**
- CommonJS/ESM support
- Node.js types included
- Server-optimized settings
- Decorator support

## Usage

### Extending in Your Package

Create a `tsconfig.json` in your package:

```json
{
  "extends": "@cocrepo/configs/react",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Project-Specific Overrides

Override specific options while keeping shared config:

```json
{
  "extends": "@cocrepo/configs/base",
  "compilerOptions": {
    "strict": false,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Build Configuration

For build-specific tsconfig:

```json
{
  "extends": "@cocrepo/configs/react",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": true
  },
  "include": ["src"],
  "exclude": ["**/*.test.ts", "**/*.test.tsx"]
}
```

## Configuration Details

### Base Config Settings

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true
  }
}
```

### React Config Additions

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  }
}
```

### Node Config Additions

```json
{
  "compilerOptions": {
    "module": "CommonJS",
    "types": ["node"],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Common Patterns

### Monorepo Package

```json
{
  "extends": "@cocrepo/configs/base",
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true
  }
}
```

### Library Package

```json
{
  "extends": "@cocrepo/configs/react",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

### Application (No Build)

```json
{
  "extends": "@cocrepo/configs/react",
  "compilerOptions": {
    "noEmit": true
  }
}
```

## Path Aliases

Configure path aliases in your tsconfig:

```json
{
  "extends": "@cocrepo/configs/react",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["src/components/*"],
      "@/utils/*": ["src/utils/*"],
      "@/types/*": ["src/types/*"]
    }
  }
}
```

## Strict Mode Options

All configs enable strict mode by default:

- `strict: true` - Enable all strict type checking options
- `noImplicitAny: true` - Error on implied any types
- `strictNullChecks: true` - Strict null checking
- `strictFunctionTypes: true` - Strict function types
- `strictBindCallApply: true` - Strict bind/call/apply
- `noUnusedLocals: true` - Error on unused locals
- `noUnusedParameters: true` - Error on unused parameters

To relax strict mode:

```json
{
  "extends": "@cocrepo/configs/base",
  "compilerOptions": {
    "strict": false,
    "noUnusedLocals": false
  }
}
```

## Testing Configuration

For test files:

```json
{
  "extends": "@cocrepo/configs/react",
  "compilerOptions": {
    "types": ["vitest/globals", "jest", "@testing-library/jest-dom"]
  },
  "include": ["**/*.test.ts", "**/*.test.tsx"]
}
```

## Best Practices

1. **Extend, Don't Copy** - Always extend base configs
2. **Minimal Overrides** - Only override what's necessary
3. **Project References** - Use for monorepo dependencies
4. **Separate Configs** - Use different configs for build/test/dev
5. **Keep Strict** - Maintain strict mode for code quality

## Troubleshooting

### Type Errors After Extending

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache

# Reinstall dependencies
pnpm install
```

### Path Alias Not Working

Ensure `moduleResolution` is set correctly:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Build Performance

Enable incremental compilation:

```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}
```

## Contributing

When updating shared configs:

1. **Test thoroughly** - Verify with multiple packages
2. **Document changes** - Update this README
3. **Semantic versioning** - Breaking changes = major version
4. **Communicate** - Notify team of breaking changes
5. **Provide migration path** - Document upgrade steps

## Versioning

Config changes follow semantic versioning:

- **Major**: Breaking changes requiring code updates
- **Minor**: New features, backward compatible
- **Patch**: Bug fixes, non-breaking improvements

## Migration Guide

### Upgrading to New Config Version

```bash
# Update package
pnpm add @cocrepo/configs@latest -D

# Check for breaking changes
pnpm type-check

# Fix any type errors
```

## Dependencies

- `typescript` - TypeScript compiler (peer dependency)

## Peer Dependencies

- `typescript` ^5.0.0

## License

MIT
