import { Paginated } from '../../../common/models/paginated.model';
import { ObjectType } from '@nestjs/graphql';
import { Session } from './session.model';

@ObjectType()
export class PaginatedSession extends Paginated(Session) {}
