import { Injectable } from '@nestjs/common';
import { AbilitiesService } from '../../entities/abilities/abilities.service';

@Injectable()
export class AbilityService {
  constructor(private readonly abilitiesService: AbilitiesService) {}
}
