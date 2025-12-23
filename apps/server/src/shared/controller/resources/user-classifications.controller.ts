import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("USER-CLASSIFICATIONS")
@Controller()
export class UserClassificationsController {
	// constructor(private readonly service: UserClassificationsService) {}
	// @Post()
	// @Auth()
	// @HttpCode(HttpStatus.OK)
	// @ApiResponseEntity(UserClassificationDto, HttpStatus.OK)
	// async createUserClassification(@Body() createUserClassificationDto: CreateUserClassificationDto) {
	//   const userClassification = await this.service.create(createUserClassificationDto);
	//   return new ResponseEntity(
	//     HttpStatus.OK,
	//     '성공',
	//     userClassification,
	//   );
	// }
	// @Get(':userClassificationId')
	// @Auth()
	// @HttpCode(HttpStatus.OK)
	// @ApiResponseEntity(UserClassificationDto, HttpStatus.OK)
	// async getUserClassification(@Param('id') id: string) {
	//   const userClassification = await this.service.getById(id);
	//   return new ResponseEntity(
	//     HttpStatus.OK,
	//     '성공',
	//     userClassification,
	//   );
	// }
	// @Patch(':userClassificationId')
	// @Auth()
	// @HttpCode(HttpStatus.OK)
	// @ApiResponseEntity(UserClassificationDto, HttpStatus.OK)
	// async updateUserClassification(
	//   @Param('id') id: string,
	//   @Body() updateUserClassificationDto: UpdateUserClassificationDto,
	// ) {
	//   const userClassification = await this.service.updateById(id, updateUserClassificationDto);
	//   return new ResponseEntity(
	//     HttpStatus.OK,
	//     '성공',
	//     userClassification,
	//   );
	// }
	// @Patch(':userClassificationId/removedAt')
	// @Auth()
	// @HttpCode(HttpStatus.OK)
	// @ApiResponseEntity(UserClassificationDto, HttpStatus.OK)
	// async removeUserClassification(@Param('id') id: string) {
	//   const userClassification = await this.service.removeById(id);
	//   return new ResponseEntity(
	//     HttpStatus.OK,
	//     '성공',
	//     userClassification,
	//   );
	// }
	// @Delete(':userClassificationId')
	// @Auth()
	// @HttpCode(HttpStatus.OK)
	// @ApiResponseEntity(UserClassificationDto, HttpStatus.OK)
	// async deleteUserClassification(@Param('id') id: string) {
	//   const userClassification = await this.service.deleteById(id);
	//   return new ResponseEntity(
	//     HttpStatus.OK,
	//     '성공',
	//     userClassification,
	//   );
	// }
	// @Get()
	// @Auth()
	// @HttpCode(HttpStatus.OK)
	// @ApiResponseEntity(UserClassificationDto, HttpStatus.OK, { isArray: true })
	// async getUserClassificationsByQuery(@Query() query: QueryUserClassificationDto) {
	//   const { items, count } = await this.service.getManyByQuery(query);
	//   return new ResponseEntity(
	//     HttpStatus.OK,
	//     '성공',
	//     items,
	//     query.toPageMetaDto(count),
	//   );
	// }
}
