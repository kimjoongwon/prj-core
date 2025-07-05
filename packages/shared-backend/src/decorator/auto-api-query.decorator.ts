import { Type } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { getMetadataStorage } from 'class-validator';
import 'reflect-metadata';

/**
 * 자동으로 Query DTO의 속성들을 Swagger에 표시하는 메서드 데코레이터
 * AutoBaseController의 getManyByQuery 메서드에 자동으로 적용됩니다.
 */
export function AutoApiQuery(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    return originalMethod.apply(this, args);
  };

  // 런타임에 queryDtoClass가 있다면 ApiQuery 메타데이터를 동적으로 추가
  setTimeout(() => {
    if (target.constructor.prototype.queryDtoClass) {
      const queryDtoClass = target.constructor.prototype.queryDtoClass;
      applyApiQueryMetadata(target.constructor, propertyKey, queryDtoClass);
    }
  }, 0);

  return descriptor;
}

function applyApiQueryMetadata(targetClass: any, methodName: string, queryDtoClass: Type<any>) {
  try {
    // class-validator 메타데이터에서 속성 정보를 추출
    const metadataStorage = getMetadataStorage();
    const validationMetadatas = metadataStorage.getTargetValidationMetadatas(
      queryDtoClass,
      null,
      false,
      false,
    );

    // 속성별로 그룹화
    const propertyMetadata: { [key: string]: any } = {};

    validationMetadatas.forEach((metadata) => {
      if (!propertyMetadata[metadata.propertyName]) {
        propertyMetadata[metadata.propertyName] = {
          name: metadata.propertyName,
          required: true,
          type: 'string',
          description: metadata.propertyName,
        };
      }

      // 각 제약 조건에 따라 타입과 옵션 설정
      switch (metadata.type) {
        case 'isOptional':
          propertyMetadata[metadata.propertyName].required = false;
          break;
        case 'isNumber':
        case 'isInt':
          propertyMetadata[metadata.propertyName].type = 'number';
          break;
        case 'isString':
          propertyMetadata[metadata.propertyName].type = 'string';
          break;
        case 'isBoolean':
          propertyMetadata[metadata.propertyName].type = 'boolean';
          break;
        case 'min':
          if (metadata.constraints && metadata.constraints[0]) {
            propertyMetadata[metadata.propertyName].minimum = metadata.constraints[0];
          }
          break;
        case 'max':
          if (metadata.constraints && metadata.constraints[0]) {
            propertyMetadata[metadata.propertyName].maximum = metadata.constraints[0];
          }
          break;
      }
    });

    // Reflect 메타데이터에서 추가 정보 추출
    const propertyKeys = Object.getOwnPropertyNames(queryDtoClass.prototype);

    propertyKeys.forEach((key) => {
      if (key !== 'constructor') {
        const designType = Reflect.getMetadata('design:type', queryDtoClass.prototype, key);

        if (!propertyMetadata[key]) {
          propertyMetadata[key] = {
            name: key,
            required: false,
            type: 'string',
            description: key,
          };
        }

        // 타입 정보 보완
        if (designType === Number) {
          propertyMetadata[key].type = 'number';
        } else if (designType === Boolean) {
          propertyMetadata[key].type = 'boolean';
        } else if (designType === String) {
          propertyMetadata[key].type = 'string';
        }
      }
    });

    // 각 속성에 대해 ApiQuery 메타데이터 적용
    Object.values(propertyMetadata).forEach((property: any) => {
      ApiQuery({
        name: property.name,
        required: property.required,
        type: property.type,
        description: property.description,
        ...(property.minimum !== undefined && { minimum: property.minimum }),
        ...(property.maximum !== undefined && { maximum: property.maximum }),
      })(
        targetClass,
        methodName,
        Object.getOwnPropertyDescriptor(targetClass.prototype, methodName)!,
      );
    });
  } catch (error) {
    console.warn('AutoApiQuery: 메타데이터 추출 실패, 기본 파라미터만 추가합니다.', error);
  }
}
