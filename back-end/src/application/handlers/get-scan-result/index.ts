import { ScanEvent, ScanResult, Vulnerability } from '@database';
import { BadRequestError, NotFoundError } from '@application/common/exceptions';
import {
  RegisterHandler,
  ICommandHandler,
  ICommand,
  RegisterValidator,
  ICommandValidator,
} from '@application/mediator';
import { FindingDto } from './dtos';

export class ScanResultDto {
  id: number;
  status: string;
  createdAt: Date;
  startedAt: Date;
  finishedAt: Date;
  scanId: number;
  findings: FindingDto[];

  constructor(entity: ScanResult) {
    this.id = entity.id;
    this.status = entity.event.status;
    this.createdAt = entity.event.createdAt;
    this.startedAt = entity.event.startedAt;
    this.finishedAt = entity.event.finishedAt;
    this.scanId = entity.eventId;
    this.findings = entity.vulnerabilities?.map((v) => new FindingDto(v)) ?? [];
  }
}

export class GetScanResultCommand implements ICommand {
  scanResultId: number;

  constructor(scanResultId: number) {
    this.scanResultId = scanResultId;
  }
}

@RegisterHandler
export class GetScanResultCommandHandler
  implements ICommandHandler<GetScanResultCommand, ScanResultDto>
{
  async handle(command: GetScanResultCommand): Promise<ScanResultDto> {
    const { scanResultId } = command;

    const scanResult = await ScanResult.findOne({
      where: { id: scanResultId },
      include: [
        { model: Vulnerability, as: 'vulnerabilities' },
        { model: ScanEvent, as: 'event' },
      ],
    });

    if (scanResult != null) return new ScanResultDto(scanResult);

    throw new NotFoundError();
  }
}

@RegisterValidator
export class GetScanResultCommandValidator implements ICommandValidator<GetScanResultCommand> {
  async validate(command: GetScanResultCommand): Promise<void> {
    const { scanResultId } = command;

    if (scanResultId <= 0) throw new BadRequestError({ message: 'Scan Id invalid' });
  }
}
