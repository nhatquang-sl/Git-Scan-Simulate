import NodeCache from 'node-cache';
import { ICommand, container, IPipelineBehavior } from '@application/mediator';

export class CachingBehavior implements IPipelineBehavior {
  // cache data in one minute
  cache = new NodeCache();

  handle = async (command: ICommand, next: () => Promise<any>): Promise<any> => {
    const commandName = command.constructor.name;
    const ttl: any = container.cacheCommands[`${commandName}`];

    const cacheKey = `${commandName}:${JSON.stringify(command)}`;
    const cacheValue = this.cache.get(cacheKey);
    console.log({ cacheKey, cacheValue, ttl });
    // store a cache key-value
    if (cacheValue === undefined) {
      const result = await next();
      this.cache.set(cacheKey, result, ttl);
      return result;
    }

    return cacheValue;
  };
}
