import { TemplateDto, UserDto } from '../../../entities';

export class ConvertToHtmlPayloadDto {
  user: UserDto;
  username: string;
  name: string;
  toEmail: string;
  emailTemplate: TemplateDto;
}
