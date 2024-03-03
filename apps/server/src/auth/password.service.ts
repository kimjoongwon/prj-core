import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcrypt';

@Injectable()
export class PasswordService {
  get bcryptSaltRounds(): string | number {
    // const securityConfig = this.configService.get<SecurityConfig>('security');
    // const saltOrRounds = securityConfig.bcryptSaltOrRound;

    return Number.isInteger(Number(10)) ? Number(10) : 10;
  }

  constructor(private configService: ConfigService) {}

  validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }
}
