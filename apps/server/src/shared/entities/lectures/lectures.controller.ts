import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LecturesService } from './lectures.service';
import { ResponseEntity, PageMetaDto } from '../common';
import { CreateLectureDto, LectureDto, UpdateLectureDto, LectureQueryDto } from './dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ApiEndpoints } from '../../types/enums/api-endpoints';
import { Auth } from '../../decorators/auth.decorator';
import { ApiResponseEntity } from '../../decorators/api-response-entity.decorator';

@ApiTags('ADMIN_LECTURES')
@Controller(ApiEndpoints.LECTURES)
export class LecturesController {
  constructor(private readonly service: LecturesService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(LectureDto, HttpStatus.OK)
  async createLecture(@Body() createLectureDto: CreateLectureDto) {
    const lecture = await this.service.create({
      data: createLectureDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToClass(LectureDto, lecture));
  }

  @Get(':lectureId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(LectureDto, HttpStatus.OK)
  async getLecture(@Param('lectureId') lectureId: string) {
    const lecture = await this.service.getUnique({
      where: {
        id: lectureId,
      },
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(LectureDto, lecture));
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(LectureDto, HttpStatus.OK)
  async removeLectures(@Body() lectureIds: string[]) {
    const lectures = await this.service.removeMany({
      where: {
        id: {
          in: lectureIds,
        },
      },
      data: {
        removedAt: new Date(),
      },
    });
    return new ResponseEntity(HttpStatus.OK, '성공', lectures.count);
  }

  @Patch(':lectureId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(LectureDto, HttpStatus.OK)
  async updateLecture(
    @Param('lectureId') lectureId: string,
    @Body() updateLectureDto: UpdateLectureDto,
  ) {
    const lecture = await this.service.update({
      where: {
        id: lectureId,
      },
      data: updateLectureDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(LectureDto, lecture));
  }

  @Patch(':lectureId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(LectureDto, HttpStatus.OK)
  async removeLecture(@Param('lectureId') lectureId: string) {
    const lecture = await this.service.remove({
      where: {
        id: lectureId,
      },
      data: {
        removedAt: new Date(),
      },
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(LectureDto, lecture));
  }

  @Delete(':lectureId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(LectureDto, HttpStatus.OK)
  async deleteLecture(@Param('lectureId') lectureId: string) {
    const lecture = await this.service.delete({
      where: {
        id: lectureId,
      },
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(LectureDto, lecture));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(LectureDto, HttpStatus.OK, { isArray: true })
  async getLecturesByQuery(
    @Query() query: LectureQueryDto,
    @Headers('tenant-id') tenantId: string,
  ) {
    const { count, lectures } = await this.service.getManyByQuery(query.toArgs(tenantId));
    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      lectures.map((lecture) => plainToInstance(LectureDto, lecture)),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}
