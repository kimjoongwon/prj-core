# Shared API Client

<cite>
**Referenced Files in This Document**   
- [orval.config.js](file://packages/api-client/orval.config.js)
- [package.json](file://packages/api-client/package.json)
- [src/index.ts](file://packages/api-client/src/index.ts)
- [src/apis.ts](file://packages/api-client/src/apis.ts)
- [src/libs/customAxios.ts](file://packages/api-client/src/libs/customAxios.ts)
- [src/model/index.ts](file://packages/api-client/src/model/index.ts)
- [src/types.ts](file://packages/api-client/src/types.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Orval Configuration and Code Generation](#orval-configuration-and-code-generation)
3. [Custom Axios Implementation](#custom-axios-implementation)
4. [Generated API Endpoints Structure](#generated-api-endpoints-structure)
5. [Type Safety with Generated Models](#type-safety-with-generated-models)
6. [Integration with React Query](#integration-with-react-query)
7. [Client Usage in Applications](#client-usage-in-applications)
8. [Relationship with NestJS Backend](#relationship-with-nestjs-backend)
9. [API Versioning and Breaking Changes](#api-versioning-and-breaking-changes)
10. [Regeneration Strategies](#regeneration-strategies)
11. [Conclusion](#conclusion)

## Introduction
The shared-api-client package in prj-core provides a type-safe API client generated from OpenAPI specifications using Orval. This package serves as the single source of truth for API interactions across the monorepo, ensuring consistency and type safety between frontend applications and the NestJS backend. The generated client abstracts HTTP communication details while providing strongly-typed interfaces for all API endpoints, request payloads, and response structures. This documentation explains the architecture, implementation details, and usage patterns of the shared API client, focusing on how it enables type safety, simplifies API consumption, and maintains contract consistency across the ecosystem.

## Orval Configuration and Code Generation
The shared-api-client package uses Orval to generate type-safe API clients from OpenAPI specifications. The configuration is defined in orval.config.js, which implements a dynamic environment detection system that prioritizes local development servers when available. The configuration supports multiple environments (development, staging, production) with different API endpoints, automatically selecting the appropriate URL based on the current NODE_ENV and server availability. Orval generates code in "tags-split" mode, organizing endpoints by OpenAPI tags into a single apis.ts file. The generation process creates React Query hooks for all endpoints with support for standard useQuery, suspense variants, and infinite queries. The configuration specifies the use of a custom Axios instance for HTTP operations, allowing centralized control over request behavior, error handling, and authentication. The generated code includes comprehensive TypeScript types for all request and response payloads, ensuring type safety throughout the application.

**Section sources**
- [orval.config.js](file://packages/api-client/orval.config.js#L1-L125)

## Custom Axios Implementation
The customAxios.ts file provides a centralized HTTP client configuration that handles cross-cutting concerns for all API requests. The AXIOS_INSTANCE is configured with default settings including a 10-second timeout and credentials inclusion for cookie-based authentication. A response interceptor handles 409 conflict errors by extracting user-friendly messages from the response payload and enhancing the error object for better debugging. The customInstance function serves as a mutator for Orval-generated code, accepting AxiosRequestConfig and options parameters while implementing request cancellation through Axios CancelToken. This implementation pattern allows for consistent error handling, request cancellation, and configuration across all API calls without requiring individual endpoint configuration. The exported ErrorType and BodyType utility types provide type safety for error handling and request payload typing in the generated code.

**Section sources**
- [src/libs/customAxios.ts](file://packages/api-client/src/libs/customAxios.ts#L1-L56)

## Generated API Endpoints Structure
The apis.ts file contains all generated API endpoints and React Query hooks, organized by OpenAPI operation tags. Each endpoint has three variants: a direct function call, a useQuery hook for data fetching, and a useMutation hook for data modification. The generated code includes comprehensive JSDoc comments with operation summaries and parameter descriptions. Query hooks include both standard and suspense variants, enabling flexible data fetching strategies in consuming applications. The code structure follows a consistent pattern where each endpoint has a corresponding useQueryOptions function that returns the complete query configuration, which is then used by the hook implementation. This separation of configuration and hook logic enables reuse and customization. The generated types include specific result and error types for each operation, providing precise type information for both successful responses and error states.

**Section sources**
- [src/apis.ts](file://packages/api-client/src/apis.ts#L1-L800)

## Type Safety with Generated Models
The model directory contains TypeScript interfaces generated from the OpenAPI specification, providing type safety for all API interactions. The index.ts file re-exports all model types, enabling convenient imports from a single entry point. Each model corresponds to a request or response schema defined in the OpenAPI specification, with interfaces for DTOs, query parameters, and response envelopes. The generated types include operation-specific response types (e.g., CreateCategory200AllOf) that capture the exact structure of successful responses, as well as parameter types (e.g., GetCategoriesByQueryParams) for request inputs. This comprehensive type coverage ensures that both request payloads and response data are type-checked at compile time, preventing runtime errors caused by schema mismatches. The types are automatically updated when the API specification changes, maintaining consistency between client and server contracts.

**Section sources**
- [src/model/index.ts](file://packages/api-client/src/model/index.ts#L1-L260)
- [src/types.ts](file://packages/api-client/src/types.ts#L1-L6)

## Integration with React Query
The generated API client is tightly integrated with React Query, providing optimized data fetching and state management capabilities. Each GET endpoint generates useQuery, useSuspenseQuery, and useSuspenseInfiniteQuery hooks, enabling flexible data fetching strategies based on application requirements. The query hooks include automatic query key generation based on the endpoint URL and parameters, ensuring proper cache invalidation and data consistency. Mutation hooks provide built-in support for optimistic updates, error rollback, and loading states. The integration handles common concerns such as request deduplication, background refetching, and stale data management. The generated code includes type-safe query options that can be customized in consuming applications while maintaining type safety. This integration reduces boilerplate code and ensures consistent data fetching patterns across all applications in the monorepo.

**Section sources**
- [src/apis.ts](file://packages/api-client/src/apis.ts#L1-L800)
- [src/libs/customAxios.ts](file://packages/api-client/src/libs/customAxios.ts#L1-L56)

## Client Usage in Applications
Applications consume the shared API client through direct imports of generated hooks and types. The index.ts file exports all APIs, models, and the custom Axios instance, providing a clean entry point for consumers. Applications can use the generated hooks directly in components, leveraging React Query's caching and state management capabilities. For example, the admin application might use useGetCategoriesByQuery to fetch category data, while the mobile application could use useCreateCategory for creating new categories. The type safety ensures that developers receive immediate feedback if they provide incorrect parameters or attempt to access non-existent response properties. The centralized error handling in customAxios.ts ensures consistent error presentation across applications. The package's design enables both high-level hook usage for common scenarios and low-level access to the Axios instance for custom requirements.

**Section sources**
- [src/index.ts](file://packages/api-client/src/index.ts#L1-L13)
- [src/apis.ts](file://packages/api-client/src/apis.ts#L1-L800)

## Relationship with NestJS Backend
The shared-api-client maintains a direct relationship with the NestJS backend's Swagger documentation, using the OpenAPI specification as the contract between client and server. The orval.config.js file points to the backend's /api-json endpoint, which serves the dynamically generated OpenAPI specification from the NestJS application. This tight coupling ensures that the client always reflects the current API surface, including endpoints, request/response schemas, and authentication requirements. The backend's @Public decorator annotations are reflected in the client documentation, indicating which endpoints require authentication. The version number in the OpenAPI specification (1.0.0) provides a baseline for versioning and change management. This architecture enables true contract-first development, where API changes are made in the backend and automatically propagated to all consuming clients through regeneration.

**Section sources**
- [orval.config.js](file://packages/api-client/orval.config.js#L1-L125)
- [src/apis.ts](file://packages/api-client/src/apis.ts#L1-L800)

## API Versioning and Breaking Changes
The shared API client handles versioning and breaking changes through a combination of automated regeneration and manual intervention. The OpenAPI specification version (1.0.0) provides a baseline for tracking changes, with major version increments indicating breaking changes. When breaking changes occur in the backend, the regeneration process will update the client code accordingly, potentially introducing compilation errors in consuming applications that highlight affected code paths. The use of specific response types (e.g., CreateCategory200AllOf) rather than generic any types ensures that schema changes are caught at compile time. For backward compatibility, the backend can maintain multiple versions of endpoints while the client gradually migrates to new interfaces. The monorepo structure enables coordinated updates across all applications, ensuring that breaking changes are addressed systematically.

**Section sources**
- [orval.config.js](file://packages/api-client/orval.config.js#L1-L125)
- [src/apis.ts](file://packages/api-client/src/apis.ts#L1-L800)

## Regeneration Strategies
The shared-api-client package employs automated regeneration strategies triggered by changes to the backend API. The build script runs Orval with the configuration file, generating updated client code from the current OpenAPI specification. The dynamic environment detection in orval.config.js ensures that developers can regenerate against their local backend instance during development, while CI/CD pipelines use the appropriate environment URL. Regeneration should occur whenever the backend API changes, with the updated client package published to the monorepo. The process is designed to be non-destructive, overwriting only the generated files while preserving any manual modifications to configuration files. Teams should establish a workflow where API changes are followed by client regeneration and testing before deployment. The comprehensive type coverage ensures that regeneration surfaces potential integration issues early in the development cycle.

**Section sources**
- [orval.config.js](file://packages/api-client/orval.config.js#L1-L125)
- [package.json](file://packages/api-client/package.json#L1-L56)

## Conclusion
The shared-api-client package provides a robust, type-safe interface between frontend applications and the NestJS backend, leveraging Orval and OpenAPI specifications to ensure contract consistency. By generating React Query hooks and TypeScript types from the API specification, it eliminates manual API client maintenance and prevents runtime errors caused by schema mismatches. The custom Axios implementation provides centralized control over HTTP behavior and error handling, while the integration with React Query offers optimized data fetching and state management. This architecture promotes code reuse, reduces boilerplate, and enables safe refactoring across the monorepo. The automated regeneration process ensures that client code stays synchronized with the backend, supporting agile development practices while maintaining stability in production applications.