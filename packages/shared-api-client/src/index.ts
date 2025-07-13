/**
 * @shared/api-client
 * Generated API client and types from OpenAPI specs using orval
 */

// Export all APIs
export * from "./apis";
export * as APIManager from "./apis";

// Export all types and models
export * from "./model";

// Export custom axios instance for direct usage if needed
export { customInstance, AXIOS_INSTANCE } from "./libs/customAxios";
