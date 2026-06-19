export interface CreateInquiryCommandInput {
	title: string;
	category: any;
	channel: any;
	source?: any;
	priority?: any;
	customerId?: string;
	assigneeId?: string;
	content?: string;
}
