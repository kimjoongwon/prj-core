import { Resolver, Query, Args, Mutation, ID } from '@nestjs/graphql';
import { ProfilesService } from './profiles.service';
import { Profile } from './models/profile.model';
import { UpdateProfileInput } from './dto/update-profile.input';

@Resolver(() => Profile)
export class ProfilesResolver {
  constructor(private readonly profilesService: ProfilesService) {}

  @Query(() => Profile, { name: 'profile' })
  getProfile(@Args('id', { type: () => ID! }) id: string) {
    return this.profilesService.findOne(id);
  }

  @Mutation(() => Profile)
  updateProfile(
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
  ) {
    return this.profilesService.update(
      updateProfileInput.id,
      updateProfileInput,
    );
  }

  @Mutation(() => Profile)
  removeProfile(@Args('id', { type: () => String }) id: string) {
    return this.profilesService.remove(id);
  }
}
