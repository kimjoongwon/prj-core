// import { makeAutoObservable } from 'mobx';
// import {
//   GetToken200AllOf,
//   LoginPayloadDto,
//   TenantDto,
//   TokenDto,
//   UserDto,
// } from '../model';
// import { Galaxy } from './Plate';
// import { Effect, pipe } from 'effect';
// import { AxiosError } from 'axios';
// import { getNewToken, getToken } from '../apis';
// import { GalaxyError, InvalidPasswordError } from '../errors';
// import { AuthStatus } from '@shared/types';

// export class Auth {
//   galaxy: Galaxy;
//   accessToken: string | undefined = undefined;
//   user: UserDto | undefined = undefined;
//   tenant: TenantDto | undefined = undefined;
//   status: AuthStatus = AuthStatus.LoggedOut;

//   constructor(galaxy: Galaxy) {
//     makeAutoObservable(this, undefined, { autoBind: true });
//     this.galaxy = galaxy;
//   }

//   setStatus(status: AuthStatus) {
//     this.status = status;
//   }

//   getToken(loginPayloadDto: LoginPayloadDto) {
//     return Effect.tryPromise({
//       try: () => getToken(loginPayloadDto),
//       catch: (err: unknown) => {
//         if (err instanceof AxiosError) {
//           if (err.message === '패스워드가 일치하지 않습니다.') {
//             return new InvalidPasswordError();
//           }
//         }
//         return new GalaxyError();
//       },
//     });
//   }

//   beforeLogin() {
//     this.status = AuthStatus.LoggingIn;
//     // this.galaxy.router.push({
//     //   url: '/admin/main',
//     // });
//   }

//   login(loginPayloadDto: LoginPayloadDto) {
//     return Effect.runPromise(
//       pipe(
//         this.beforeLogin(),
//         () => this.getToken(loginPayloadDto),
//         Effect.match({
//           onSuccess: this.afterLogin,
//           onFailure: error => {
//             if (error._tag === 'InvalidPasswordError') {
//               this.status = AuthStatus.InvalidPassword;
//             }
//             if (error._tag === 'GalaxyError') {
//               this.status = AuthStatus.LoggedInFailed;
//             }
//           },
//         }),
//       ),
//     );
//   }

//   afterLogin(res: GetToken200AllOf) {
//     if (res?.data) {
//       this.setAuth(res?.data);
//     }
//     this.status = AuthStatus.LoggedIn;
//   }

//   logout() {
//     localStorage.clear();
//     this.user = undefined;
//     this.status = AuthStatus.LoggedOut;
//   }

//   setAuth({ user, accessToken }: TokenDto) {
//     localStorage.setItem('accessToken', accessToken);
//     this.user = user;
//   }

//   reAuthenticate() {
//     return getNewToken().then(this.setAuth);
//   }
// }
