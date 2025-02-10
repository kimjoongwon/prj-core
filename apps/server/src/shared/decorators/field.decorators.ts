import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  NotEquals,
  ValidateNested,
} from 'class-validator';

import { ApiEnumProperty, ApiUUIDProperty } from './property.decorators';
import { InputProps } from '@heroui/react';

import {
  PhoneNumberSerializer,
  ToArray,
  ToBoolean,
  ToLowerCase,
  ToUpperCase,
} from './transform.decorators';

import {
  IsNullable,
  IsPassword,
  IsPhoneNumber,
  IsTmpKey as IsTemporaryKey,
  IsUndefinable,
} from './validator.decorators';
import { Constructor } from '../constants/types';
import { InputBuilder, ValidationBuilder } from '@shared/types';
import { inputModules } from '../domains';

interface IFieldOptions extends Omit<InputProps, 'type'> {
  required?: boolean;
  each?: boolean;
  swagger?: boolean;
  nullable?: boolean;
  groups?: string[];
  formType?: string;
  sectionName?: string;
}

interface INumberFieldOptions extends IFieldOptions {
  min?: number;
  max?: number;
  int?: boolean;
  isPositive?: boolean;
}

interface IStringFieldOptions extends IFieldOptions {
  minLength?: number;
  maxLength?: number;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
}

type IBooleanFieldOptions = IFieldOptions;
type IEnumFieldOptions = IFieldOptions;

export const SectionNameKey = 'section-name';
export const FormTypeKey = 'form-type';
export const ValidationKey = 'validation';

export function Input(input: InputBuilder) {
  return (target: any, propertyKey: string) => {
    input.path = 'form.inputs.' + propertyKey;
    Reflect.defineMetadata(FormTypeKey, input, target, propertyKey);
  };
}

export function SectionName(name: string) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata(SectionNameKey, name, target, propertyKey);
  };
}

export function NumberField(
  options: Omit<ApiPropertyOptions, 'type'> & INumberFieldOptions = {},
): PropertyDecorator {
  const decorators = [Type(() => Number)];
  decorators.push(Default(options.default));
  decorators.push(
    Input({
      type: options.formType || 'Input',
      props: {
        type: 'number',
        label: options.label,
        placeholder: options.placeholder,
      } as InputProps,
      validation: {
        type: 'number',
        min: options.min,
        max: options.max,
        required: options.required || true,
        errorMessages: {
          min: options.min ? `최소값은 ${options.min}입니다.` : undefined,
          max: options.max ? `최대값은 ${options.max}입니다.` : undefined,
        },
      },
    }),
  );

  decorators.push(SectionName(options.sectionName));

  if (options.nullable) {
    decorators.push(IsNullable({ each: options.each }));
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: 'number', ...options }));
  }

  if (options.each) {
    decorators.push(ToArray());
  }

  if (options.int) {
    decorators.push(IsInt({ each: options.each }));
  } else {
    decorators.push(IsNumber({}, { each: options.each }));
  }

  if (typeof options.min === 'number') {
    decorators.push(Min(options.min, { each: options.each }));
  }

  if (typeof options.max === 'number') {
    decorators.push(Max(options.max, { each: options.each }));
  }

  if (options.isPositive) {
    decorators.push(IsPositive({ each: options.each }));
  }

  return applyDecorators(...decorators);
}

export function NumberFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & INumberFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(IsUndefinable(), NumberField({ required: false, ...options }));
}

export function Validation(validation: ValidationBuilder) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata(ValidationKey, validation, target, propertyKey);
  };
}

export function FormType(type: keyof typeof inputModules) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata(FormTypeKey, type, target, propertyKey);
  };
}

export const DefaultKey = 'default';

export function Default(value: any) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata(DefaultKey, value, target, propertyKey);
  };
}

export function StringField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [Type(() => String), IsString({ each: options.each })];

  decorators.push(Default(options.default));

  decorators.push(
    Input({
      type: options.formType || 'Input',
      props: {
        label: options.label,
        placeholder: options.placeholder,
      } as InputProps,
      path: '',
      validation: {
        type: 'string',
        minLength: options.minLength || 1,
        maxLength: options.maxLength,
        required: options.required || true,
        pattern: options.pattern,
        errorMessages: {
          pattern: options.pattern ? `형식이 올바르지 않습니다.` : undefined,
          minLength: `최소 ${options.minLength || 1}자 이상 입력해주세요.`,
          maxLength: options.maxLength
            ? `최대 ${options.maxLength}자까지 입력 가능합니다.`
            : undefined,
          required: options.required ? `필수 입력 항목입니다.` : undefined,
        },
      },
    }),
  );

  decorators.push(SectionName(options.sectionName));

  if (options.nullable) {
    decorators.push(
      Transform(({ value }) => (value === 'null' ? null : value), { toClassOnly: true }),
    );
    decorators.push(IsNullable({ each: options.each }));
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: String, ...options, isArray: options.each }));
  }
  const minLength = options.minLength || 1;

  decorators.push(MinLength(minLength, { each: options.each }));

  if (options.maxLength) {
    decorators.push(MaxLength(options.maxLength, { each: options.each }));
  }

  if (options.toLowerCase) {
    decorators.push(ToLowerCase());
  }

  if (options.toUpperCase) {
    decorators.push(ToUpperCase());
  }

  return applyDecorators(...decorators);
}

