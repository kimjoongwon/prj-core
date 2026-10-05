import { CreateProgramUseCase } from "./create-program.usecase";
import { CreateSessionUseCase } from "./create-session.usecase";
import { CreateTimelineUseCase } from "./create-timeline.usecase";
import { DeleteProgramUseCase } from "./delete-program.usecase";
import { DeleteSessionUseCase } from "./delete-session.usecase";
import { DeleteTimelineUseCase } from "./delete-timeline.usecase";
import { GetProgramByIdUseCase } from "./get-program-by-id.usecase";
import { GetProgramsUseCase } from "./get-programs.usecase";
import { GetSessionByIdUseCase } from "./get-session-by-id.usecase";
import { GetSessionsUseCase } from "./get-sessions.usecase";
import { GetTimelineByIdUseCase } from "./get-timeline-by-id.usecase";
import { GetTimelinesUseCase } from "./get-timelines.usecase";
import { UpdateProgramUseCase } from "./update-program.usecase";
import { UpdateSessionUseCase } from "./update-session.usecase";
import { UpdateTimelineUseCase } from "./update-timeline.usecase";

export const TimelineQueryHandlers = [
	GetTimelinesUseCase,
	GetTimelineByIdUseCase,
	GetSessionsUseCase,
	GetSessionByIdUseCase,
	GetProgramsUseCase,
	GetProgramByIdUseCase,
];

export const TimelineCommandHandlers = [
	CreateTimelineUseCase,
	UpdateTimelineUseCase,
	DeleteTimelineUseCase,
	CreateSessionUseCase,
	UpdateSessionUseCase,
	DeleteSessionUseCase,
	CreateProgramUseCase,
	UpdateProgramUseCase,
	DeleteProgramUseCase,
];

export * from "./create-program.usecase";
export * from "./create-session.usecase";
export * from "./create-timeline.usecase";
export * from "./delete-program.usecase";
export * from "./delete-session.usecase";
export * from "./delete-timeline.usecase";
export * from "./get-program-by-id.usecase";
export * from "./get-programs.usecase";
export * from "./get-session-by-id.usecase";
export * from "./get-sessions.usecase";
export * from "./get-timeline-by-id.usecase";
export * from "./get-timelines.usecase";
export * from "./update-program.usecase";
export * from "./update-session.usecase";
export * from "./update-timeline.usecase";
