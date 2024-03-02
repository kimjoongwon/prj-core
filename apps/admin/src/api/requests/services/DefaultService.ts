/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTenantDto } from '../models/CreateTenantDto';
import type { UpdateTenantDto } from '../models/UpdateTenantDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static create(
        requestBody: CreateTenantDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tenants',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static findAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tenants',
        });
    }

    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static findOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tenants/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static update(
        id: string,
        requestBody: UpdateTenantDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/tenants/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static remove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/tenants/{id}',
            path: {
                'id': id,
            },
        });
    }

}
