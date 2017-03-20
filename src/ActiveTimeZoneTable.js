import { extract } from './RandomOperator';

export const DEFAULT_CONFIG = [
//  0:00              6:00              12:00             18:00          23:00
//  |                 |                 |                 |              |
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ], // Sunday
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ], // Monday
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ], // Tuesday
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ], // Wednesday
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ], // Thursday
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ], // Friday
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]  // Saturday
];

const ONE_HOUR_TIME = 60 * 60 * 1000;

export default class ActiveTimeZoneTable {
  config;

  constructor(config = DEFAULT_CONFIG) {
    this.config = config;
  }

  checkSessionExist(startTime, endTime) {
    const filters = this.makeFilter(startTime, endTime);

    return filters.length > 0;
  }

  // If checkSessionExist is true, you can call this function.
  getSessionStartTime(startTime, endTime) {
    const filters = this.makeFilter(startTime, endTime);

    const range = extract(filters);
    if (range === null) {
      // if filters is not exist, this function returns 0.
      return 0;
    }
    const offset = Math.random() * 60 * 60 * 1000;

    return range.date.getTime() + offset;
  }

  makeFilter(startTime, endTime) {
    let scanningTime = startTime - startTime % ONE_HOUR_TIME;
    const filters = [];

    while (scanningTime < endTime) {
      const date = new Date(scanningTime);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();

      const weight = this.config[dayOfWeek][hour];
      if (weight > 0) {
        filters.push({
          weight,
          date
        });
      }

      scanningTime += ONE_HOUR_TIME;
    }

    return filters;
  }
}
