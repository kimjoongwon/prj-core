import { Template } from "@cocrepo/entity";
import { TemplatesRepository } from "@cocrepo/repository";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import type { RenderedTemplateResult } from "./rendered-template-result";
import type { SubstituteResult } from "./substitute-result";

@Injectable()
export class TemplateService {
	constructor(private readonly repository: TemplatesRepository) {}

	async renderByCode(
		code: string,
		variables: Record<string, string>,
	): Promise<RenderedTemplateResult> {
		const template = await this.repository.findByCode(code);
		if (!template) {
			throw new NotFoundException(`템플릿을 찾을 수 없습니다: ${code}`);
		}
		if (!template.isEnabled()) {
			throw new BadRequestException(
				`비활성 템플릿은 사용할 수 없습니다: ${code}`,
			);
		}

		this.validateRequiredVariables(template, variables);
		const substituted = this.substituteVariables(template, variables);

		if (substituted.unresolvedVariables.length > 0) {
			throw new BadRequestException(
				`템플릿 변수 치환에 실패했습니다: ${substituted.unresolvedVariables.join(", ")}`,
			);
		}

		return {
			type: template.type,
			subject: substituted.subject,
			content: substituted.content,
			unresolvedVariables: substituted.unresolvedVariables,
		};
	}

	private validateRequiredVariables(
		template: Template,
		variables: Record<string, string>,
	): void {
		if (!template.variables || template.variables.length === 0) {
			return;
		}

		const missingVariables = template.variables
			.filter(
				(variable) =>
					variable.isRequired &&
					!variables[variable.name] &&
					!variable.defaultValue,
			)
			.map((variable) => variable.name);

		if (missingVariables.length > 0) {
			throw new BadRequestException(
				`필수 변수가 누락되었습니다: ${missingVariables.join(", ")}`,
			);
		}
	}

	private substituteVariables(
		template: Template,
		variables: Record<string, string>,
	): SubstituteResult {
		let subject = template.subject;
		let content = template.content;

		for (const [key, value] of Object.entries(variables)) {
			const placeholder = `{{${key}}}`;
			if (subject) {
				subject = subject.replaceAll(placeholder, value);
			}
			content = content.replaceAll(placeholder, value);
		}

		if (template.variables && template.variables.length > 0) {
			for (const variable of template.variables) {
				if (variable.defaultValue) {
					const placeholder = `{{${variable.name}}}`;
					if (subject) {
						subject = subject.replaceAll(placeholder, variable.defaultValue);
					}
					content = content.replaceAll(placeholder, variable.defaultValue);
				}
			}
		}

		const unresolvedRegex = /\{\{(\w+)\}\}/g;
		const unresolvedSet = new Set<string>();
		let match: RegExpExecArray | null;

		if (subject) {
			match = unresolvedRegex.exec(subject);
			while (match !== null) {
				unresolvedSet.add(match[1]);
				match = unresolvedRegex.exec(subject);
			}
		}

		unresolvedRegex.lastIndex = 0;
		match = unresolvedRegex.exec(content);
		while (match !== null) {
			unresolvedSet.add(match[1]);
			match = unresolvedRegex.exec(content);
		}

		return {
			subject,
			content,
			unresolvedVariables: [...unresolvedSet],
		};
	}
}
