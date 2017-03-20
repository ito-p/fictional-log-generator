import test from 'ava';
import sinon from 'sinon';

import { extract } from './RandomOperator';

test('extract one table', t => {

  const actionsTable = [
    {
      weight: 1,
      actions: [
        { action: 'transit', detail: { view: 'View1' } }
      ]
    }
  ];

  t.deepEqual(
    extract(actionsTable),
    {
      weight: 1,
      actions: [
        { action: 'transit', detail: { view: 'View1' } }
      ]
    }
  );
});

test('extract two table', t => {

  sinon.stub(Math, 'random').returns(0);

  const actionsTable = [
    {
      weight: 1,
      actions: [
        { action: 'transit', detail: { view: 'View1' } }
      ]
    },
    {
      weight: 1,
      actions: [
        { action: 'transit', detail: { view: 'View2' } }
      ]
    }
  ];

  t.deepEqual(
    extract(actionsTable),
    {
      weight: 1,
      actions: [
        { action: 'transit', detail: { view: 'View1' } }
      ]
    }
  );

  Math.random.restore();
});

test('extract two table', t => {

  sinon.stub(Math, 'random').returns(0.5);

  const actionsTable = [
    {
      weight: 1,
      actions: [
        { action: 'transit', detail: { view: 'View1' } }
      ]
    },
    {
      weight: 1,
      actions: [
        { action: 'transit', detail: { view: 'View2' } }
      ]
    }
  ];

  t.deepEqual(
    extract(actionsTable),
    {
      weight: 1,
      actions: [
        { action: 'transit', detail: { view: 'View2' } }
      ]
    }
  );

  Math.random.restore();
});

test('extract empty table', t => {

  const actionsTable = [];

  t.is(
    extract(actionsTable),
    null
  );
});
