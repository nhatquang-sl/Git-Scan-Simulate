import { BadRequestError } from '@application/common/exceptions';
import {
  RegisterHandler,
  ICommandHandler,
  ICommand,
  RegisterValidator,
  ICommandValidator,
} from '@application/mediator';

import { ScanEvent } from '@database';

export class TriggerScanEventResult {
  id: number;
  repoName: string;
  createdAt: number;

  constructor(entity: ScanEvent) {
    this.id = entity.id;
    this.repoName = entity.repoName;
    this.createdAt = new Date(entity.createdAt).getTime();
  }
}

export class TriggerScanEventCommand implements ICommand {
  repoName: string;
  constructor(repoName: string) {
    this.repoName = repoName;
  }
}

@RegisterHandler
export class TriggerScanEventCommandHandler
  implements ICommandHandler<TriggerScanEventCommand, TriggerScanEventResult>
{
  async handle(command: TriggerScanEventCommand): Promise<TriggerScanEventResult> {
    const { repoName } = command;

    const entity = await ScanEvent.create({
      repoName: repoName,
    } as ScanEvent);

    return new TriggerScanEventResult(entity);
  }
}

@RegisterValidator
export class TriggerScanEventCommandValidator
  implements ICommandValidator<TriggerScanEventCommand>
{
  async validate(command: TriggerScanEventCommand): Promise<void> {
    const { repoName } = command;

    if (repoName?.length === 0)
      throw new BadRequestError({ message: 'Repository Name is required' });
  }
}
