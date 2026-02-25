"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 242:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ExercisesService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExercisesService = void 0;
const constant_1 = __webpack_require__(4);
const dto_1 = __webpack_require__(243);
const repository_1 = __webpack_require__(51);
const transactional_1 = __webpack_require__(173);
const common_1 = __webpack_require__(46);
const space_context_1 = __webpack_require__(224);
let ExercisesService = ExercisesService_1 = class ExercisesService {
    exercisesRepository;
    spaceContext;
    logger = new common_1.Logger(ExercisesService_1.name);
    constructor(exercisesRepository, spaceContext) {
        this.exercisesRepository = exercisesRepository;
        this.spaceContext = spaceContext;
    }
    async findExercises(params) {
        const { spaceId, spaceScope, skip, take, search } = params;
        this.logger.debug(`운동 종목 목록 조회: spaceScope=${spaceScope}`);
        const spaceIds = spaceScope === dto_1.SpaceScope.INCLUDE_ANCESTORS
            ? this.spaceContext.spaceIds
            : [spaceId];
        const [exercises, total] = await this.exercisesRepository.findManyExercises({
            spaceIds,
            skip,
            take,
            search,
        });
        return { exercises, total };
    }
    async findExerciseById(exerciseId, spaceId, spaceScope = dto_1.SpaceScope.INCLUDE_ANCESTORS) {
        this.logger.debug(`운동 종목 단건 조회: ${exerciseId.slice(-8)}`);
        const spaceIds = spaceScope === dto_1.SpaceScope.INCLUDE_ANCESTORS
            ? this.spaceContext.spaceIds
            : [spaceId];
        const exercise = await this.exercisesRepository.findExerciseById(exerciseId, spaceIds);
        if (!exercise) {
            throw new common_1.NotFoundException(constant_1.EXERCISE_ERRORS.EXERCISE_NOT_FOUND);
        }
        return exercise;
    }
    async findExerciseRoutines(exerciseId, spaceId) {
        this.logger.debug(`운동 종목 관련 루틴 조회: ${exerciseId.slice(-8)}`);
        await this.findExerciseById(exerciseId, spaceId);
        return this.exercisesRepository.findExerciseRoutines(exerciseId);
    }
    async createExercise(dto, spaceId, creatorId) {
        this.logger.debug(`운동 종목 등록: name=${dto.name}`);
        const task = await this.exercisesRepository.createTask({
            spaceId,
            creatorId,
        });
        return this.exercisesRepository.createExercise({
            ...dto,
            taskId: task.id,
        });
    }
    async updateExercise(exerciseId, dto, spaceId) {
        this.logger.debug(`운동 종목 수정: ${exerciseId.slice(-8)}`);
        const exercise = await this.findExerciseById(exerciseId, spaceId, dto_1.SpaceScope.INCLUDE_ANCESTORS);
        if (exercise.task?.spaceId !== spaceId) {
            throw new common_1.ForbiddenException(constant_1.EXERCISE_ERRORS.EXERCISE_NOT_OWNED);
        }
        return this.exercisesRepository.updateExercise(exerciseId, dto);
    }
    async deleteExercise(exerciseId, spaceId) {
        this.logger.debug(`운동 종목 삭제: ${exerciseId.slice(-8)}`);
        const exercise = await this.findExerciseById(exerciseId, spaceId, dto_1.SpaceScope.INCLUDE_ANCESTORS);
        if (exercise.task?.spaceId !== spaceId) {
            throw new common_1.ForbiddenException(constant_1.EXERCISE_ERRORS.EXERCISE_NOT_OWNED);
        }
        const activityCount = await this.exercisesRepository.countActivitiesUsingExercise(exerciseId);
        if (activityCount > 0) {
            throw new common_1.ConflictException(constant_1.EXERCISE_ERRORS.EXERCISE_IN_USE);
        }
        const deleted = await this.exercisesRepository.softDeleteExerciseById(exerciseId);
        await this.exercisesRepository.softDeleteTaskById(deleted.taskId);
    }
};
exports.ExercisesService = ExercisesService;
__decorate([
    (0, transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ExercisesService.prototype, "createExercise", null);
__decorate([
    (0, transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExercisesService.prototype, "deleteExercise", null);
exports.ExercisesService = ExercisesService = ExercisesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.ExercisesRepository, typeof (_a = typeof space_context_1.SpaceContext !== "undefined" && space_context_1.SpaceContext) === "function" ? _a : Object])
], ExercisesService);
//# sourceMappingURL=exercises.service.js.map

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("c76d4510925be80e15f5")
/******/ })();
/******/ 
/******/ }
;