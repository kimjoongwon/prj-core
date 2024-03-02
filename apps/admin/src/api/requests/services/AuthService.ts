/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserSignUpDto } from '../models/CreateUserSignUpDto';
import type { ProfileDto } from '../models/ProfileDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthService {

    /**
     * @returns any
     * @throws ApiError
     */
    public static login(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static getProfile(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profile',
        });
    }

    /**
     * @param requestBody
     * @returns ProfileDto
     * @throws ApiError
     */
    public static signUpUser(
        requestBody: CreateUserSignUpDto,
    ): CancelablePromise<ProfileDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/signUp',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
