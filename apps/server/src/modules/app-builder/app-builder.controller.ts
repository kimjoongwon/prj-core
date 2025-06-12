import { Body, Controller, Get, Post, Res, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth, ResponseEntity, SelectWorkspaceDto } from '@shared';
import { AppBuilderService } from './app-builder.service';
import { Response, Request } from 'express';

@ApiTags('BUILDER')
@Controller()
export class AppBuilderController {
  constructor(private readonly appBuilderService: AppBuilderService) {}

  @Get()
  @Auth([])
  async getAppBuilder(@Req() req: Request) {
    // 인증 상태 확인 (accessToken 쿠키 존재 여부로 판단)
    const isAuthenticated = !!req.cookies?.accessToken;
    console.log('isAuthenticated:', isAuthenticated, req.cookies.accessToken);
    const app = await this.appBuilderService.build(isAuthenticated);
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
