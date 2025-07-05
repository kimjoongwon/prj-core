# @shared/backend

Shared backend utilities and modules for NestJS applications.

## Features

- Database connection and service layer
- Authentication and authorization utilities
- Common guards, decorators, and interceptors
- File management utilities
- Configuration management
- Common DTOs and entities
- Error handling and logging

## Installation

This package is part of the workspace and is automatically available to other packages.

## Usage

### Database Service

```typescript
import { DatabaseService } from "@shared/backend";

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  async findUsers() {
    return this.db.user.findMany();
  }
}
```

### Modules

```typescript
import { DatabaseModule, AuthModule } from "@shared/backend";

@Module({
  imports: [DatabaseModule, AuthModule],
  // ...
})
export class AppModule {}
```

### Guards and Decorators

```typescript
import { JwtGuard, CurrentUser } from "@shared/backend";

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }
}
```

## Structure

- `casl/` - CASL authorization configuration
- `common/` - Common utilities and base classes
- `config/` - Configuration management
- `decorator/` - Custom decorators
- `entity/` - Database entities
- `enum/` - Enums and constants
- `filter/` - Exception filters
- `guard/` - Authentication and authorization guards
- `interceptor/` - Request/response interceptors
- `middleware/` - Custom middleware
- `pipe/` - Validation pipes
- `provider/` - Custom providers
- `repository/` - Data access layer
- `service/` - Business logic services
- `utils/` - Utility functions

## Dependencies

This package depends on:
- `@shared/prisma` - Database client and types
- `@shared/utils` - Common utilities
- `@shared/vars` - Environment variables
- `@shared/types` - Shared TypeScript types
