import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_TIMEZONE = 'America/Mexico_City';

export const getUTC = (): string => dayjs().utc().toJSON();

export const getTimestampFormatted = (
  timestamp: string,
  timezone = DEFAULT_TIMEZONE,
): string => {
  return dayjs(timestamp).tz(timezone).format('YYYY-MM-DDTHH:mm:ss');
};
