/**
 * 여러 데코레이터를 하나로 합치는 유틸리티 함수
 * NestJS의 applyDecorators와 동일한 기능을 제공
 */
export function applyDecorators(
	...decorators: PropertyDecorator[]
): PropertyDecorator {
	return (target: object, propertyKey: string | symbol) => {
		for (const decorator of decorators) {
			decorator(target, propertyKey);
		}
	};
}
