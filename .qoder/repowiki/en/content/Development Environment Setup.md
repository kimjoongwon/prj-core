# Development Environment Setup

<cite>
**Referenced Files in This Document**   
- [README.md](file://README.md)
- [package.json](file://package.json)
- [pnpm-workspace.yaml](file://pnpm-workspace.yaml)
- [biome.json](file://biome.json)
- [turbo.json](file://turbo.json)
- [docker-compose.yaml](file://docker-compose.yaml)
- [apps/server/Dockerfile](file://apps/server/Dockerfile)
- [apps/server/package.json](file://apps/server/package.json)
- [apps/admin/package.json](file://apps/admin/package.json)
- [apps/mobile/package.json](file://apps/mobile/package.json)
- [apps/storybook/package.json](file://apps/storybook/package.json)
- [packages/ui/package.json](file://packages/ui/package.json)
- [packages/shared-api-client/package.json](file://packages/shared-api-client/package.json)
- [packages/shared-utils/package.json](file://packages/shared-utils/package.json)
- [packages/shared-vars/package.json](file://packages/shared-vars/package.json)
</cite>

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Monorepo Setup with pnpm Workspaces](#monorepo-setup-with-pnpm-workspaces)
4. [Code Formatting and Linting with Biome](#code-formatting-and-linting-with-biome)
5. [Task Orchestration with Turborepo](#task-orchestration-with-turborepo)
6. [Docker and Containerization Setup](#docker-and-containerization-setup)
7. [Application-Specific Configuration](#application-specific-configuration)
8. [Development Workflow](#development-workflow)
9. [Troubleshooting Common Setup Issues](#troubleshooting-common-setup-issues)
10. [Performance Considerations](#performance-considerations)

## Introduction

This document provides comprehensive guidance for setting up the development environment for the prj-core monorepo. The repository is structured as a full-stack monorepo using modern tooling including pnpm workspaces, Turborepo, Biome, and Docker. This setup enables efficient development across multiple applications and shared packages while maintaining consistency and performance.

The development environment supports three main applications: an admin interface (React/Vite), a mobile application (React Native/Expo), and a NestJS backend server. Additionally, there are several shared packages that provide common functionality across the applications. The setup process involves installing prerequisites, configuring the monorepo, and understanding the various tools used for code formatting, linting, and task orchestration.

**Section sources**

- [README.md](file://README.md#L1-L43)

## Prerequisites

Before setting up the development environment, ensure you have the following prerequisites installed on your system:

### Node.js

The project requires Node.js version 18 or higher. The server application's Dockerfile specifies Node.js 22, indicating compatibility with recent LTS versions. You can verify your Node.js version by running:

```bash
node --version
```

### pnpm

The monorepo uses pnpm as its package manager, as indicated by the `packageManager` field in the root `package.json` and various application package.json files. Install pnpm globally using one of the following methods:

```bash
# Using npm
npm install -g pnpm@10.13.1

# Using corepack (recommended)
corepack enable
corepack prepare pnpm@10.13.1 --activate
```

The specific version (10.13.1) is specified in the package.json files across the repository, ensuring consistency across development environments.

### Docker

Docker is required for containerized development, particularly for the server application. The presence of `Dockerfile` and `docker-compose.yaml` indicates that Docker is integral to the development workflow. Install Docker Desktop or Docker Engine based on your operating system.

### Additional Tools

While not strictly required, the following tools may enhance your development experience:

- **Corepack**: Enabled in the Dockerfile, this tool helps manage package manager versions
- **Jest**: Used for testing across various applications
- **Vitest**: Used for testing in several packages and applications

**Section sources**

- [package.json](file://package.json#L4-L6)
- [apps/server/Dockerfile](file://apps/server/Dockerfile#L1)
- [apps/server/package.json](file://apps/server/package.json#L103-L104)

## Monorepo Setup with pnpm Workspaces

The prj-core repository is structured as a monorepo using pnpm workspaces, which enables shared dependencies and streamlined package management across multiple applications and packages.

### Workspace Configuration

The workspace configuration is defined in `pnpm-workspace.yaml`, which specifies the packages included in the workspace:

```yaml
packages:
  - apps/*
  - packages/*
```

This configuration includes all applications under the `apps/` directory and all shared packages under the `packages/` directory. The structure allows for:

- **apps/admin**: React/Vite-based admin interface
- **apps/mobile**: React Native/Expo mobile application
- **apps/server**: NestJS backend API
- **apps/storybook**: Storybook instance for UI component development
- **packages/**: Shared packages used across applications

### Dependency Management

The monorepo uses a catalog system for dependency management, as seen in the `pnpm-workspace.yaml` file. This approach defines specific versions for commonly used packages, ensuring consistency across all projects:

```yaml
catalog:
  "@biomejs/biome": ^2.1.4
  "@heroui/react": ^2.8.2
  "@prisma/client": ^6.11.1
  # ... additional catalog entries
```

Dependencies are referenced using the `catalog:` alias in package.json files, which resolves to the version specified in the catalog. This prevents version drift and simplifies dependency updates.

### Installation Process

To install dependencies for the entire monorepo, run:

```bash
pnpm install
```

This command installs all dependencies for all workspaces defined in the pnpm-workspace.yaml file. The installation process is optimized by pnpm's hard-linking mechanism, which saves disk space by sharing dependencies across packages.

### Workspace Commands

The monorepo supports running commands across specific workspaces using pnpm's `-C` flag or workspace targeting:

```bash
# Run a command in a specific workspace
pnpm -C apps/admin dev

# Run a command across all workspaces
pnpm --filter "@shared/*" build
```

This flexibility allows developers to work on specific parts of the application without affecting others.

**Section sources**

- [pnpm-workspace.yaml](file://pnpm-workspace.yaml#L1-L56)
- [package.json](file://package.json#L4-L6)
- [apps/admin/package.json](file://apps/admin/package.json#L10-L15)

## Code Formatting and Linting with Biome

The prj-core repository uses Biome for code formatting and linting, providing a unified tool for maintaining code quality across the codebase.

### Biome Configuration

The Biome configuration is defined in `biome.json`, which specifies formatting rules, linter rules, and other settings:

```json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "off",
        "noImplicitAnyLet": "off"
      },
      "correctness": {
        "noUnusedVariables": "off",
        "useExhaustiveDependencies": "off"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double"
    }
  }
}
```

Key configuration aspects include:

- **Indentation**: Uses tabs with a width of 2 spaces
- **Quote style**: Uses double quotes for JavaScript/TypeScript strings
- **Linting**: Enables recommended rules but disables certain rules like `noExplicitAny` and `noUnusedVariables` to accommodate project requirements
- **File inclusion**: Processes files in `./apps/**/*.{ts,tsx}` and `./packages/**/*.{ts,tsx}`

### Formatting Commands

The repository provides standardized formatting commands through package.json scripts:

```json
"scripts": {
	"format": "turbo format",
	"lint": "turbo lint",
	"lint:fix": "turbo lint:fix"
}
```

These commands can be run at the root level to format and lint the entire codebase, or they can be executed in specific workspaces.

### Editor Integration

For optimal development experience, configure your code editor to integrate with Biome:

- Install the Biome extension for your editor (VS Code, JetBrains IDEs, etc.)
- Enable format-on-save functionality
- Configure the editor to use the workspace's Biome configuration

This ensures consistent code style across all developers and prevents formatting issues during code reviews.

**Section sources**

- [biome.json](file://biome.json#L1-L66)
- [package.json](file://package.json#L10-L13)
- [apps/admin/package.json](file://apps/admin/package.json#L16-L19)

## Task Orchestration with Turborepo

Turborepo is used as the task orchestrator for the prj-core monorepo, enabling efficient execution of build, test, and development tasks across multiple packages and applications.

### Turborepo Configuration

The Turborepo configuration is defined in `turbo.json`, which specifies the tasks and their dependencies:

```json
{
  "globalDependencies": ["**/.env.*local"],
  "globalEnv": ["NODE_ENV"],
  "tasks": {
    "build": {
      "outputs": [
        "dist/**",
        ".next/**",
        "!.next/cache/**",
        "storybook-static/**"
      ],
      "dependsOn": ["^build"],
      "env": ["NODE_ENV"]
    },
    "test": {
      "outputs": ["coverage/**"],
      "dependsOn": []
    },
    "start:dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

Key configuration elements include:

- **Global dependencies**: Watches for changes in environment files
- **Environment variables**: Specifies NODE_ENV as a global environment variable
- **Task dependencies**: The build task depends on the build tasks of dependencies (`^build`)
- **Caching**: Disables caching for development tasks to ensure fresh builds

### Common Tasks

The repository defines several common tasks that can be executed across the monorepo:

```bash
# Start development servers
pnpm start:dev

# Build all packages and applications
pnpm build

# Run tests
pnpm test

# Clean generated artifacts
pnpm clean
```

These commands are defined in the root package.json and leverage Turborepo's ability to parallelize tasks and cache results.

### Task Execution Strategy

Turborepo optimizes task execution by:

- **Parallel execution**: Running independent tasks simultaneously
- **Incremental builds**: Only rebuilding packages that have changed
- **Remote caching**: Sharing cache between developers and CI/CD environments
- **Task dependency graph**: Understanding the relationships between packages to determine execution order

This approach significantly reduces build times, especially in a monorepo with multiple interdependent packages.

**Section sources**

- [turbo.json](file://turbo.json#L1-L41)
- [package.json](file://package.json#L7-L15)

## Docker and Containerization Setup

The prj-core repository includes Docker configuration for containerized development, particularly for the server application.

### Dockerfile Structure

The server application's Dockerfile is structured in multiple stages to optimize build performance and image size:

```dockerfile
FROM node:22-alpine AS base
ARG PNPM_VERSION=9.6.0
ENV PNPM_HOME=/usr/local/bin

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app

FROM base AS setup
RUN pnpm add -g turbo
COPY . .
RUN turbo prune --scope=server --docker

FROM base AS builder
RUN apk add --update --no-cache libc6-compat && rm -rf /var/cache/apk/*
COPY .gitignore .gitignore
COPY --from=setup /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=setup /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch

COPY --from=setup /app/out/json/ ./
COPY --from=setup /app/out/full/ ./
COPY turbo.json turbo.json
```

The multi-stage build process includes:

- **Base stage**: Sets up Node.js and pnpm
- **Setup stage**: Installs Turborepo and prunes the workspace for the server scope
- **Builder stage**: Fetches dependencies and copies pruned files for efficient builds

### docker-compose Configuration

The docker-compose.yaml file defines the service orchestration for development:

```yaml
version: "5"

services:
  server:
    container_name: server
    build:
      context: .
      dockerfile: ./apps/server/Dockerfile
    restart: always
    env_file:
      - ./apps/server/.env
    ports:
      - 3003:3003
    networks:
      - app_network

networks:
  app_network:
    external: true
```

Key aspects of the configuration include:

- **Service definition**: Defines the server service with a specific container name
- **Build configuration**: Uses the root directory as context with the server's Dockerfile
- **Environment variables**: Loads environment variables from .env file
- **Port mapping**: Maps container port 3003 to host port 3003
- **Network configuration**: Uses an external network for service communication

### Development with Docker

To start the server in a Docker container:

```bash
docker-compose up --build server
```

This command builds the server image (if needed) and starts the container with the specified configuration. The restart policy ensures the container restarts automatically if it stops.

**Section sources**

- [apps/server/Dockerfile](file://apps/server/Dockerfile#L1-L35)
- [docker-compose.yaml](file://docker-compose.yaml#L1-L33)

## Application-Specific Configuration

Each application in the prj-core monorepo has specific configuration requirements and development workflows.

### Admin Application (React/Vite)

The admin application is a React-based interface using Vite as the build tool. Key configuration elements:

```json
{
  "scripts": {
    "start:dev": "vite",
    "build": "vite build --mode production",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tanstack/react-router": "^1.130.2",
    "@tanstack/react-query": "5.83.0",
    "mobx": "catalog:",
    "mobx-react-lite": "catalog:"
  }
}
```

Development commands:

```bash
# Start development server
pnpm -C apps/admin start:dev

# Build for production
pnpm -C apps/admin build

# Preview production build
pnpm -C apps/admin preview
```

### Mobile Application (React Native/Expo)

The mobile application uses Expo for React Native development:

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~53.0.20",
    "react-native": "0.79.5",
    "expo-router": "~5.1.4"
  }
}
```

Development commands:

```bash
# Start Expo development server
pnpm -C apps/mobile start

# Run on Android
pnpm -C apps/mobile android

# Run on iOS
pnpm -C apps/mobile ios

# Run on web
pnpm -C apps/mobile web
```

### Server Application (NestJS)

The server application is built with NestJS and includes specific development scripts:

```json
{
  "scripts": {
    "start:dev": "nest start -w",
    "start:debug": "nest start --debug --watch",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "@nestjs/core": "^11.1.3",
    "@prisma/client": "catalog:",
    "nestjs-prisma": "^0.25.0"
  }
}
```

Development commands:

```bash
# Start development server with watch mode
pnpm -C apps/server start:dev

# Start in debug mode
pnpm -C apps/server start:debug

# Run tests
pnpm -C apps/server test

# Run tests in watch mode
pnpm -C apps/server test:watch
```

### Storybook Application

The storybook application provides a UI component development environment:

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

Development commands:

```bash
# Start Storybook development server
pnpm storybook

# Build Storybook for production
pnpm -C apps/storybook build-storybook
```

**Section sources**

- [apps/admin/package.json](file://apps/admin/package.json#L1-L69)
- [apps/mobile/package.json](file://apps/mobile/package.json#L1-L77)
- [apps/server/package.json](file://apps/server/package.json#L1-L104)
- [apps/storybook/package.json](file://apps/storybook/package.json#L1-L52)

## Development Workflow

The development workflow for prj-core combines the various tools and configurations into a cohesive process.

### Initial Setup

1. Clone the repository
2. Install Node.js (version 18 or higher)
3. Install pnpm (version 10.13.1)
4. Install Docker (for containerized development)
5. Navigate to the repository root and run:
   ```bash
   pnpm install
   ```

### Starting Development

To start development on all applications simultaneously:

```bash
pnpm start:dev
```

This command uses Turborepo to start the development servers for all applications in parallel. Alternatively, start specific applications:

```bash
# Start only the server
pnpm -C apps/server start:dev

# Start only the admin interface
pnpm -C apps/admin start:dev
```

### Code Formatting and Linting

The repository uses Biome for consistent code style:

```bash
# Check for formatting and linting issues
pnpm lint

# Automatically fix fixable issues
pnpm lint:fix

# Format all code
pnpm format
```

### Building the Application

To build all applications and packages:

```bash
pnpm build
```

This command uses Turborepo to build all projects in the correct dependency order, leveraging caching for improved performance.

### Testing

Run tests across the monorepo:

```bash
pnpm test
```

This executes tests in all applications and packages. For specific testing needs:

```bash
# Run server tests
pnpm -C apps/server test

# Run tests in watch mode
pnpm -C apps/server test:watch

# Run mobile app tests
pnpm -C apps/mobile test
```

### Using Docker for Development

For containerized development of the server:

```bash
# Build and start the server container
docker-compose up --build server

# Start only the server container
docker-compose up server
```

**Section sources**

- [README.md](file://README.md#L25-L32)
- [package.json](file://package.json#L7-L15)
- [turbo.json](file://turbo.json#L1-L41)

## Troubleshooting Common Setup Issues

This section addresses common issues encountered during the development environment setup and their solutions.

### pnpm Installation Issues

**Problem**: pnpm commands not found after installation
**Solution**: Ensure pnpm is installed globally and added to your PATH:

```bash
# Install using npm
npm install -g pnpm

# Or use corepack
corepack enable
corepack prepare pnpm@10.13.1 --activate
```

Verify installation with:

```bash
pnpm --version
```

### Dependency Installation Failures

**Problem**: pnpm install fails with dependency resolution errors
**Solution**: Clear the pnpm store and retry:

```bash
# Clear pnpm store
pnpm store prune

# Remove node_modules and reinstall
pnpm clean
pnpm install
```

### Biome Formatting Issues

**Problem**: Biome commands not working or producing unexpected results
**Solution**: Ensure Biome is properly installed and configured:

```bash
# Install Biome globally if needed
pnpm add -g @biomejs/biome

# Verify Biome configuration
npx biome --version
```

Check that the `biome.json` file is properly formatted and located in the repository root.

### Docker Build Failures

**Problem**: Docker build fails with dependency errors
**Solution**: Ensure the workspace is properly pruned and dependencies are fetched:

```bash
# Run turbo prune to prepare for Docker build
pnpm turbo prune --scope=server --docker

# Build Docker image with proper context
docker-compose up --build
```

### Port Conflicts

**Problem**: Development servers fail to start due to port conflicts
**Solution**: Check for processes using the required ports and terminate them:

```bash
# Check if port 3003 is in use
lsof -i :3003

# Kill process using port 3003
kill -9 $(lsof -t -i:3003)
```

Alternatively, modify the port configuration in the relevant application's configuration files.

### Environment Variables

**Problem**: Application fails to start due to missing environment variables
**Solution**: Ensure environment files are properly configured:

```bash
# Check for required .env files
ls apps/server/.env

# Create .env file if missing
cp apps/server/.env.example apps/server/.env
```

### Turborepo Cache Issues

**Problem**: Turborepo tasks fail or produce incorrect results
**Solution**: Clear the Turborepo cache:

```bash
# Clean Turborepo cache
pnpm clean

# Or remove .turbo directory manually
rm -rf .turbo
```

**Section sources**

- [package.json](file://package.json#L14-L15)
- [turbo.json](file://turbo.json#L37-L41)
- [apps/server/package.json](file://apps/server/package.json#L25-L26)
- [apps/admin/package.json](file://apps/admin/package.json#L68-L69)

## Performance Considerations

Optimizing the development environment for performance is crucial in a monorepo with multiple applications and shared packages.

### Leveraging Turborepo Caching

Turborepo's caching mechanism significantly improves build and test performance:

- **Local caching**: Stores build outputs locally for incremental builds
- **Remote caching**: Share cache between team members and CI/CD environments
- **Task dependency tracking**: Only rebuilds packages when dependencies change

To maximize caching benefits:

```bash
# Ensure global dependencies are properly configured
# in turbo.json to trigger rebuilds when needed
"globalDependencies": ["**/.env.*local"]
```

### Optimized Dependency Installation

The monorepo structure with pnpm workspaces provides several performance advantages:

- **Hard linking**: pnpm uses hard links to avoid duplicating dependencies
- **Shared store**: Dependencies are stored in a central location and linked to projects
- **Selective installation**: Use workspace filtering to install only needed dependencies

```bash
# Install dependencies for specific workspace only
pnpm --filter server install
```

### Efficient Development Server Startup

To reduce development server startup time:

- **Use selective task running**: Start only the applications you're working on
- **Leverage Turborepo's parallel execution**: Run multiple development servers simultaneously
- **Optimize Docker builds**: Use multi-stage builds and layer caching

### Memory Management

Large monorepos can consume significant memory. To optimize:

- **Close unused applications**: Only run development servers for active projects
- **Use lightweight editors**: Configure editors to exclude node_modules from indexing
- **Monitor resource usage**: Use system monitoring tools to identify bottlenecks

### Build Optimization

For faster builds:

- **Use incremental builds**: Turborepo only rebuilds changed packages
- **Optimize TypeScript compilation**: Use project references and composite builds
- **Minimize dependency bundling**: Use tree-shaking and code splitting

These performance considerations ensure a smooth development experience even as the codebase grows in complexity.

**Section sources**

- [turbo.json](file://turbo.json#L1-L41)
- [pnpm-workspace.yaml](file://pnpm-workspace.yaml#L1-L56)
- [package.json](file://package.json#L7-L15)
