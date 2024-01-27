import { BadRequestException, ValidationError } from '@nestjs/common';

export const VALIDATION_PIPE_OPTIONS = {
  stopAtFirstError: true, // When set to true, validation of the given property will stop after encountering the first error. Defaults to false.
  enableDebugMessages: true, // If set to true, validator will print extra warning messages to the console when something is not right.
  whitelist: true, // If set to true, validator will strip validated (returned) object of any properties that do not use any validation decorators.
  exceptionFactory: (errors: ValidationError[]) => {
    const firstError = errors[0];
    let message = 'ValidationPipeError';

    // Validate if the error doesn't have children
    if (firstError.constraints) {
      const firstErrorKey = Object.keys(firstError.constraints)[0];
      message = firstError.constraints[firstErrorKey];
    } else {
      const firstChild = firstError.children[0];
      const firstChildError = firstChild.children[0];
      const firstChildErrorKey = Object.keys(firstChildError.constraints)[0];
      message = `Property '${firstError.property}' position ${firstChild.property}: ${firstChildError.constraints[firstChildErrorKey]}`;
    }

    return new BadRequestException(message);
  },
};
