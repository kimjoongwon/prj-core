/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateAuthzDto } from '../models/CreateAuthzDto';
import type { UpdateAuthzDto } from '../models/UpdateAuthzDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthzService {

    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static create(
        requestBody: CreateAuthzDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/authz',
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
            url: '/authz',
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
            url: '/authz/{id}',
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
        requestBody: UpdateAuthzDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/authz/{id}',
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
            url: '/authz/{id}',
            path: {
                'id': id,
            },
        });
    }

}
