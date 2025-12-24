import { OmitType } from "@nestjs/swagger";
import { User } from "@cocrepo/entity";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { UserDto } from "../user.dto";

export class CreateUserDto extends OmitType(UserDto, [
	...COMMON_ENTITY_FIELDS,
	"associations",
	"tenants",
	"profiles",
	"classification",
]) {
	/**
	 * DTO → Entity 변환
	 */
	toEntity(): User {
		const user = new User();
		user.email = this.email;
		user.name = this.name;
		user.phone = this.phone;
		user.password = this.password;
		// Note: spaceId는 Tenant를 통해 관리됩니다
		return user;
	}
}
