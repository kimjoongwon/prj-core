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
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseEntity } from '../../decorators/api-response-entity.decorator';
import { ResponseEntity } from '../common';
import { AbilitiesService } from './abilities.service';
import { AbilityQueryDto } from './dto/ability-query.dto';
import { AbilityDto } from './dto/ability.dto';
import { CreateAbilityDto } from './dto/create-ability.dto';
import { UpdateAbilityDto } from './dto/update-ability.dto';
import { ApiEndpoints } from '../../types/enums/api-endpoints';

@ApiTags('ADMIN_ABILITIES_2')
@Controller(ApiEndpoints.ADMIN_ABILITIES)
export class AbilitiesController {
  constructor(private readonly abilitiesService: AbilitiesService) {}

  @Post()
  @ApiResponseEntity(AbilityDto, HttpStatus.CREATED)
  async createAbility(@Body() createAbilityDto: CreateAbilityDto) {
    const abilityDto = await this.abilitiesService.create(createAbilityDto);
    return new ResponseEntity(HttpStatus.CREATED, '생성 성공', new AbilityDto(abilityDto));
  }

  @Get()
  @ApiResponseEntity(AbilityDto, HttpStatus.OK, { isArray: true })
  async getAbilitiesByQuery(@Query() pageQuery: AbilityQueryDto) {
    const abilities = await this.abilitiesService.getManyByQuery(pageQuery);
    return new ResponseEntity(
      HttpStatus.OK,
      '조회 성공',
      abilities.map((ability) => new AbilityDto(ability)),
    );
  }

  @Get(':abilityId')
  @ApiResponseEntity(AbilityDto)
  async getAbility(@Param('abilityId') id: string) {
    const ability = await this.abilitiesService.get(id);
    return new ResponseEntity(HttpStatus.OK, '조회 성공', new AbilityDto(ability));
  }

  @Patch(':abilityId')
  @ApiResponseEntity(AbilityDto)
  async updateAbility(@Param('abilityId') id: string, @Body() updateAbilityDto: UpdateAbilityDto) {
    const ability = await this.abilitiesService.update(id, updateAbilityDto);
    return new ResponseEntity(HttpStatus.OK, '수정 성공', new AbilityDto(ability));
  }

  @Patch(':abilityId')
  @ApiResponseEntity(AbilityDto)
  async removeAbility(@Param('abilityId') id: string) {
    const abilityDto = await this.abilitiesService.remove(id);
    return new ResponseEntity(HttpStatus.OK, '삭제 성공', new AbilityDto(abilityDto));
  }

  @Patch(':abilityIds')
  @ApiResponseEntity(AbilityDto)
  async removeAbilities(@Param('abilityIds') ids: string[]) {
    const abilityDto = await this.abilitiesService.removeMany(ids);
    return new ResponseEntity(HttpStatus.OK, '삭제 성공', abilityDto);
  }

  @Delete(':abilityId')
  @ApiResponseEntity(AbilityDto)
  async deleteAbility(@Param('abilityId') id: string) {
    const abilityDto = await this.abilitiesService.remove(id);
    return new ResponseEntity(HttpStatus.OK, '삭제 성공', new AbilityDto(abilityDto));
  }
}
