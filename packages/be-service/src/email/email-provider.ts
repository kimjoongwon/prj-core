import type { EmailSendInput } from "./email-send-input";

export abstract class EmailProvider {
	abstract send(input: EmailSendInput): Promise<void>;
}
