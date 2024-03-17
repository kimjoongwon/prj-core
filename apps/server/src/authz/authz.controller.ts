import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthzService } from './authz.service';
import { CreateAuthzDto } from './dto/create-authz.dto';
import { UpdateAuthzDto } from './dto/update-authz.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('authz')
@Controller()
export class AuthzController {
  constructor(private readonly authzService: AuthzService) {}

  @Post()
  create(@Body() createAuthzDto: CreateAuthzDto) {
    return this.authzService.create(createAuthzDto);
  }

  @Get()
  findAll() {
    return this.authzService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authzService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthzDto: UpdateAuthzDto) {
    return this.authzService.update(+id, updateAuthzDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authzService.remove(+id);
  }
}
