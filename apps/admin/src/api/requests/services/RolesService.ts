/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRoleDto } from '../models/CreateRoleDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RolesService {

    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static create(
        requestBody: CreateRoleDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/roles',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
