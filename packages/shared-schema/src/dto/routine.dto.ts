import { Routine } from "@prisma/client";
import { StringField } from "../decorator/field.decorators";
import { AbstractDto } from "./abstract.dto";

export class RoutineDto extends AbstractDto implements Routine {
  @StringField()
  label: string;

  @StringField()
  name: string;
}
