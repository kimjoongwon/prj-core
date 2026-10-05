export function resolveSmtpSecure(
	smtpSecure: string | undefined,
	smtpPort: number | string | undefined,
): boolean {
	if (smtpSecure !== undefined) {
		return smtpSecure === "true";
	}

	return Number(smtpPort) === 465;
}
