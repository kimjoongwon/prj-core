import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Patch,
  Delete,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Auth, ApiResponseEntity } from '../decorators';
import { AbilityDto, CreateAbilityDto, UpdateAbilityDto, AbilityQueryDto } from '../dtos';
import { PageMetaDto } from '../dtos/query/page-meta.dto';
import { ResponseEntity } from '../entities/response.entity';
import { AbilitiesService } from '../services';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ABILITIES')
@Controller()
export class AbilitiesController {
  constructor(private readonly service: AbilitiesService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AbilityDto, HttpStatus.OK)
  async createAbility(@Body() createAbilityDto: CreateAbilityDto) {
    const ability = await this.service.create(createAbilityDto);

    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(AbilityDto, ability));
  }

  @Get(':abilityId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AbilityDto, HttpStatus.OK)
  async getAbility(@Param('abilityId') abilityId: string) {
    const ability = await this.service.getUnique({
      where: { id: abilityId },
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(AbilityDto, ability));
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AbilityDto, HttpStatus.OK)
  async removeAbilities(@Body() abilityIds: string[]) {
    const abilitys = await this.service.updateMany({
      where: { id: { in: abilityIds } },
      data: { removedAt: new Date() },
    });
    return new ResponseEntity(HttpStatus.OK, '성공', abilitys.count);
  }

  @Patch(':abilityId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AbilityDto, HttpStatus.OK)
  async updateAbility(
    @Param('abilityId') abilityId: string,
    @Body() updateAbilityDto: UpdateAbilityDto,
  ) {
    const ability = await this.service.update({
      where: { id: abilityId },
      data: updateAbilityDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(AbilityDto, ability));
  }

  @Patch(':abilityId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AbilityDto, HttpStatus.OK)
  async removeAbility(@Param('abilityId') abilityId: string) {
    const ability = await this.service.remove(abilityId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(AbilityDto, ability));
  }

  @Delete(':abilityId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AbilityDto, HttpStatus.OK)
  async deleteAbility(@Param('abilityId') abilityId: string) {
    const ability = await this.service.deleteById(abilityId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(AbilityDto, ability));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AbilityDto, HttpStatus.OK, { isArray: true })
  async getAbilitiesByQuery(@Query() query: AbilityQueryDto) {
    const { count, abilities } = await this.service.getManyByQuery(query);

    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      abilities.map((ability) => ability.toDto()),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}
