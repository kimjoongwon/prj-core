import {
	type SubjectFieldInfo,
	type SubjectInfo,
	SubjectsService,
} from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SubjectsApplicationService {
	constructor(private readonly subjectsService: SubjectsService) {}

	getSubjectsByGroup(group: string): Promise<SubjectInfo[]> {
		return this.subjectsService.getSubjectsByGroup(group);
	}

	getSubjects(group?: string): Promise<SubjectInfo[]> {
		return group
			? this.subjectsService.getSubjectsByGroup(group)
			: this.subjectsService.getSubjects();
	}

	async getSubjectFields(id: string): Promise<SubjectFieldInfo[]> {
		const subject = await this.subjectsService.getSubjectById(id);
		if (!subject) {
			return [];
		}

		return this.subjectsService.getSubjectFields(subject.name);
	}

	getSubjectById(id: string): Promise<SubjectInfo | null> {
		return this.subjectsService.getSubjectById(id);
	}
}
