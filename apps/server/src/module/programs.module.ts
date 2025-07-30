import { Module } from "@nestjs/common";
import { ProgramsController } from "@shared";

@Module({
	controllers: [ProgramsController],
})
export class ProgramsModule {}
