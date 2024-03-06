import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcrypt';
import { AuthConfig } from 'src/configs';

@Injectable()
export class PasswordService {
  constructor(private configService: ConfigService) {}

  validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  hashPassword(password: string): Promise<string> {
    const authConfig = this.configService.get<AuthConfig>('auth');

    return hash(password, authConfig?.bcryptSaltOrRound);
  }
}
