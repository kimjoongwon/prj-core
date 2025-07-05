import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';

export class ValidationUtil {
  static validateConfig<T extends object>(
    config: Record<string, unknown>,
    envVariablesClass: ClassConstructor<T>,
  ) {
    const validatedConfig = plainToClass(envVariablesClass, config, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    return validatedConfig;
  }
  static getVariableName<TResult>(getVar: () => TResult): string | undefined {
    const m = /\(\)=>(.*)/.exec(
      getVar.toString().replace(/(\r\n|\n|\r|\s)/gm, ''),
    );

    if (!m) {
      throw new Error(
        "The function does not contain a statement matching 'return variableName;'",
      );
    }

    const fullMemberName = m[1];

    const memberParts = fullMemberName.split('.');

    return memberParts.at(-1);
  }
}
