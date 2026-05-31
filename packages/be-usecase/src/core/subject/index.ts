import { GetSubjectByIdUseCase } from "./get-subject-by-id.usecase";
import { GetSubjectFieldsUseCase } from "./get-subject-fields.usecase";
import { GetSubjectsUseCase } from "./get-subjects.usecase";

export const SubjectQueryHandlers = [
	GetSubjectsUseCase,
	GetSubjectFieldsUseCase,
	GetSubjectByIdUseCase,
];

export const SubjectCommandHandlers = [];

export * from "./get-subject-by-id.usecase";
export * from "./get-subject-fields.usecase";
export * from "./get-subjects.usecase";
