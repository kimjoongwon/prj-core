import { AbstractEntity } from './abstract.entity';
import { Exercise as ExcerciseEntity, Task } from '@prisma/client';
import { UseDto } from '../decorators/use-dto.decorator';
import { ExerciseDto } from '../dtos/exercise.dto';

@UseDto(ExerciseDto)
export class Exercise extends AbstractEntity<ExerciseDto> implements ExcerciseEntity {
  private _name: string;
  private _label: string;
  private _duration: number;
  private _count: number;
  private _taskId: string;
  private _depotId: string;
  private _task: Task;

  constructor(
    name: string,
    label: string,
    duration: number,
    count: number,
    taskId: string,
    depotId: string,
    task: Task,
  ) {
    super();
    this._name = name;
    this._label = label;
    this._duration = duration;
    this._count = count;
    this._taskId = taskId;
    this._depotId = depotId;
    this._task = task;
  }

  get name(): string {
    return this._name;
  }

  get label(): string {
    return this._label;
  }

  get duration(): number {
    return this._duration;
  }

  get count(): number {
    return this._count;
  }

  get taskId(): string {
    return this._taskId;
  }

  get depotId(): string {
    return this._depotId;
  }

  get task(): Task {
    return this._task;
  }
}
