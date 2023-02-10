import { ScanEvent, ScanResult, Vulnerability } from '@database';
import { BadRequestError, NotFoundError } from '@application/common/exceptions';
import {
  RegisterHandler,
  ICommandHandler,
  ICommand,
  RegisterValidator,
  ICommandValidator,
} from '@application/mediator';
import ScanService from '@application/services/scan-service';

export class ScanAnEventCommand implements ICommand {
  eventId: number;

  constructor(eventId: number) {
    this.eventId = eventId;
  }
}

@RegisterHandler
export class ScanAnEventCommandHandler implements ICommandHandler<ScanAnEventCommand, number> {
  async handle(command: ScanAnEventCommand): Promise<number> {
    const { eventId } = command;

    const entity = await ScanEvent.findOne({ where: { id: eventId, status: 'Queued' } });
    if (entity === null) throw new NotFoundError();

    await ScanEvent.update(
      { status: 'In Progress', startedAt: new Date() },
      { where: { id: eventId } }
    );

    const vulnerabilities = await new ScanService().getVulnerabilities();

    return vulnerabilities.length
      ? await this.handleFailure(eventId, vulnerabilities)
      : await this.handleSuccess(eventId);
  }

  /**
   * there is no vulnerability
   * @param eventId
   * @returns scan result id
   */
  async handleSuccess(eventId: number): Promise<number> {
    const [scanResult] = await Promise.all([
      ScanResult.create({ eventId }),
      ScanEvent.update({ status: 'Success', finishedAt: new Date() }, { where: { id: eventId } }),
    ]);

    return scanResult.id;
  }

  /**
   *
   * @param eventId
   * @param vulnerabilities
   * @returns scan result id
   */
  async handleFailure(eventId: number, vulnerabilities: Vulnerability[]): Promise<number> {
    const [scanResult] = await Promise.all([
      ScanResult.create({ eventId, vulnerabilities } as ScanResult, {
        include: [{ model: Vulnerability, as: 'vulnerabilities' }],
      }),
      ScanEvent.update({ status: 'Failure', finishedAt: new Date() }, { where: { id: eventId } }),
    ]);

    return scanResult.id;
  }
}

@RegisterValidator
export class ScanAnEventCommandValidator implements ICommandValidator<ScanAnEventCommand> {
  async validate(command: ScanAnEventCommand): Promise<void> {
    const { eventId } = command;

    if (eventId <= 0) throw new BadRequestError({ message: 'Event Id invalid' });
  }
}
