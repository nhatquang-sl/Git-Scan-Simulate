import dbContext from './db-context';
import ScanEvent from './models/scan-event';

const initializeDb = async () => {
  try {
    await dbContext.sequelize.sync({ force: true });
  } catch (err) {
    console.log({ err });
  }
};
export { dbContext, initializeDb, ScanEvent };
