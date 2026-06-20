import {
	SubjectAggregate,
	type SubjectFieldInfo,
	type SubjectInfo,
} from "@cocrepo/aggregate";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SubjectFacade {
	constructor(private readonly subjectsService: SubjectAggregate) {}

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
