import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { Public } from '../../common/decorators';
import { GqlAuthGuard } from '../../common/guards';
import { CreateSpaceInput } from './dto/create-space.input';
import { GetSpacesArgs } from './dto/get-spaces.args';
import { UpdateSpaceInput } from './dto/update-space.input';
import { PaginatedSpace } from './models/paginated-space.model';
import { SpaceForm } from './models/space-form.model';
import { Space } from './models/space.model';

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
