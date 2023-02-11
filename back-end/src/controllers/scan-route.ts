import express, { Request, Response } from 'express';
import { mediator } from '@application/mediator';
import { TriggerScanEventCommand } from '@application/handlers/trigger-scan';
import { GetScanResultCommand } from '@application/handlers/get-scan-result';

const router = express.Router();

router.post('/:repoName', async (request: Request, response: Response) => {
  response.json(await mediator.send(new TriggerScanEventCommand(request.params.repoName)));
});

router.get('/:eventId', async (request: Request, response: Response) => {
  const eventId = parseInt(request.params.eventId);

  response.json(await mediator.send(new GetScanResultCommand(isNaN(eventId) ? 0 : eventId)));
});

export default router;
