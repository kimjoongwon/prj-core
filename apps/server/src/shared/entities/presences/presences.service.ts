import { Injectable } from '@nestjs/common';
import { CreatePresenceDto } from './dto/create-presence.dto';
import { PresencesRepository } from './presences.repository';

@Injectable()
export class PresencesService {
  constructor(private readonly repository: PresencesRepository) {}
  upsert(createPresenceDto: CreatePresenceDto) {
    return this.repository.upsert({
      where: { id: createPresenceDto?.id },
      create: createPresenceDto,
      update: createPresenceDto,
    });
  }
}
