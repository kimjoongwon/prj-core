import {
  Resolver,
  Mutation,
  Args,
  Parent,
  ResolveField,
  Context,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './models/auth.model';
import { Token } from './models/token.model';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { User } from '../users/models/user.model';
import { Req, Res } from '../../common/decorators';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => Auth)
  async signup(@Args('data') data: SignupInput): Promise<Token> {
    data.email = data.email.toLowerCase();
    const { accessToken, refreshToken } = await this.auth.createUser(data);
    const user = await this.auth.getUserFromToken(accessToken);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  @Mutation(() => Auth)
  async login(@Args('data') { email, password }: LoginInput, @Res() res) {
    const { accessToken, refreshToken, user } = await this.auth.login(
      email.toLowerCase(),
      password,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });

    return {
      refreshToken,
      accessToken,
      user,
    };
  }

  @Mutation(() => Token)
  async refreshToken(@Args() { token }: RefreshTokenInput, @Req() req) {
    const refreshToken = req.cookies.refreshToken;
    return this.auth.refreshToken(refreshToken);
  }

  @ResolveField('user', () => User)
  async user(@Parent() auth: Auth) {
    return await this.auth.getUserFromToken(auth.accessToken);
  }
}
