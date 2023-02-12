import { IContainer } from './interfaces';

export const container: IContainer = {
  handlers: {},
  validators: {},
  cacheCommands: {},
};

// https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators
export function RegisterHandler<T>(handler: { new (): T }): void {
  const handlerName = handler.name.toString();
  if (handlerName) container.handlers[handlerName] = handler;

  // console.log(handler);
  // console.log({ handlerName });
  // console.log(`${handlerName}Handler`);
  // console.log({ handlerCode: handler.toString() });
}

export function RegisterValidator<T>(validator: { new (): T }): void {
  const validatorName = validator.name.toString();
  if (validatorName) container.validators[validatorName] = validator;
}

// https://dev.to/danywalls/decorators-in-typescript-with-example-part-1-m0f
export function RegisterCacheCommand(ttlSeconds: number) {
  return function (constructor: Function) {
    const commandName = constructor.name.toString();
    if (commandName) container.cacheCommands[commandName] = ttlSeconds;
  };
}
