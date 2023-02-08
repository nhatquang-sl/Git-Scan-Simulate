import { dbContext, initializeDb, ScanEvent } from '@database';
import { mediator } from '@application/mediator';
import { TriggerScanEventCommand, TriggerScanEventResult } from '.';
import { BadRequestError } from '@application/common/exceptions';

beforeEach(async () => {
  await dbContext.connect();
  await initializeDb();
});

test('trigger scan missing repo name', async () => {
  const rejects = expect(mediator.send(new TriggerScanEventCommand(''))).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: 'Repository Name is required' }));
});

test('trigger scan event success', async () => {
  // track time AFTER trigger scan event
  const startedAt = new Date().getTime();

  let command = new TriggerScanEventCommand('repository name');
  const result = (await mediator.send(command)) as TriggerScanEventResult;
  const scanEvent = await ScanEvent.findOne({ where: { repoName: 'repository name' } });

  // track time AFTER trigger scan event
  const endedAt = new Date().getTime();

  // assert
  expect(scanEvent?.id).toBe(1);
  expect(scanEvent?.repoName).toBe('repository name');
  expect(scanEvent?.status).toBe('Queued');
  expect(scanEvent?.createdAt.getTime()).toBeGreaterThanOrEqual(startedAt);
  expect(scanEvent?.createdAt.getTime()).toBeLessThanOrEqual(endedAt);
  expect(scanEvent?.startedAt).toBeNull();
  expect(scanEvent?.finishedAt).toBeNull();

  expect(result.id).toBe(scanEvent?.id);
  expect(result.repoName).toBe(scanEvent?.repoName);
  expect(result.status).toBe(scanEvent?.status);
  expect(result.createdAt).toBe(scanEvent?.createdAt.getTime());
});
