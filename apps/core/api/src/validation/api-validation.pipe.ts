import { CreateRoleDto, UpdateRoleDto } from "@cocrepo/dto";
import { type ArgumentMetadata, ValidationPipe } from "@nestjs/common";

/** API의 기본 whitelist 정책과 역할 쓰기 요청의 엄격한 허용 목록을 적용합니다. */
export class ApiValidationPipe extends ValidationPipe {
	private readonly roleInputPipe = new ValidationPipe({
		transform: true,
		whitelist: true,
		forbidNonWhitelisted: true,
	});

	constructor() {
		super({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: false,
		});
	}

	transform(payload: unknown, metadata: ArgumentMetadata): Promise<unknown> {
		// 전역 whitelist가 속성을 제거하기 전에 Role의 금지 입력을 거부해야 합니다.
		if (
			metadata.type === "body" &&
			(metadata.metatype === CreateRoleDto ||
				metadata.metatype === UpdateRoleDto)
		) {
			return this.roleInputPipe.transform(payload, metadata);
		}

		return super.transform(payload, metadata);
	}
}
