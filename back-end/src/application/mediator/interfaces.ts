export interface ICommand {}
export type Result = void | string | {};
export interface ICommandHandler<T extends ICommand, Result> {
  handle: (command: T) => Promise<Result>;
}

export interface ICommandValidator<T extends ICommand> {
  validate: (command: T) => Promise<void>;
}

export interface IContainer {
  readonly handlers: { [id: string]: Function };
  readonly validators: { [id: string]: Function };
  readonly cacheCommands: { [id: string]: number };
}

export interface IPipelineBehavior {
  handle: (request: ICommand, next: () => Promise<any>) => Promise<any>;
}
