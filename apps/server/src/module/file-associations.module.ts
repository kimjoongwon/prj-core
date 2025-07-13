import { Module } from "@nestjs/common";
import { FileAssociationsController } from "@shared";

@Module({
  controllers: [FileAssociationsController],
})
export class FileAssociationsModule {}
