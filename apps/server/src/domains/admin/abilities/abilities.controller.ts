import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  AbilityDto,
  AbilityPageQueryDto,
  AbilityService,
  ApiEndpoints,
  ApiResponseEntity,
  CreateAbilityDto,
  ResponseEntity,
  UpdateAbilityDto,
} from '@shared';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ADMIN_ABILITIES')
@Controller(ApiEndpoints.ADMIN_ABILITIES)
export class AbilitiesController {
  constructor(private readonly abilityService: AbilityService) {}

  @Post()
  @ApiResponseEntity(AbilityDto)
  async createAbility(@Body() createAbilityDto: CreateAbilityDto) {
    const abilityDto = await this.abilityService.create(createAbilityDto);
    return new ResponseEntity(HttpStatus.CREATED, '생성 성공', new AbilityDto(abilityDto));
  }

  @Get()
  @ApiResponseEntity(AbilityDto, { isArray: true })
  async getAbilitiesByPageQuery(@Query() pageQuery: AbilityPageQueryDto) {
    const abilities = await this.abilityService.getAbilitiesByPageQuery(pageQuery);
    return new ResponseEntity(
      HttpStatus.OK,
      '조회 성공',
      abilities.map((ability) => new AbilityDto(ability)),
    );
  }

  @Get(':abilityId')
  @ApiResponseEntity(AbilityDto)
  async getAbilityById(@Param('abilityId') id: string) {
    const ability = await this.abilityService.getOneById(id);
    return new ResponseEntity(HttpStatus.OK, '조회 성공', new AbilityDto(ability));
  }

  @Patch(':abilityId')
  @ApiResponseEntity(AbilityDto)
  async updateAbilityById(
    @Param('abilityId') id: string,
    @Body() updateAbilityDto: UpdateAbilityDto,
  ) {
    const ability = await this.abilityService.updateById(id, updateAbilityDto);
    return new ResponseEntity(HttpStatus.OK, '수정 성공', new AbilityDto(ability));
  }

  @Delete(':abilityId')
  @ApiResponseEntity(AbilityDto)
  async removeAbilityById(@Param('abilityId') id: string) {
    const abilityDto = await this.abilityService.removeById(id);
    return new ResponseEntity(HttpStatus.OK, '삭제 성공', new AbilityDto(abilityDto));
  }
}
