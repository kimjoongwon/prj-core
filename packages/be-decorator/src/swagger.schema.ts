import { applyDecorators, type Type, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import {
	ApiBody,
	ApiConsumes,
	ApiExtraModels,
	getSchemaPath,
	type ReferenceObject,
	type SchemaObject,
} from "@nestjs/swagger";
import { castArray, mapValues } from "es-toolkit/compat";

// Many type from lodash - T | readonly T[]
type Many<T> = T | readonly T[];

interface RouteArgumentMetadata {
	index: number;
	data?: string;
}

export interface IApiFile {
	name: string;
	isArray?: boolean;
}

const PARAMTYPES_METADATA = "design:paramtypes";

function reverseObjectKeys(
	originalObject: Record<string, unknown>,
): Record<string, unknown> {
	const reversedObject: Record<string, unknown> = {};
	const keys = Object.keys(originalObject).reverse();

	for (const key of keys) {
		reversedObject[key] = originalObject[key];
	}

	return reversedObject;
}

const ROUTE_ARGS_METADATA = "__routeArguments__";

function explore(instance: object, propertyKey: string | symbol) {
	const types: Array<Type<unknown>> = Reflect.getMetadata(
		PARAMTYPES_METADATA,
		instance,
		propertyKey,
	);
	const routeArgsMetadata =
		Reflect.getMetadata(
			ROUTE_ARGS_METADATA,
			instance.constructor,
			propertyKey,
		) ?? {};

	const parametersWithType = mapValues(
		reverseObjectKeys(routeArgsMetadata as Record<string, unknown>),
		(param: unknown) => {
			const routeArgument = param as RouteArgumentMetadata;
			return {
				type: types[routeArgument.index],
				name: routeArgument.data,
				required: true,
			};
		},
	);

	for (const [key, value] of Object.entries(parametersWithType)) {
		const keyPair = key.split(":");

		if (Number(keyPair[0]) === 3) {
			return value.type;
		}
	}

	return null;
}

function RegisterModels(): MethodDecorator {
	return (target, propertyKey, descriptor: PropertyDescriptor) => {
		const body = explore(target, propertyKey);

		return body && ApiExtraModels(body)(target, propertyKey, descriptor);
	};
}

function ApiFileDecorator(
	files: IApiFile[] = [],
	options: Partial<{ isRequired: boolean }> = {},
): MethodDecorator {
	return (target, propertyKey, descriptor: PropertyDescriptor) => {
		const isRequired = options.isRequired ?? false;
		const fileSchema: SchemaObject = {
			type: "string",
			format: "binary",
		};
		const properties: Record<string, SchemaObject | ReferenceObject> = {};

		for (const file of files) {
			properties[file.name] = file.isArray
				? {
						type: "array",
						items: fileSchema,
					}
				: fileSchema;
		}

		let schema: SchemaObject = {
			properties,
			type: "object",
		};
		const body = explore(target, propertyKey);

		if (body) {
			schema = {
				allOf: [
					{
						$ref: getSchemaPath(body),
					},
					{ properties, type: "object" },
				],
			};
		}

		return ApiBody({
			schema,
			required: isRequired,
		})(target, propertyKey, descriptor);
	};
}

export function ApiFile(
	files: Many<IApiFile>,
	options: Partial<{ isRequired: boolean }> = {},
): MethodDecorator {
	const filesArray = castArray(files);
	const fileNames = filesArray.map((file) => ({ name: file.name }));

	return applyDecorators(
		RegisterModels(),
		ApiConsumes("multipart/form-data"),
		ApiFileDecorator(filesArray, options),
		UseInterceptors(FileFieldsInterceptor(fileNames)),
	);
}
