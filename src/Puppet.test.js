import test from 'ava';
import sinon from 'sinon';

import Puppet from './Puppet';
import LifeTime from './LifeTime';

test('action', t => {
  sinon.stub(Math, 'random').returns(0);
  const lifeTime = new LifeTime([ '2017-01-01 00:00:00', '2017-01-04 00:00:00' ], 1 * 24 * 60 * 60 * 1000);
  Math.random.restore();

  const state = {
    view: 'View1'
  };
  const puppet = new Puppet(1, state, lifeTime);

  t.deepEqual(
    puppet.action({ data: 'test' }),
    {
      id: 1,
      data: 'test',
      timestamp: new Date('2017-01-01 00:00:00')
    }
  );
});

test('think', t => {
  sinon.stub(Math, 'random').returns(0);
  const lifeTime = new LifeTime([ '2017-01-01 00:00:00', '2017-01-04 00:00:00' ], 1 * 24 * 60 * 60 * 1000);
  Math.random.restore();

  const state = {
    view: 'View1'
  };
  sinon.stub(Math, 'random').returns(0.5);
  const puppet = new Puppet(1, state, lifeTime);

  puppet.think(1000);

  t.deepEqual(
    puppet.lifeTime.currentDate,
    new Date('2017-01-01 00:00:01')
  );
  Math.random.restore();
});

test('leave', t => {
  const lifeTime = new LifeTime([ '2017-01-01 00:00:00', '2017-01-12 00:00:00' ], 10 * 24 * 60 * 60 * 1000);
  const state = {
    view: 'View1'
  };
  sinon.stub(Math, 'random').returns(0);
  const puppet = new Puppet(1, state, lifeTime);

  puppet.leave();

  t.is(
    puppet.isObsoleted,
    false
  );

  puppet.leave();

  t.is(
    puppet.isObsoleted,
    true
  );

  Math.random.restore();
});
