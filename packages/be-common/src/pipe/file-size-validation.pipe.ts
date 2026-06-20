import {
	type ArgumentMetadata,
	Injectable,
	type PipeTransform,
} from "@nestjs/common";

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
	transform(value: { size: number }, _metadata: ArgumentMetadata): boolean {
		// "value" is an object containing the file's attributes and metadata
		const oneKb = 1000;
		return value.size < oneKb;
	}
}
