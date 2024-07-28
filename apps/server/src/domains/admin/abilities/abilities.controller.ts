import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AbilitiesService } from '../../../shared/entities/abilities/abilities.service';
import { CreateAbilityDto } from '../../../shared/entities/abilities/dto/create-ability.dto';
import { UpdateAbilityDto } from '../../../shared/entities/abilities/dto/update-ability.dto';
import { AbilityDto, ApiResponseEntity, Auth, Public, ResponseEntity } from '@shared';
import { ApiTags } from '@nestjs/swagger';
import { AbilityPageQuery } from 'src/shared/entities/abilities/dto/ability-page-options.dto';

@ApiTags('abilities')
@Controller()
export class AbilitiesController {
  constructor(private readonly abilitiesService: AbilitiesService) {}

  @Post()
  @ApiResponseEntity(AbilityDto)
  async create(@Body() createAbilityDto: CreateAbilityDto) {
    const abilityDto = await this.abilitiesService.create(createAbilityDto);
    return abilityDto;
  }

  @Get()
  @Public()
  @ApiResponseEntity(AbilityDto, { isArray: true })
  async findAllAblity(@Query() pageQuery: AbilityPageQuery) {
    const abilities = await this.abilitiesService.getAbilitiesByPageOptions(pageQuery);
    return abilities;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.abilitiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAbilityDto: UpdateAbilityDto) {
    return this.abilitiesService.update(+id, updateAbilityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.abilitiesService.remove(+id);
  }
}
