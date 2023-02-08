console.log('Hello world!');
import { dbContext, initializeDb } from '@database';

dbContext.connect().then(async (er) => {
  console.log(er);
  await initializeDb();
});
