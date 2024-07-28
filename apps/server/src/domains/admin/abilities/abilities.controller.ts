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
  AbilitiesService,
  AbilityDto,
  AbilityPageQueryDto,
  ApiResponseEntity,
  CreateAbilityDto,
  ResponseEntity,
  UpdateAbilityDto,
} from '@shared';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('abilities')
@Controller()
export class AbilitiesController {
  constructor(private readonly abilitiesService: AbilitiesService) {}

  @Post()
  @ApiResponseEntity(AbilityDto)
  async createAbility(@Body() createAbilityDto: CreateAbilityDto) {
    const abilityDto = await this.abilitiesService.create(createAbilityDto);
    return new ResponseEntity(HttpStatus.CREATED, '생성 성공', new AbilityDto(abilityDto));
  }

  @Get()
  @ApiResponseEntity(AbilityDto, { isArray: true })
  async findAllAblity(@Query() pageQuery: AbilityPageQueryDto) {
    const abilities = await this.abilitiesService.getAbilitiesByPageOptions(pageQuery);
    return new ResponseEntity(
      HttpStatus.OK,
      '조회 성공',
      abilities.map((ability) => new AbilityDto(ability)),
    );
  }

  @Get(':abilityId')
  @ApiResponseEntity(AbilityDto)
  async getAbilityById(@Param('abilityId') id: string) {
    const ability = await this.abilitiesService.getAbilityById(id);
    return new ResponseEntity(HttpStatus.OK, '조회 성공', new AbilityDto(ability));
  }

  @Patch(':abilityId')
  @ApiResponseEntity(AbilityDto)
  async updateAbilityById(
    @Param('abilityId') id: string,
    @Body() updateAbilityDto: UpdateAbilityDto,
  ) {
    const ability = await this.abilitiesService.update(id, updateAbilityDto);
    return new ResponseEntity(HttpStatus.OK, '수정 성공', new AbilityDto(ability));
  }

  @Delete(':abilityId')
  @ApiResponseEntity(AbilityDto)
  async removeAbilityById(@Param('abilityId') id: string) {
    const abilityDto = await this.abilitiesService.remove(id);
    return new ResponseEntity(HttpStatus.OK, '삭제 성공', new AbilityDto(abilityDto));
  }
}
