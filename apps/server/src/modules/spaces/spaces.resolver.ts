import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, Public } from '@common';
import { SpacesService } from './spaces.service';
import { PaginatedSpace, Space, SpaceForm } from './models/index';
import { CreateSpaceInput, GetSpacesArgs, UpdateSpaceInput } from './dto/index';

@Resolver(() => Space)
@UseGuards(GqlAuthGuard)
export class SpacesResolver {
  constructor(private readonly spacesService: SpacesService) {}

  @Public()
  @Mutation(() => Space)
  createSpace(
    @Args('createSpaceInput')
    createSpaceInput: CreateSpaceInput,
  ) {
    return this.spacesService.create(createSpaceInput);
  }

  @Public()
  @Mutation(() => Space)
  updateSpace(
    @Args('updateSpaceInput')
    updateSpaceInput: UpdateSpaceInput,
  ) {
    return this.spacesService.update(updateSpaceInput);
  }

  @Public()
  @Mutation(() => Space)
  deleteSpace(@Args('id') id: string) {
    return this.spacesService.delete(id);
  }

  @Public()
  @Query(() => Space, { name: 'space' })
  getSpace(@Args('id') id: string) {
    return this.spacesService.findOne(id);
  }

  @Public()
  @Query(() => SpaceForm, { name: 'spaceForm' })
  getSpaceForm(@Args('id') id: string) {
    return this.spacesService.findForm(id);
  }

  @Public()
  @Query(() => PaginatedSpace, { name: 'spaces' })
  getSpaces(@Args() args: GetSpacesArgs) {
    return this.spacesService.findPaginatedSpace(args);
  }
}
