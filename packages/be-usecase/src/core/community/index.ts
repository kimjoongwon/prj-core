import { CreateCommunityPostUseCase } from "./create-community-post.usecase";
import { GetCommunityPostsUseCase } from "./get-community-posts.usecase";

export const CommunityQueryHandlers = [GetCommunityPostsUseCase];

export const CommunityCommandHandlers = [CreateCommunityPostUseCase];

export * from "./create-community-post.usecase";
export * from "./get-community-posts.usecase";
