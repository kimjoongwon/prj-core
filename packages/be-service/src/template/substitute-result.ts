export interface SubstituteResult {
	subject: string | null;
	content: string;
	unresolvedVariables: string[];
}
