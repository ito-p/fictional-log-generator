import test from 'ava';
import sinon from 'sinon';

import LifeTime from './LifeTime';
import ActiveTimeZoneTable from './ActiveTimeZoneTable';

test('initialize', t => {
  sinon.stub(Math, 'random').returns(0.5);
  sinon.stub(ActiveTimeZoneTable.prototype, 'checkSessionExist').returns(true);
  sinon.stub(ActiveTimeZoneTable.prototype, 'getSessionStartTime').returns(new Date('2017-01-01 12:00:00').getTime());

  const lifeTime = new LifeTime([ '2017-01-01 00:00:00', '2017-01-04 00:00:00' ], 1 * 24 * 60 * 60 * 1000);

  t.is(
    lifeTime.currentTime,
    new Date('2017-01-01 12:00:00').getTime()
  );

  t.is(
    lifeTime.termTime,
    new Date('2017-01-04 00:00:00').getTime() - new Date('2017-01-01 00:00:00').getTime()
  );

  t.is(
    lifeTime.isOver,
    false
  );

  Math.random.restore();
  ActiveTimeZoneTable.prototype.checkSessionExist.restore();
  ActiveTimeZoneTable.prototype.getSessionStartTime.restore();
});

test('fowardToNextTime', t => {
  sinon.stub(Math, 'random').returns(0);
  const lifeTime = new LifeTime([ '2017-01-01 00:00:00', '2017-01-04 00:00:00' ], 1 * 24 * 60 * 60 * 1000);
  Math.random.restore();

  t.is(
    lifeTime.currentTime,
    new Date('2017-01-01 00:00:00').getTime()
  );

  sinon.stub(Math, 'random').returns(0.5);
  lifeTime.fowardToNextTime(10 * 1000); // Takes 10 seconds to act
  Math.random.restore();

  t.is(
    lifeTime.currentTime,
    new Date('2017-01-01 00:00:10').getTime()
  );

  sinon.stub(Math, 'random').returns(0);
  lifeTime.fowardToNextTime(1000); // Takes 10 seconds to act
  Math.random.restore();

  t.is(
    lifeTime.currentTime,
    new Date('2017-01-01 00:00:10').getTime() + 900
  );
});

test('fowardToNextTime and overdated', t => {
  sinon.stub(Math, 'random').returns(0);
  const lifeTime = new LifeTime([ '2017-01-01 00:00:00', '2017-01-01 00:00:05' ], 1 * 24 * 60 * 60 * 1000);
  Math.random.restore();

  t.is(
    lifeTime.currentTime,
    new Date('2017-01-01 00:00:00').getTime()
  );

  sinon.stub(Math, 'random').returns(0.5);
  lifeTime.fowardToNextTime(4 * 1000 + 999); // Takes 4.999 seconds to act

  t.is(
    lifeTime.currentTime,
    new Date('2017-01-01 00:00:04').getTime() + 999
  );

  t.is(
    lifeTime.isOver,
    false
  );

  lifeTime.fowardToNextTime(1); // Takes 1 milli second to act
  Math.random.restore();

  t.is(
    lifeTime.isOver,
    true
  );
});

test('fowardToNextSession', t => {
  sinon.stub(Math, 'random').returns(0);
  sinon.stub(ActiveTimeZoneTable.prototype, 'checkSessionExist').returns(true);
  sinon.stub(ActiveTimeZoneTable.prototype, 'getSessionStartTime').returns(new Date('2017-01-01 00:00:00').getTime());

  const lifeTime = new LifeTime([ '2017-01-01 00:00:00', '2017-01-04 00:00:00' ], 1 * 24 * 60 * 60 * 1000);
  Math.random.restore();

  sinon.stub(Math, 'random').returns(0.5);
  lifeTime.fowardToNextTime(60 * 60 * 1000); // Travel to 1 hour later

  t.is(
    lifeTime.currentTime,
    new Date('2017-01-01 01:00:00').getTime()
  );

  ActiveTimeZoneTable.prototype.getSessionStartTime.restore();
  sinon.stub(ActiveTimeZoneTable.prototype, 'getSessionStartTime').returns(new Date('2017-01-02 12:00:00').getTime());

  lifeTime.fowardToNextSession(); // Next session start at 2017-01-02 00:00:00
  Math.random.restore();

  t.is(
    lifeTime.currentTime,
    new Date('2017-01-02 12:00:00').getTime()
  );

  t.is(
    lifeTime.isOver,
    false
  );

  ActiveTimeZoneTable.prototype.checkSessionExist.restore();
  ActiveTimeZoneTable.prototype.getSessionStartTime.restore();
});

test('fowardToNextSession and overdated', t => {
  sinon.stub(Math, 'random').returns(0);

  const lifeTime = new LifeTime([ '2017-01-01 00:00:00', '2017-01-04 00:00:00' ], 1 * 24 * 60 * 60 * 1000);
  Math.random.restore();

  sinon.stub(Math, 'random').returns(0.99);

  t.is(
    lifeTime.currentTime,
    new Date('2017-01-01 00:00:00').getTime()
  );

  lifeTime.fowardToNextSession();
  lifeTime.fowardToNextSession();

  t.is(
    lifeTime.isOver,
    false
  );

  lifeTime.fowardToNextSession();
  Math.random.restore();

  t.is(
    lifeTime.isOver,
    true
  );
});
