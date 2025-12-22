# Datasource Configuration

<cite>
**Referenced Files in This Document**   
- [prisma.config.ts](file://packages/schema/prisma.config.ts)
- [_base.prisma](file://packages/schema/prisma/schema/_base.prisma)
- [prisma.factory.ts](file://apps/server/src/shared/service/utils/prisma.factory.ts)
- [seed.ts](file://packages/schema/prisma/seed.ts)
- [test-database.ts](file://apps/server/src/shared/test/test-database.ts)
- [database.config.ts](file://apps/server/src/shared/config/database.config.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Prisma Datasource Block Definition](#prisma-datasource-block-definition)
3. [Environment Variables and .env File Usage](#environment-variables-and-env-file-usage)
4. [Connection Pooling Configuration](#connection-pooling-configuration)
5. [SSL Configuration](#ssl-configuration)
6. [Multi-Environment Support](#multi-environment-support)
7. [Deployment Integration](#deployment-integration)
8. [Connection URL Formats](#connection-url-formats)
9. [Troubleshooting Common Connection Issues](#troubleshooting-common-connection-issues)

## Introduction
This document provides comprehensive documentation for the Prisma datasource configuration in the prj-core repository. It details the datasource setup, including provider specification, URL configuration, environment variable usage, connection pooling, and SSL settings. The documentation also covers how the configuration supports multiple environments (development, staging, production) and integrates with the deployment strategy. This guide serves as a reference for developers working with the database layer of the application.

## Prisma Datasource Block Definition

The Prisma datasource configuration is defined across multiple files in the prisma-core repository, following the Prisma 7 modular configuration approach. The core datasource block is minimal in the schema file, with connection details externalized to a separate configuration file.

The base datasource definition in the Prisma schema specifies only the database provider:

```prisma
datasource db {
  provider = "postgresql"
}
```

This simplified schema file focuses solely on the database type, while connection details are managed externally in the `prisma.config.ts` file. The separation of concerns between schema definition and connection configuration is a key feature of Prisma 7, allowing for more flexible environment management.

The actual connection URL is defined in the `prisma.config.ts` file using the `env()` function to retrieve the value from environment variables:

```typescript
export default defineConfig({
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

This approach centralizes connection management while maintaining the separation between database schema definition and runtime configuration.

**Section sources**
- [_base.prisma](file://packages/schema/prisma/schema/_base.prisma#L9-L11)
- [prisma.config.ts](file://packages/schema/prisma.config.ts#L16-L18)

## Environment Variables and .env File Usage

The Prisma configuration in prj-core relies heavily on environment variables for database connection settings, following the 12-factor app methodology. The primary environment variable used is `DATABASE_URL`, which contains the complete connection string for the PostgreSQL database.

The configuration explicitly imports dotenv to load environment variables:

```typescript
import "dotenv/config";
```

This explicit import is required in Prisma 7, as the automatic `.env` file loading has been removed as a breaking change. The application must explicitly load environment variables before they can be accessed.

The `DATABASE_URL` environment variable is used throughout the application in multiple contexts:

1. In the Prisma configuration file (`prisma.config.ts`) to set the datasource URL
2. In the Prisma client factory (`prisma.factory.ts`) to validate the presence of the connection string
3. In test utilities (`test-database.ts`) to configure the test database connection

The environment variable is validated at runtime in the Prisma client factory:

```typescript
const databaseUrl = configService.get<string>("DATABASE_URL");
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}
```

This validation ensures that the application fails fast if the required database connection string is missing, providing clear error messages for troubleshooting.

**Section sources**
- [prisma.config.ts](file://packages/schema/prisma.config.ts#L1-L2)
- [prisma.factory.ts](file://apps/server/src/shared/service/utils/prisma.factory.ts#L1-L15)
- [test-database.ts](file://apps/server/src/shared/test/test-database.ts#L13-L15)

## Connection Pooling Configuration

The prj-core application implements connection pooling through the Prisma PostgreSQL adapter, which provides a more robust connection management system compared to previous versions. The connection pooling is configured programmatically in the Prisma client factory rather than through Prisma schema directives.

The application uses the `@prisma/adapter-pg` package to create a PostgreSQL adapter with a connection pool:

```typescript
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// PostgreSQL connection pool 생성
const pool = new pg.Pool({
  connectionString: databaseUrl,
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Prisma PostgreSQL Adapter 생성
const adapter = new PrismaPg(pool);
```

Key connection pooling parameters include:

- **max**: The maximum number of clients in the pool (set to 20)
- **idleTimeoutMillis**: The time in milliseconds a client must sit idle in the pool before it is closed (30 seconds)
- **connectionTimeoutMillis**: The time in milliseconds to wait for a client to become available (2 seconds)

The Prisma client is then instantiated with the adapter:

```typescript
return new PrismaClient({
  adapter,
  // ... other configuration
}) as PrismaService;
```

This approach provides fine-grained control over connection pool behavior and is particularly important for production deployments where database connection limits must be carefully managed.

**Section sources**
- [prisma.factory.ts](file://apps/server/src/shared/service/utils/prisma.factory.ts#L17-L27)

## SSL Configuration

Based on the available codebase, SSL configuration for database connections is not explicitly implemented in the current Prisma configuration. The configuration files do not contain SSL-specific parameters such as `sslmode`, `sslcert`, `sslkey`, or `sslrootcert` in the connection URL or configuration objects.

The absence of SSL configuration suggests that the application may be relying on the default SSL behavior of the underlying PostgreSQL driver or the hosting environment's network security features. In production environments, SSL/TLS encryption for database connections is typically enforced by the cloud provider or infrastructure layer rather than being configured at the application level.

For environments where SSL configuration is required, it would need to be added to the `DATABASE_URL` environment variable or configured through the PostgreSQL connection pool options. The current implementation does not provide explicit SSL configuration options in the Prisma configuration files.

**Section sources**
- [prisma.config.ts](file://packages/schema/prisma.config.ts)
- [prisma.factory.ts](file://apps/server/src/shared/service/utils/prisma.factory.ts)

## Multi-Environment Support

The prj-core application supports multiple environments (development, staging, production) through environment-specific configuration and deployment practices. The datasource configuration is designed to be environment-agnostic, with environment-specific details provided through environment variables.

The configuration approach follows these principles:

1. **Environment Variables**: All environment-specific configuration is externalized to environment variables, primarily `DATABASE_URL`. This allows different environments to use different database instances without code changes.

2. **Test Environment**: A dedicated test database configuration is implemented for testing purposes:

```typescript
// Set DATABASE_URL for test database
process.env.DATABASE_URL = "file:./test.db";
```

This configuration uses SQLite for testing, providing a lightweight, file-based database that can be easily created and destroyed during test runs.

3. **Development vs Production**: While the configuration files don't explicitly differentiate between development and production environments, the pattern of using environment variables allows for different database URLs to be provided in each environment.

4. **Migration Management**: The Prisma configuration includes environment-specific migration settings:

```typescript
migrations: {
  path: "./prisma/migrations",
  seed: "tsx ./prisma/seed.ts",
},
```

The migration system can be deployed differently across environments, with seed data potentially being applied only in development and staging environments.

The multi-environment strategy relies on deployment processes to provide the appropriate environment variables for each environment, rather than having environment-specific configuration files in the codebase.

**Section sources**
- [prisma.config.ts](file://packages/schema/prisma.config.ts#L10-L13)
- [test-database.ts](file://apps/server/src/shared/test/test-database.ts#L13-L15)
- [seed.ts](file://packages/schema/prisma/seed.ts#L18-L23)

## Deployment Integration

The Prisma datasource configuration is integrated with the deployment strategy through several mechanisms that ensure reliable database connectivity in production environments.

The deployment integration includes:

1. **Migration Deployment**: The application uses Prisma's migration system to manage database schema changes across environments. The `prisma.config.ts` file specifies the migration path:

```typescript
migrations: {
  path: "./prisma/migrations",
  seed: "tsx ./prisma/seed.ts",
},
```

2. **Test Database Setup**: The test utilities include functionality to deploy migrations to the test database:

```typescript
execSync(
  "cd ../../../packages/shared-prisma && npx prisma migrate deploy",
  {
    env: { ...process.env, DATABASE_URL: "file:./test.db" },
    stdio: "inherit",
  },
);
```

This pattern can be extended to other environments, ensuring that migrations are applied consistently.

3. **Connection Resilience**: The use of connection pooling and the Prisma PostgreSQL adapter provides better connection resilience in production environments, handling connection failures and retries more effectively.

4. **Environment Variable Management**: The deployment process must ensure that the `DATABASE_URL` environment variable is properly set in each environment, with appropriate values for development, staging, and production databases.

5. **Seed Data Management**: The configuration includes a seed script that can be run as part of the deployment process to initialize the database with required data:

```typescript
seed: "tsx ./prisma/seed.ts",
```

This allows for consistent data initialization across environments when needed.

The deployment strategy relies on external processes to manage environment variables and execute migration commands, with the application configuration providing the framework for these operations.

**Section sources**
- [prisma.config.ts](file://packages/schema/prisma.config.ts#L10-L13)
- [test-database.ts](file://apps/server/src/shared/test/test-database.ts#L37-L43)
- [seed.ts](file://packages/schema/prisma/seed.ts#L1-L3)

## Connection URL Formats

The prj-core application supports multiple connection URL formats for different environments and use cases. The connection URL is always provided through the `DATABASE_URL` environment variable, but the format varies depending on the database type and environment.

### Production/Development PostgreSQL Connection
For PostgreSQL databases (used in production and development), the connection URL follows the standard PostgreSQL connection string format:

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

Or with additional parameters:
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

### Test SQLite Connection
For testing purposes, the application uses SQLite with a file-based database:

```
file:./test.db
```

This format is used in the test utilities to create a lightweight, disposable database for testing:

```typescript
process.env.DATABASE_URL = "file:./test.db";
```

### Connection URL Components
The PostgreSQL connection URL typically includes the following components:
- **Protocol**: `postgresql://` or `postgres://`
- **Username**: Database user name
- **Password**: Database user password
- **Host**: Database server hostname or IP address
- **Port**: Database server port (typically 5432 for PostgreSQL)
- **Database**: Name of the database to connect to
- **Parameters**: Optional connection parameters (e.g., sslmode)

The application does not currently use the `directUrl` parameter that was available in Prisma 6, as it has been removed in the Prisma 7 configuration approach.

**Section sources**
- [prisma.config.ts](file://packages/schema/prisma.config.ts#L17)
- [test-database.ts](file://apps/server/src/shared/test/test-database.ts#L15)
- [seed.ts](file://packages/schema/prisma/seed.ts#L20)

## Troubleshooting Common Connection Issues

This section documents common connection issues and their solutions based on the prj-core Prisma configuration.

### 1. DATABASE_URL Not Defined
**Symptom**: Application fails to start with "DATABASE_URL is not defined in environment variables"
**Solution**: Ensure the `DATABASE_URL` environment variable is set before starting the application. Verify that `dotenv/config` is imported at the beginning of the application:

```typescript
import "dotenv/config";
```

### 2. Connection Timeout
**Symptom**: Database operations time out or fail with connection errors
**Solution**: Check the connection pool configuration in `prisma.factory.ts`. Adjust the `connectionTimeoutMillis` and `idleTimeoutMillis` values if needed. Verify network connectivity to the database server.

### 3. Migration Deployment Failures
**Symptom**: Migrations fail to deploy to the database
**Solution**: Ensure the `DATABASE_URL` environment variable is correctly set when running migration commands. Check that the database user has the necessary permissions to modify the schema.

### 4. Test Database Issues
**Symptom**: Tests fail with database connection errors
**Solution**: Verify that the test database file can be created and accessed. Check file permissions in the project directory. Ensure the SQLite database can be created at the specified path.

### 5. SSL Connection Problems
**Symptom**: Connection fails with SSL-related errors
**Solution**: If SSL is required, add the appropriate parameters to the `DATABASE_URL`. For example:
```
postgresql://user:password@host:port/db?sslmode=require
```

### 6. Connection Pool Exhaustion
**Symptom**: Application becomes unresponsive or database operations fail under load
**Solution**: Increase the `max` connection pool size in the PostgreSQL pool configuration. Monitor database connection limits and adjust accordingly.

### 7. Environment Variable Loading Issues
**Symptom**: Environment variables are not loaded correctly
**Solution**: Ensure `dotenv/config` is imported at the very beginning of the application, before any other imports that might need environment variables.

These troubleshooting steps should help resolve most common connection issues encountered with the prj-core Prisma configuration.

**Section sources**
- [prisma.factory.ts](file://apps/server/src/shared/service/utils/prisma.factory.ts#L13-L15)
- [test-database.ts](file://apps/server/src/shared/test/test-database.ts)
- [prisma.config.ts](file://packages/schema/prisma.config.ts)