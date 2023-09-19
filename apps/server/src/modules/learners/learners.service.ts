import { Injectable } from '@nestjs/common';
import { CreateLearnerInput } from './dto/create-learner.input';
import { UpdateLearnerInput } from './dto/update-learner.input';

@Injectable()
export class LearnersService {
  create(createLearnerInput: CreateLearnerInput) {
    return 'This action adds a new learner';
  }

  findAll() {
    return `This action returns all learners`;
  }

  findOne(id: number) {
    return `This action returns a #${id} learner`;
  }

  update(id: number, updateLearnerInput: UpdateLearnerInput) {
    return `This action updates a #${id} learner`;
  }

  remove(id: number) {
    return `This action removes a #${id} learner`;
  }
}
