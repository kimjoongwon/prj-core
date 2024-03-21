/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateUserSignUpDto = {
    createUserDto: {
        name: string;
        password: string;
        email: string;
        phone: string;
    };
    createProfileDto: {
        nickname?: string;
        userId: string;
    };
};

