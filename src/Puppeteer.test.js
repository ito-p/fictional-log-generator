import test from 'ava';
import sinon from 'sinon';

import Puppeteer from './Puppeteer';
import ActiveTimeZoneTable from './ActiveTimeZoneTable';
import { Books } from '../utils/BookItems';
import { userAction, initialState } from '../utils/Routine';

test.beforeEach(() => {
  sinon.stub(ActiveTimeZoneTable.prototype, 'checkSessionExist').returns(true);
  sinon.stub(ActiveTimeZoneTable.prototype, 'getSessionStartTime').returns(new Date('2017-01-01 00:00:00').getTime());
});

test.afterEach(() => {
  ActiveTimeZoneTable.prototype.checkSessionExist.restore();
  ActiveTimeZoneTable.prototype.getSessionStartTime.restore();
});

test('transit, select, addToCart', t => {

  const userInitialState = Object.assign({}, initialState, { searchWordCandidates: [ 'Java' ] });

  const puppeteer = new Puppeteer({
    period: [ '2017-01-01 00:00:00', '2017-01-01 00:00:03' ],

    activeFrequency: 3 * 1000,

    idRange: [ 5 ],

    decisionCoefficient: 1, // A coefficient related to time to judgment.

    initialState: userInitialState,

    actionsTable: {
      Ranking: [
        {
          weight: 1,
          actions: [
            { action: 'transit', detail: { view: 'Detail' } },
            { action: 'select' }
          ],
          decisionTime: 1000
        }
      ],

      Detail: [
        {
          weight: 1,
          actions: [
            { action: 'transit', detail: { view: 'Detail' } },
            { action: 'addToCart' }
          ],
          decisionTime: 1000
        }
      ],

      Leave: [
        {
          weight: 1,
          actions: [
            { action: 'transit', detail: { view: 'Ranking' } }
          ],
          decisionTime: 1000
        },
      ]
    },

    action: userAction
  });

  sinon.stub(Math, 'random').returns(0.5);

  let index = 0;
  puppeteer.performance(log => {
    const results = [
      { id: 5, action: 'transit', detail: { view: 'Ranking' }, timestamp: new Date('2017-01-01 00:00:00') },
      { id: 5, action: 'transit', detail: { view: 'Detail' }, timestamp: new Date('2017-01-01 00:00:01') },
      { id: 5, action: 'select', detail: { item: Books[2] }, timestamp: new Date('2017-01-01 00:00:01') },
      { id: 5, action: 'transit', detail: { view: 'Detail' }, timestamp: new Date('2017-01-01 00:00:02') },
      { id: 5, action: 'addToCart', detail: { item: Books[2] }, timestamp: new Date('2017-01-01 00:00:02') }
    ];

    t.deepEqual(
      log,
      results[index]
    );
    index++;
  });

  t.is(
    index,
    5
  );

  Math.random.restore();

});

test('search and addToCart', t => {

  const userInitialState = Object.assign({}, initialState, {
    searchWordCandidates: [ 'Java' ]
  });

  const puppeteer = new Puppeteer({
    period: [ '2017-01-01 00:00:00', '2017-01-01 00:00:03' ],

    activeFrequency: 3 * 1000,

    idRange: [ 5 ],

    decisionCoefficient: 1, // A coefficient related to time to judgment.

    initialState: userInitialState,

    actionsTable: {
      Ranking: [
        {
          weight: 1,
          actions: [
            { action: 'transit', detail: { view: 'SearchResult' } },
            { action: 'search' }
          ],
          decisionTime: 1000
        }
      ],

      SearchResult: [
        {
          weight: 1,
          actions: [
            { action: 'transit', detail: { view: 'SearchResult' } },
            { action: 'addToCart' }
          ],
          decisionTime: 1000
        },
      ],

      Leave: [
        {
          weight: 1,
          actions: [
            { action: 'transit', detail: { view: 'Ranking' } }
          ],
          decisionTime: 1000
        },
      ]
    },

    action: userAction
  });

  sinon.stub(Math, 'random').returns(0.5);

  let index = 0;
  puppeteer.performance(log => {
    const results = [
      { id: 5, action: 'transit', detail: { view: 'Ranking' }, timestamp: new Date('2017-01-01 00:00:00') },
      { id: 5, action: 'transit', detail: { view: 'SearchResult' }, timestamp: new Date('2017-01-01 00:00:01') },
      { id: 5, action: 'search', detail: { word: 'Java' }, timestamp: new Date('2017-01-01 00:00:01') },
      { id: 5, action: 'transit', detail: { view: 'SearchResult' }, timestamp: new Date('2017-01-01 00:00:02') },
      { id: 5, action: 'addToCart', detail: { item: Books[3] }, timestamp: new Date('2017-01-01 00:00:02') },
      undefined
    ];

    t.deepEqual(
      log,
      results[index]
    );
    index++;
  });

  t.is(
    index,
    5
  );

  Math.random.restore();
});

test('purchase and overdate activeFrequency', t => {

  const userInitialState = Object.assign({}, initialState, {
    cart: [ Books[0], Books[3] ]
  });

  const puppeteer = new Puppeteer({
    period: [ '2017-01-01 00:00:00', '2017-01-01 00:00:03' ],

    activeFrequency: 1 * 24 * 60 * 60 * 1000, // 1 access in 1 day

    idRange: [ 5 ],

    decisionCoefficient: 2, // A coefficient related to time to judgment.

    initialState: userInitialState,

    actionsTable: {
      Ranking: [
        {
          weight: 1,
          actions: [
            { action: 'transit', detail: { view: 'Checkout' } },
            { action: 'readCartList' }
          ],
          decisionTime: 500
        }
      ],

      Checkout: [
        {
          weight: 1,
          actions: [
            { action: 'transit', detail: { view: 'PaymentResult' } },
            { action: 'purchase' }
          ],
          decisionTime: 500
        },
      ],

      Leave: [
        {
          weight: 1,
          actions: [
            { action: 'transit', detail: { view: 'Ranking' } }
          ],
          decisionTime: 500
        },
      ]
    },

    action: userAction
  });

  sinon.stub(Math, 'random').returns(0.5);

  let index = 0;
  puppeteer.performance(log => {
    const results = [
      { id: 5, action: 'transit', detail: { view: 'Ranking' }, timestamp: new Date('2017-01-01 00:00:00') },
      { id: 5, action: 'transit', detail: { view: 'Checkout' }, timestamp: new Date('2017-01-01 00:00:01') },
      { id: 5, action: 'readCartList', detail: { item: Books[0] }, timestamp: new Date('2017-01-01 00:00:01') },
      { id: 5, action: 'readCartList', detail: { item: Books[3] }, timestamp: new Date('2017-01-01 00:00:01') },
      { id: 5, action: 'transit', detail: { view: 'PaymentResult' }, timestamp: new Date('2017-01-01 00:00:02') },
      { id: 5, action: 'purchase', detail: { item: Books[0] }, timestamp: new Date('2017-01-01 00:00:02') },
      { id: 5, action: 'purchase', detail: { item: Books[3] }, timestamp: new Date('2017-01-01 00:00:02') }
    ];

    t.deepEqual(
      log,
      results[index]
    );
    index++;
  });

  t.is(
    index,
    7
  );

  Math.random.restore();

});
