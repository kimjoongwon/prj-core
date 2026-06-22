import type { EmailSendInput } from "@cocrepo/input";

export abstract class EmailProvider {
	abstract send(input: EmailSendInput): Promise<void>;
}
