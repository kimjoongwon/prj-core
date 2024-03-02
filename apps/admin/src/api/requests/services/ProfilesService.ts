/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UpdateProfileDto } from '../models/UpdateProfileDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ProfilesService {

    /**
     * @returns any
     * @throws ApiError
     */
    public static findAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profiles',
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
            url: '/profiles/{id}',
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
        requestBody: UpdateProfileDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/profiles/{id}',
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
            url: '/profiles/{id}',
            path: {
                'id': id,
            },
        });
    }

}
