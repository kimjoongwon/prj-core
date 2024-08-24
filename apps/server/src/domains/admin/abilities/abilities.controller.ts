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
  AbilityQueryDto,
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
  @ApiResponseEntity(AbilityDto, HttpStatus.CREATED)
  async createAbility(@Body() createAbilityDto: CreateAbilityDto) {
    const abilityDto = await this.abilityService.create(createAbilityDto);
    return new ResponseEntity(HttpStatus.CREATED, '생성 성공', new AbilityDto(abilityDto));
  }

  @Get()
  @ApiResponseEntity(AbilityDto, HttpStatus.OK, { isArray: true })
  async getAbilitiesByQuery(@Query() pageQuery: AbilityQueryDto) {
    const abilities = await this.abilityService.getManyByQuery(pageQuery);
    return new ResponseEntity(
      HttpStatus.OK,
      '조회 성공',
      abilities.map((ability) => new AbilityDto(ability)),
    );
  }

  @Get(':abilityId')
  @ApiResponseEntity(AbilityDto)
  async getAbility(@Param('abilityId') id: string) {
    const ability = await this.abilityService.get(id);
    return new ResponseEntity(HttpStatus.OK, '조회 성공', new AbilityDto(ability));
  }

  @Patch(':abilityId')
  @ApiResponseEntity(AbilityDto)
  async updateAbility(@Param('abilityId') id: string, @Body() updateAbilityDto: UpdateAbilityDto) {
    const ability = await this.abilityService.update(id, updateAbilityDto);
    return new ResponseEntity(HttpStatus.OK, '수정 성공', new AbilityDto(ability));
  }

  @Patch(':abilityId')
  @ApiResponseEntity(AbilityDto)
  async removeAbility(@Param('abilityId') id: string) {
    const abilityDto = await this.abilityService.remove(id);
    return new ResponseEntity(HttpStatus.OK, '삭제 성공', new AbilityDto(abilityDto));
  }

  @Patch(':abilityIds')
  @ApiResponseEntity(AbilityDto)
  async removeAbilities(@Param('abilityIds') ids: string[]) {
    const abilityDto = await this.abilityService.removeMany(ids);
    return new ResponseEntity(HttpStatus.OK, '삭제 성공', abilityDto);
  }

  @Delete(':abilityId')
  @ApiResponseEntity(AbilityDto)
  async deleteAbility(@Param('abilityId') id: string) {
    const abilityDto = await this.abilityService.remove(id);
    return new ResponseEntity(HttpStatus.OK, '삭제 성공', new AbilityDto(abilityDto));
  }
}
