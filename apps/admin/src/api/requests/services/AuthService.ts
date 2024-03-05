/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserSignUpDto } from '../models/CreateUserSignUpDto';
import type { LoginDto } from '../models/LoginDto';
import type { ProfileDto } from '../models/ProfileDto';
import type { TokenDto } from '../models/TokenDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthService {

    /**
     * @param requestBody
     * @returns TokenDto
     * @throws ApiError
     */
    public static login(
        requestBody: LoginDto,
    ): CancelablePromise<TokenDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/login',
            body: requestBody,
            mediaType: 'application/json',
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
