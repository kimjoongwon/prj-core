import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { GetSessionsArgs } from './dto/get-sessions.args';
import { CreateSessionInput } from './dto/create-session.input';
import { UpdateSessionInput } from './dto/update-session.input';
import { PaginatedSession } from './models/paginated-session.model';
import { SessionForm } from './models/session-form.model';
import { Session } from './models/session.model';

@Resolver(() => Session)
@UseGuards(GqlAuthGuard)
export class SessionsResolver {
  constructor(private readonly sessionsService: SessionsService) {}

  @Public()
  @Mutation(() => Session)
  createSession(
    @Args('createSessionInput')
    createSessionInput: CreateSessionInput,
  ) {
    return this.sessionsService.create(createSessionInput);
  }

  @Public()
  @Mutation(() => Session)
  updateSession(
    @Args('updateSessionInput')
    updateSessionInput: UpdateSessionInput,
  ) {
    return this.sessionsService.update(updateSessionInput);
  }

  @Public()
  @Mutation(() => Session)
  deleteSession(@Args('id') id: string) {
    return this.sessionsService.delete(id);
  }

  @Public()
  @Query(() => Session, { name: 'session' })
  getSession(@Args('id') id: string) {
    return this.sessionsService.findOne(id);
  }

  @Public()
  @Query(() => SessionForm, { name: 'sessionForm' })
  getSessionForm(@Args('id') id: string) {
    return this.sessionsService.findForm(id);
  }

  @Public()
  @Query(() => PaginatedSession, { name: 'sessions' })
  getSessions(@Args() args: GetSessionsArgs) {
    return this.sessionsService.findPaginatedSession(args);
  }
}
