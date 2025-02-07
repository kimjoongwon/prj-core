import { ApiProperty, type ApiPropertyOptions } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';

export class ValidationUtil {
  static validateConfig<T extends object>(
    config: Record<string, unknown>,
    envVariablesClass: ClassConstructor<T>,
  ) {
    const validatedConfig = plainToClass(envVariablesClass, config, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    return validatedConfig;
  }
  static getVariableName<TResult>(getVar: () => TResult): string | undefined {
    const m = /\(\)=>(.*)/.exec(getVar.toString().replace(/(\r\n|\n|\r|\s)/gm, ''));

    if (!m) {
      throw new Error("The function does not contain a statement matching 'return variableName;'");
    }

    const fullMemberName = m[1];

    const memberParts = fullMemberName.split('.');

    return memberParts.at(-1);
  }
}

export function ApiBooleanProperty(options: ApiPropertyOptions = {}): PropertyDecorator {
  return ApiProperty({ type: 'boolean', ...options });
}

export function ApiBooleanPropertyOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> = {},
): PropertyDecorator {
  return ApiBooleanProperty({ required: false, ...options });
}

export function ApiUUIDProperty(
  options: ApiPropertyOptions & Partial<{ each: boolean }> = {},
): PropertyDecorator {
  return ApiProperty({
    type: options.each ? [String] : 'string',
    format: 'uuid',
    isArray: options.each,
    ...options,
  });
}

export function ApiUUIDPropertyOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'format' | 'required'> &
    Partial<{ each: boolean }> = {},
): PropertyDecorator {
  return ApiUUIDProperty({ required: false, ...options });
}

export function ApiEnumProperty<TEnum>(
  getEnum: () => TEnum,
  options: ApiPropertyOptions & { each?: boolean } = {},
): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enumValue = getEnum() as any;

  return ApiProperty({
    // throw error during the compilation of swagger
    // isArray: options.each,
    enum: enumValue,
    enumName: ValidationUtil.getVariableName(getEnum),
    ...options,
  });
}

export function ApiEnumPropertyOptional<TEnum>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & {
    each?: boolean;
  } = {},
): PropertyDecorator {
  return ApiEnumProperty(getEnum, { required: false, ...options });
}
