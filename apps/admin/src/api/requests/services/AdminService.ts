/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MenuDto } from '../models/MenuDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AdminService {

    /**
     * @returns MenuDto Get admin menus
     * @throws ApiError
     */
    public static getMemus(): CancelablePromise<Array<MenuDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/menus',
        });
    }

}
