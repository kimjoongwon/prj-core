import type { UsersRepository } from "@cocrepo/repository";
import type { UserStats } from "@cocrepo/type";

export interface GetUsersResult {
	users: Awaited<ReturnType<UsersRepository["findManyBySpaceIds"]>>["users"];
	totalCount: number;
	stats: UserStats;
}