export function StringFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(IsUndefinable(), StringField({ required: false, ...options }));
}

export function PasswordField(
  options: Omit<ApiPropertyOptions, 'type' | 'minLength'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [StringField({ ...options, minLength: 6 }), IsPassword()];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  return applyDecorators(...decorators);
}

export function PasswordFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'minLength'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(IsUndefinable(), PasswordField({ required: false, ...options }));
}

export function BooleanField(
  options: Omit<ApiPropertyOptions, 'type'> & IBooleanFieldOptions = {},
): PropertyDecorator {
  const decorators = [ToBoolean(), IsBoolean()];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Boolean, ...options }));
  }

  return applyDecorators(...decorators);
}

export function BooleanFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & IBooleanFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(IsUndefinable(), BooleanField({ required: false, ...options }));
}

export function TmpKeyField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [StringField(options), IsTemporaryKey({ each: options.each })];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: String, ...options, isArray: options.each }));
  }

  return applyDecorators(...decorators);
}

export function TmpKeyFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(IsUndefinable(), TmpKeyField({ required: false, ...options }));
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function EnumField<TEnum extends object>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'enum' | 'enumName' | 'isArray'> &
    IEnumFieldOptions = {},
): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types
  const enumValue = getEnum();
  const decorators = [IsEnum(enumValue, { each: options.each })];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.each) {
    decorators.push(ToArray());
  }

  if (options.swagger !== false) {
    decorators.push(ApiEnumProperty(getEnum, { ...options, isArray: options.each }));
  }

  return applyDecorators(...decorators);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function EnumFieldOptional<TEnum extends object>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'enum' | 'enumName'> &
    IEnumFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(IsUndefinable(), EnumField(getEnum, { required: false, ...options }));
}

export function EmailField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [IsEmail(), StringField({ toLowerCase: true, ...options })];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: String, ...options }));
  }

  return applyDecorators(...decorators);
}

export function EmailFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(IsUndefinable(), EmailField({ required: false, ...options }));
}

export function PhoneField(
  options: Omit<ApiPropertyOptions, 'type'> & IFieldOptions = {},
): PropertyDecorator {
  const decorators = [IsPhoneNumber(), PhoneNumberSerializer()];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: String, ...options }));
  }

  return applyDecorators(...decorators);
}

export function PhoneFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & IFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(IsUndefinable(), PhoneField({ required: false, ...options }));
}

export function UUIDField(
  options: Omit<ApiPropertyOptions, 'type' | 'format' | 'isArray'> & IFieldOptions = {},
): PropertyDecorator {
  const decorators = [Type(() => String)];

  decorators.push(Default(options.default));

  if (options.nullable) {
    decorators.push(
      Transform(({ value }) => (value === 'null' ? null : value), { toClassOnly: true }),
    );
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  decorators.push(ApiUUIDProperty(options));

  if (options.each) {
    decorators.push(ToArray());
  }

  return applyDecorators(...decorators);
}

export function UUIDFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'isArray'> & IFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(IsUndefinable(), UUIDField({ required: false, ...options }));
}

export function URLField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [StringField(options), IsUrl({}, { each: true })];

  if (options.nullable) {
    decorators.push(IsNullable({ each: options.each }));
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  return applyDecorators(...decorators);
}

export function URLFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(IsUndefinable(), URLField({ required: false, ...options }));
}

export function DateField(
  options: Omit<ApiPropertyOptions, 'type'> & IFieldOptions = {},
): PropertyDecorator {
  const decorators = [Type(() => Date), IsDate()];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Date, ...options }));
  }

  return applyDecorators(...decorators);
}

export function DateFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & IFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(IsUndefinable(), DateField({ ...options, required: false }));
}

type IClassFieldOptions = IFieldOptions;

// eslint-disable-next-line @typescript-eslint/ban-types
export function ClassField<TClass extends Constructor>(
  getClass: () => TClass,
  options: Omit<ApiPropertyOptions, 'type'> & IClassFieldOptions = {},
): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const classValue = getClass();

  const decorators = [Type(() => classValue), ValidateNested({ each: options.each })];

  if (options.required !== false) {
    decorators.push(IsDefined());
  }

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(
      ApiProperty({
        type: () => getClass(),
        ...options,
      }),
    );
  }

  if (options.each) {
    decorators.push(ToArray());
  }
  return applyDecorators(...decorators);
}
