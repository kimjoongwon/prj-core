/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type MenuDto = {
    text: string;
    icon: string;
    pathname: MenuDto.pathname;
    children?: Array<{
        text: string;
        icon: string;
        pathname: 'admin/userService/users' | 'admin/userService/users/:id';
    }>;
};

export namespace MenuDto {

    export enum pathname {
        ADMIN_USER_SERVICE_USERS = 'admin/userService/users',
        ADMIN_USER_SERVICE_USERS_ID = 'admin/userService/users/:id',
    }


}

