import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AbilitiesService } from '../../../shared/entities/abilities/abilities.service';
import { CreateAbilityDto } from '../../../shared/entities/abilities/dto/create-ability.dto';
import { UpdateAbilityDto } from '../../../shared/entities/abilities/dto/update-ability.dto';

@Controller('abilities')
export class AbilitiesController {
  constructor(private readonly abilitiesService: AbilitiesService) {}

  @Post()
  create(@Body() createAbilityDto: CreateAbilityDto) {
    return this.abilitiesService.create(createAbilityDto);
  }

  @Get()
  getAbilities() {
    return this.abilitiesService.findAll();
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
