import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });
if (process.env.NODE_ENV?.trim() == 'development')
  dotenv.config({
    path: path.join(__dirname, '.development.env'),
    override: true,
  });

const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  APP_VERSION: process.env.APP_VERSION,
  PORT: process.env.PORT || 3600,

  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',').map((x) => x.trim()) ?? [],
  SCAN_EVENT_MAX_WAIT_SECOND: parseInt(process.env.SCAN_EVENT_MAX_WAIT_SECOND ?? '10'),
};

export default ENV;
