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
    type: CreateUserSignUpDto.type;
};

export namespace CreateUserSignUpDto {

    export enum type {
        USER = 'USER',
        SUPER_ADMIN = 'SUPER_ADMIN',
    }


}

