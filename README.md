# PRJ Core Monorepo

This repository hosts a full‑stack monorepo managed with [Turborepo](https://turbo.build/) and [pnpm](https://pnpm.io/). It contains multiple applications and shared packages used across the project.

## Repository Structure

### Applications

- **admin** – React + Vite based admin UI.
- **server** – [NestJS](https://nestjs.com/) backend API.
- **storybook** – Next.js application for UI component previews.

### Packages

- **@cocrepo/frontend** – shared React component library.
- **@cocrepo/api-client** – generated API client.
- **@cocrepo/toolkit** – utility functions.
- **@cocrepo/types** – shared TypeScript types.
- **@cocrepo/toolkit** – common variables/constants.
- **@shared/specs** – OpenAPI specifications.

Additional documentation can be found in the [`docs`](./docs) directory.

## Getting Started

Install dependencies and start development servers:

```bash
pnpm install
pnpm dev
```

Use the scripts defined in the root `package.json` to build or test the project:

```bash
pnpm build   # build all packages and apps
pnpm test    # run tests
pnpm clean   # remove generated artifacts
```

Dockerfiles and Jenkins pipelines for building production images are located in the `devops` folder.

## License

[ISC](https://opensource.org/licenses/ISC)
