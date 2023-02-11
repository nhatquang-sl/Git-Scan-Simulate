import { dbContext, initializeDb, ScanEvent, ScanResult, Vulnerability } from '@database';
import { mediator } from '@application/mediator';
import { GetScanResultCommand, ScanResultDto } from '.';
import { BadRequestError, NotFoundError } from '@application/common/exceptions';

const vulnerabilities: Vulnerability[] = [
  { path: 'path 01', beginLine: 1 } as Vulnerability,
  { path: 'path 02', beginLine: 2 } as Vulnerability,
  { path: 'path 03', beginLine: 3 } as Vulnerability,
];

beforeEach(async () => {
  await dbContext.connect();
  await initializeDb();
});

test('get scan result with id invalid', async () => {
  const rejects = expect(mediator.send(new GetScanResultCommand(0))).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: 'Scan Id invalid' }));
});

test('get scan result not found', async () => {
  const rejects = expect(mediator.send(new GetScanResultCommand(1))).rejects;
  await rejects.toThrow(NotFoundError);
});

test('get scan result success', async () => {
  const startedScan = new Date();
  const finishedScan = new Date(startedScan.getTime() + 5 * 60 * 1000);
  const scanEvent = await ScanEvent.create({
    repoName: 'repo name',
    status: 'Success',
    startedAt: startedScan,
    finishedAt: finishedScan,
  } as ScanEvent);
  const scanResult = ScanResult.create({ eventId: scanEvent.id });

  const scanResultDto = (await mediator.send(
    new GetScanResultCommand((await scanResult).id)
  )) as ScanResultDto;

  // assert
  expect(scanResultDto.id).toBe(1);
  expect(scanResultDto.status).toBe('Success');
  expect(scanResultDto.startedAt).toEqual(startedScan);
  expect(scanResultDto.finishedAt).toEqual(finishedScan);
  expect(scanResultDto.scanId).toBe(1);
  expect(scanResultDto.findings.length).toBe(0);
});

test('get scan result failure', async () => {
  const startedScan = new Date();
  const finishedScan = new Date(startedScan.getTime() + 5 * 60 * 1000);
  const scanEvent = await ScanEvent.create({
    repoName: 'repo name',
    status: 'Failure',
    startedAt: startedScan,
    finishedAt: finishedScan,
  } as ScanEvent);
  const scanResult = ScanResult.create({ eventId: scanEvent.id, vulnerabilities } as ScanResult, {
    include: [{ model: Vulnerability, as: 'vulnerabilities' }],
  });

  const scanResultDto = (await mediator.send(
    new GetScanResultCommand((await scanResult).id)
  )) as ScanResultDto;

  // assert scan result
  expect(scanResultDto.id).toBe(1);
  expect(scanResultDto.status).toBe('Failure');
  expect(scanResultDto.startedAt).toEqual(startedScan);
  expect(scanResultDto.finishedAt).toEqual(finishedScan);
  expect(scanResultDto.scanId).toBe(1);
  expect(scanResultDto.findings.length).toBe(3);

  // assert first finding
  expect(scanResultDto.findings[0].type).toBe('sast');
  expect(scanResultDto.findings[0].location.path).toBe(vulnerabilities[0].path);
  expect(scanResultDto.findings[0].location.path).toBe(vulnerabilities[0].path);
  expect(scanResultDto.findings[0].location.positions.begin.line).toBe(
    vulnerabilities[0].beginLine
  );

  // assert second finding
  expect(scanResultDto.findings[1].type).toBe('sast');
  expect(scanResultDto.findings[1].location.path).toBe(vulnerabilities[1].path);
  expect(scanResultDto.findings[1].location.path).toBe(vulnerabilities[1].path);
  expect(scanResultDto.findings[1].location.positions.begin.line).toBe(
    vulnerabilities[1].beginLine
  );

  // assert third finding
  expect(scanResultDto.findings[2].type).toBe('sast');
  expect(scanResultDto.findings[2].location.path).toBe(vulnerabilities[2].path);
  expect(scanResultDto.findings[2].location.path).toBe(vulnerabilities[2].path);
  expect(scanResultDto.findings[2].location.positions.begin.line).toBe(
    vulnerabilities[2].beginLine
  );
});
