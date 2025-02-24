import { Injectable } from '@nestjs/common';
import { ValidationBuilder } from '@shared/types';

@Injectable()
export class ValidationService {
  getEmailValidation(): ValidationBuilder {
    return {
      timings: ['onChange'],
      conditions: {
        required: {
          value: true,
          message: '이메일은 필수 입력이야 합니다.',
        },
        maxLength: {
          value: 50,
          message: '이메일은 50자 이하여야 합니다.',
        },
        patterns: [
          {
            value: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
            message: '이메일 형식이 올바르지 않습니다.',
          },
        ],
      },
    };
  }
}
