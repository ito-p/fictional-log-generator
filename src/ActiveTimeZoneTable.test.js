import test from 'ava';
import sinon from 'sinon';

import ActiveTimeZoneTable from './ActiveTimeZoneTable';

export const TEST_TIMEZONE_CONFIG = [
//  0:00              6:00              12:00             18:00          23:00
//  |                 |                 |                 |              |
  [ 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], // Sunday
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0 ], // Monday
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], // Tuesday
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ], // Wednesday
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ], // Thursday
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ], // Friday
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]  // Saturday
];

test('makeFilter', t => {
  const activeTimeZoneTable = new ActiveTimeZoneTable(TEST_TIMEZONE_CONFIG);
  const startTime = new Date('2017-01-01 00:00:00').getTime();
  const endTime = new Date('2017-01-04 00:00:00').getTime();
  const filters = activeTimeZoneTable.makeFilter(startTime, endTime);

  t.deepEqual(
    filters,
    [
      { date: new Date('2017-01-01 00:00:00'), weight: 1 },
      { date: new Date('2017-01-01 06:00:00'), weight: 2 },
      { date: new Date('2017-01-02 12:00:00'), weight: 3 },
      { date: new Date('2017-01-02 18:00:00'), weight: 4 },
    ]
  );
});

test('checkSessionExist is true', t => {
  const activeTimeZoneTable = new ActiveTimeZoneTable(TEST_TIMEZONE_CONFIG);
  const startTime = new Date('2017-01-01 00:00:00').getTime();
  const endTime = new Date('2017-01-01 05:00:00').getTime();

  t.is(
    activeTimeZoneTable.checkSessionExist(startTime, endTime),
    true
  );
});

test('checkSessionExist is false', t => {
  const activeTimeZoneTable = new ActiveTimeZoneTable(TEST_TIMEZONE_CONFIG);
  const startTime = new Date('2017-01-02 00:00:00').getTime();
  const endTime = new Date('2017-01-02 11:00:00').getTime();

  t.is(
    activeTimeZoneTable.checkSessionExist(startTime, endTime),
    false
  );
});

test('getSessionStartTime ', t => {
  sinon.stub(Math, 'random').returns(0.5);
  const activeTimeZoneTable = new ActiveTimeZoneTable(TEST_TIMEZONE_CONFIG);
  const startTime = new Date('2017-01-01 00:00:00').getTime();
  const endTime = new Date('2017-01-04 00:00:00').getTime();

  t.deepEqual(
    new Date(activeTimeZoneTable.getSessionStartTime(startTime, endTime)),
    new Date('2017-01-02 12:30:00')
  );

  Math.random.restore();
});

test('getSessionStartTime returns 0', t => {
  const activeTimeZoneTable = new ActiveTimeZoneTable(TEST_TIMEZONE_CONFIG);
  const startTime = new Date('2017-01-02 00:00:00').getTime();
  const endTime = new Date('2017-01-02 11:00:00').getTime();

  t.is(
    activeTimeZoneTable.getSessionStartTime(startTime, endTime),
    0
  );
});

test('short time', t => {
  sinon.stub(Math, 'random').returns(0.5);
  const activeTimeZoneTable = new ActiveTimeZoneTable(TEST_TIMEZONE_CONFIG);
  const startTime = new Date('2017-01-01 00:00:01').getTime();
  const endTime = new Date('2017-01-01 00:00:11').getTime();

  t.deepEqual(
    new Date(activeTimeZoneTable.getSessionStartTime(startTime, endTime)),
    new Date('2017-01-01 00:00:06')
  );
  Math.random.restore();
});
