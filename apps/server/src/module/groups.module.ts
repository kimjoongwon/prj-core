import { Module } from "@nestjs/common";
import { GroupsController } from "@shared";

@Module({
  controllers: [GroupsController],
})
export class GroupsModule {}
