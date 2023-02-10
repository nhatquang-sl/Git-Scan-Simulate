import dbContext from './db-context';
import ScanEvent from './models/scan-event';
import ScanResult from './models/scan-result';
import Vulnerability from './models/vulnerability';

const initializeDb = async () => {
  try {
    await dbContext.sequelize.sync({ force: true });
  } catch (err) {
    console.log({ err });
  }
};
export { dbContext, initializeDb, ScanEvent, ScanResult, Vulnerability };
