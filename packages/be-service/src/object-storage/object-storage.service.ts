import type { GetObjectResult } from "./get-object.result";

export abstract class ObjectStorageService {
	abstract getObject(key: string): Promise<GetObjectResult>;
}
