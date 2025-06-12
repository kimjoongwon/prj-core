import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Auth,
  AuthService,
  LoginPayloadDto,
  ResponseEntity,
  TokenDto,
  SelectWorkspaceDto,
} from '@shared';
import { AppBuilderService } from './app-builder.service';
import { Response } from 'express';
import { ButtonResponse } from '@shared/types';

@ApiTags('BUILDER')
@Controller()
export class AppBuilderController {
  constructor(
    private readonly appBuilderService: AppBuilderService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @Auth([], { public: true })
  async getAppBuilder() {
    const app = await this.appBuilderService.build();
    return new ResponseEntity(200, '성공', app);
  }

  @Post('select-workspace')
  async selectWorkspace(
    @Body() selectWorkspaceDto: SelectWorkspaceDto,
    @Res({
      passthrough: true,
    })
    res: Response,
  ) {
    res.cookie('workspaceId', selectWorkspaceDto.selectedWorkspace, {
      httpOnly: true,
    });
    return new ResponseEntity(200, '성공');
  }
}
