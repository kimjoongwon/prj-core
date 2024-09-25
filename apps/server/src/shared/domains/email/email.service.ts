import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor() {}

  sendEmail() {
    return 'Email sent';
  }
}
