import {
	ClassField,
	EnumField,
	StringField,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator/field";
import { FitnessCenter } from "@cocrepo/entity";
import { LanguageCode } from "@cocrepo/prisma";
import { PickType } from "@nestjs/swagger";
import { FitnessCenterSpaceDto } from "../fitness-center.dto";

export class CreateFitnessCenterDto extends PickType(FitnessCenter, [
	"address",
	"phone",
	"email",
	"imageFileId",
] as const) {
	// 이름/라벨은 Space가 소유하므로 FitnessCenter가 아닌 요청 선언에서 직접 정의합니다.
	@StringField()
	name: string;

	@StringFieldOptional({ nullable: true })
	label: string | null;

	// 생성 요청은 전체 Space가 아닌 기존 최소 투영을 받습니다.
	@ClassField(() => FitnessCenterSpaceDto, { required: false, nullable: true })
	space?: FitnessCenterSpaceDto | null;

	@EnumField(() => LanguageCode, {
		description: "이 Space에서 작성되는 운영 리소스의 콘텐츠 언어",
		default: LanguageCode.ko_KR,
	})
	contentLanguageCode: LanguageCode;

	@StringField()
	businessNo: string;

	@UUIDFieldOptional({ nullable: true })
	logoImageFileId: string | null;
}
