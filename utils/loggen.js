import FictionalLogGenerator from '../src/FictionalLogGenerator';
import { userAction, initialState } from './Routine';

const flg = new FictionalLogGenerator();

const baseConfig = {
  period: [ '2017-01-01 00:00:00', '2017-01-03 23:59:59' ],

  activeFrequency: 1 * 24 * 60 * 60 * 1000, // 1 session in 1 day.

  idRange: [ 1, 10 ],

  decisionCoefficient: 1, // A coefficient related to time to judgment.

  initialState,

  activeTimeZone: [
  //  0:00              6:00              12:00             18:00          23:00
  //  |                 |                 |                 |              |
    [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 3, 2, 1, 1, 1, 2, 3, 3, 4, 3, 1, 1 ], // Sunday
    [ 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 3, 2, 1, 1, 1, 2, 3, 3, 4, 3, 1, 0 ], // Monday
    [ 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 3, 2, 1, 1, 1, 2, 3, 3, 4, 3, 1, 0 ], // Tuesday
    [ 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 3, 2, 1, 1, 1, 2, 3, 3, 4, 3, 1, 0 ], // Wednesday
    [ 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 3, 2, 1, 1, 1, 2, 3, 3, 4, 3, 1, 0 ], // Thursday
    [ 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 3, 2, 1, 1, 1, 2, 3, 3, 4, 3, 1, 0 ], // Friday
    [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 3, 2, 1, 1, 1, 2, 3, 3, 4, 3, 1, 1 ]  // Saturday
  ],

  actionsTable: {
    Ranking: [
      {
        weight: 1,
        actions: [
          { action: 'transit', detail: { view: 'Detail' } },
          { action: 'select' }
        ],
        decisionTime: 1000
      },
      {
        weight: 1,
        actions: [
          { action: 'transit', detail: { view: 'SearchResult' } },
          { action: 'search' }
        ],
        decisionTime: 1000
      },
      {
        weight: 1,
        actions: [
          { action: 'transit', detail: { view: 'Checkout' } },
          { action: 'readCartList' }
        ],
        decisionTime: 1000
      },
      {
        weight: 1,
        actions: [
          { action: 'transit', detail: { view: 'Leave' } }
        ],
        decisionTime: 1000
      }
    ],

    Detail: [
      {
        weight: 1,
        actions: [
          { action: 'transit', detail: { view: 'Ranking' } }
        ],
        decisionTime: 1000
      },
      {
        weight: 1,
        actions: [
          { action: 'transit', detail: { view: 'Detail' } },
          { action: 'addToCart' }
        ],
        decisionTime: 1000
      },
      {
        weight: 1,
        actions: [
          { action: 'transit', detail: { view: 'Checkout' } },
          { action: 'readCartList' }
        ],
        decisionTime: 1000
      },
      {
        weight: 1,
        actions: [
          { action: 'transit', detail: { view: 'Leave' } }
        ],
        decisionTime: 1000
      }
    ],

    SearchResult: [
      {
        weight: 1,
        actions: [
          { action: 'transit', detail: { view: 'Ranking' } }
        ],
        decisionTime: 1000
      },
      {
        weight: 1,
        actions: [
          { action: 'transit', detail: { view: 'SearchResult' } },
          { action: 'addToCart' }
        ],
        decisionTime: 1000
      },
      {
        weight: 1,
        actions: [
          { action: 'transit', detail: { view: 'Checkout' } },
          { action: 'readCartList' }
        ],
        decisionTime: 1000
      },
      {
        weight: 1,
        actions: [
          { action: 'transit', detail: { view: 'Leave' } }
        ],
        decisionTime: 1000
      }
    ],

    Checkout: [
      {
        weight: 1,
        actions: [
          { action: 'transit', detail: { view: 'PaymentResult' } },
          { action: 'purchase' }
        ],
        decisionTime: 1000
      },
      {
        weight: 1,
        actions: [
          { action: 'transit', detail: { view: 'Checkout' } },
          { action: 'clearCart' }
        ],
        decisionTime: 1000
      },
      {
        weight: 1,
        actions: [
          { action: 'transit', detail: { view: '$back' } }
        ],
        decisionTime: 1000
      },
      {
        weight: 1,
        actions: [
          { action: 'transit', detail: { view: 'Leave' } }
        ],
        decisionTime: 1000
      }
    ],

    PaymentResult: [
      {
        weight: 1,
        actions: [
          { action: 'transit', detail: { view: 'Ranking' } }
        ],
        decisionTime: 1000
      },
      {
        weight: 1,
        actions: [
          { action: 'transit', detail: { view: 'Leave' } }
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
};

flg.setUserConfig(Object.assign({}, baseConfig, {
  idRange: [ 1, 10 ]
}));

flg.setUserConfig(Object.assign({}, baseConfig, {
  idRange: [ 11, 20 ]
}));

flg.generate(log => {
  console.log(log);
});
