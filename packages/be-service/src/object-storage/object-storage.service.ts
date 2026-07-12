import type { PutObjectInput } from "@cocrepo/input";
import type { GetObjectResult } from "./get-object.result";
import type { PutObjectResult } from "./put-object.result";

export abstract class ObjectStorageService {
	abstract putObject(input: PutObjectInput): Promise<PutObjectResult>;
	abstract getObject(key: string): Promise<GetObjectResult>;
	abstract deleteObject(key: string): Promise<void>;
	abstract getPublicUrl(key: string): string | null;
}
