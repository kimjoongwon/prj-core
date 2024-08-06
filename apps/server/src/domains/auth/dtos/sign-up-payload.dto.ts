export class SignUpPayloadDto {
  constructor(data: SignUpPayloadDto) {
    this.nickname = data.nickname;
    this.spaceId = data.spaceId;
    this.email = data.email;
    this.name = data.name;
    this.phone = data.phone;
    this.password = data.password;
  }
  nickname: string;
  spaceId: string;
  email: string;
  name: string;
  phone: string;
  password: string;
}
