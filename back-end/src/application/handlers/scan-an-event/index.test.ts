import { dbContext, initializeDb, ScanResult, Vulnerability, ScanEvent } from '@database';
import { mediator } from '@application/mediator';
import { BadRequestError, NotFoundError } from '@application/common/exceptions';
import ScanService from '@application/services/scan-service';
import { ScanAnEventCommand } from '.';

jest.mock('@application/services/scan-service');

const vulnerabilities: Vulnerability[] = [
  { path: 'path 01', beginLine: 1 } as Vulnerability,
  { path: 'path 02', beginLine: 2 } as Vulnerability,
  { path: 'path 03', beginLine: 3 } as Vulnerability,
];

const mockScanService = (v: Vulnerability[]) => {
  jest.mocked(ScanService).mockImplementation(() => {
    return {
      getVulnerabilities: jest.fn(async (): Promise<Vulnerability[]> => {
        return v;
      }),
    };
  });
};

beforeEach(async () => {
  await dbContext.connect();
  await initializeDb();
});

test('scan an event invalid id', async () => {
  const rejects = expect(mediator.send(new ScanAnEventCommand(0))).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: 'Event Id invalid' }));
});

test('scan an event notfound', async () => {
  const rejects = expect(mediator.send(new ScanAnEventCommand(1))).rejects;
  await rejects.toThrow(NotFoundError);
});

test('scan an event success', async () => {
  mockScanService([]);
  const scanEvent = await ScanEvent.create({
    repoName: 'repository name',
  } as ScanEvent);

  const scanResultId = (await mediator.send(new ScanAnEventCommand(scanEvent.id))) as number;

  const scanResult = await ScanResult.findOne({
    where: { id: scanResultId },
    include: [
      { model: Vulnerability, as: 'vulnerabilities' },
      { model: ScanEvent, as: 'event' },
    ],
  });

  // assert event
  expect(scanResult?.id).toBe(1);
  expect(scanResult?.eventId).toBe(scanEvent.id);
  expect(scanResult?.event?.repoName).toBe('repository name');
  expect(scanResult?.event?.status).toBe('Success');
  expect(scanResult?.event?.finishedAt).not.toBeNull();
  expect(scanResult?.event?.startedAt).not.toBeNull();
  expect(scanResult?.event?.createdAt).not.toBeNull();
  expect(scanResult?.event?.finishedAt?.getTime()).toBeGreaterThan(
    scanResult?.event?.startedAt?.getTime() ?? 0
  );
  expect(scanResult?.event?.startedAt?.getTime()).toBeGreaterThan(
    scanResult?.event?.createdAt?.getTime() ?? 0
  );
});

test('scan an event failure', async () => {
  mockScanService(vulnerabilities);
  const scanEvent = await ScanEvent.create({
    repoName: 'repository name',
  } as ScanEvent);

  const scanResultId = (await mediator.send(new ScanAnEventCommand(scanEvent.id))) as number;

  const scanResult = await ScanResult.findOne({
    where: { id: scanResultId },
    include: [
      { model: Vulnerability, as: 'vulnerabilities' },
      { model: ScanEvent, as: 'event' },
    ],
  });

  // assert event info
  expect(scanResult?.id).toBe(1);
  expect(scanResult?.eventId).toBe(scanEvent.id);
  expect(scanResult?.event?.repoName).toBe('repository name');
  expect(scanResult?.event?.status).toBe('Failure');
  expect(scanResult?.event?.finishedAt).not.toBeNull();
  expect(scanResult?.event?.startedAt).not.toBeNull();
  expect(scanResult?.event?.createdAt).not.toBeNull();
  expect(scanResult?.event?.finishedAt?.getTime()).toBeGreaterThan(
    scanResult?.event?.startedAt?.getTime() ?? 0
  );
  expect(scanResult?.event?.startedAt?.getTime()).toBeGreaterThan(
    scanResult?.event?.createdAt?.getTime() ?? 0
  );

  // assert vulnerabilities
  expect(scanResult?.vulnerabilities?.length).toBe(vulnerabilities.length);
  const scanVulnerabilities = scanResult?.vulnerabilities ?? [];
  expect(scanVulnerabilities[0].type).toEqual('sast');
  expect(scanVulnerabilities[0].path).toEqual(vulnerabilities[0].path);
  expect(scanVulnerabilities[0].beginLine).toEqual(vulnerabilities[0].beginLine);

  expect(scanVulnerabilities[1].type).toEqual('sast');
  expect(scanVulnerabilities[1].path).toEqual(vulnerabilities[1].path);
  expect(scanVulnerabilities[1].beginLine).toEqual(vulnerabilities[1].beginLine);

  expect(scanVulnerabilities[2].type).toEqual('sast');
  expect(scanVulnerabilities[2].path).toEqual(vulnerabilities[2].path);
  expect(scanVulnerabilities[2].beginLine).toEqual(vulnerabilities[2].beginLine);
});
