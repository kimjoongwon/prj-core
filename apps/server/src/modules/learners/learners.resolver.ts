import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LearnersService } from './learners.service';
import { Learner } from './entities/learner.entity';
import { CreateLearnerInput } from './dto/create-learner.input';
import { UpdateLearnerInput } from './dto/update-learner.input';

@Resolver(() => Learner)
export class LearnersResolver {
  constructor(private readonly learnersService: LearnersService) {}

  @Mutation(() => Learner)
  createLearner(@Args('createLearnerInput') createLearnerInput: CreateLearnerInput) {
    return this.learnersService.create(createLearnerInput);
  }

  @Query(() => [Learner], { name: 'learners' })
  findAll() {
    return this.learnersService.findAll();
  }

  @Query(() => Learner, { name: 'learner' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.learnersService.findOne(id);
  }

  @Mutation(() => Learner)
  updateLearner(@Args('updateLearnerInput') updateLearnerInput: UpdateLearnerInput) {
    return this.learnersService.update(updateLearnerInput.id, updateLearnerInput);
  }

  @Mutation(() => Learner)
  removeLearner(@Args('id', { type: () => Int }) id: number) {
    return this.learnersService.remove(id);
  }
}
