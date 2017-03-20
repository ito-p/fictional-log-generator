import test from 'ava';
import sinon from 'sinon';

import FictionalLogGenerator from './FictionalLogGenerator';
import { userAction, initialState } from '../utils/Routine';

test('Generate user logs for book store', t => {

  const flg = new FictionalLogGenerator();

  const baseConfig = {
    period: [ '2017-01-01 00:00:00', '2017-01-01 00:00:01' ],

    activeFrequency: 1 * 24 * 60 * 60 * 1000, // 1 session in 1 day.

    idRange: [ 1 ],

    decisionCoefficient: 1, // A coefficient related to time to judgment.

    initialState,

    actionsTable: {
      Leave: [
        {
          weight: 1,
          actions: [
            { action: 'transit', detail: { view: 'Ranking' } }
          ],
          decisionTime: 1000
        },
      ],

      Ranking: [
        {
          weight: 1,
          actions: [
            { action: 'transit', detail: { view: 'Leave' } }
          ],
          decisionTime: 1000
        },
      ]
    },

    action: userAction
  };

  sinon.stub(Math, 'random').returns(0.5);

  flg.setUserConfig(Object.assign({}, baseConfig, {
    idRange: [ 1, 3 ]
  }));

  flg.setUserConfig(Object.assign({}, baseConfig, {
    idRange: [ 4, 6 ]
  }));

  let index = 0;
  const results = [
    { id: 1, action: 'transit', detail: { view: 'Ranking' }, timestamp: new Date('2017-01-01 00:00:00') },
    { id: 2, action: 'transit', detail: { view: 'Ranking' }, timestamp: new Date('2017-01-01 00:00:00') },
    { id: 3, action: 'transit', detail: { view: 'Ranking' }, timestamp: new Date('2017-01-01 00:00:00') },
    { id: 4, action: 'transit', detail: { view: 'Ranking' }, timestamp: new Date('2017-01-01 00:00:00') },
    { id: 5, action: 'transit', detail: { view: 'Ranking' }, timestamp: new Date('2017-01-01 00:00:00') },
    { id: 6, action: 'transit', detail: { view: 'Ranking' }, timestamp: new Date('2017-01-01 00:00:00') }
  ];

  flg.generate(log => {
    t.deepEqual(
      results[index],
      log
    );

    index += 1;
  });

  Math.random.restore();
});
