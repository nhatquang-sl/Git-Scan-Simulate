import { delay } from './../application/common/utils/index';
import { ScanEvent } from '@database';
import { ScanAnEventCommand } from '@application/handlers/scan-an-event';
import { Mediator } from '@application/mediator';
import ENV from '@config';

export default class ScanEventWorker {
  run = async () => {
    // an isolated instance
    const mediator = new Mediator();

    while (true) {
      const scanEvent = await ScanEvent.findOne({
        where: { status: 'Queued' },
        attributes: ['id'],
      });
      if (scanEvent) await mediator.send(new ScanAnEventCommand(scanEvent.id));

      const waitSecond = 1 + ~~(Math.random() * ENV.SCAN_EVENT_MAX_WAIT_SECOND);
      console.log({ scanEvent: JSON.parse(JSON.stringify(scanEvent)), waitSecond });
      await delay(1000 * waitSecond);
    }
  };
}
