> Generate realistic user action logs.

Let's create action logs by specifying user characteristics and period.
More advanced customization is possible by creating user action routines and action tables.

# Usage

```javascript
import FictionalLogGenerator from '../src/FictionalLogGenerator';
import moment from 'moment';

const flg = new FictionalLogGenerator();

function userAction(act, leave, nextActions, state) {
  nextActions.forEach(nextAction => {
    switch (nextAction.action) {
      case 'transit':
        state.prevView = state.view;

        if (nextAction.detail.view === '$back') {
          state.view = state.prevView;
        } else {
          state.view = nextAction.detail.view;
        }

        act({ ...nextAction, detail: { view: state.view } });
        if (state.view === 'Leave') {
          leave();
        }
        break;
      case 'select':
        state.selectedItem = BookItems.choiceFromRank(1, 5);
        act({ ...nextAction, detail: { item: state.selectedItem } });
        break;
      case 'search':
        const searchWordIndex = Math.floor(Math.random() * state.searchWordCandidates.length);
        state.searchWord = state.searchWordCandidates[searchWordIndex];
        state.selectedItem = BookItems.searchFromWord(state.searchWord);
        act({ ...nextAction, detail: { word: state.searchWord } });
        break;
      case 'addToCart':
        state.cart.push(state.selectedItem);
        act({ ...nextAction, detail: { item: state.selectedItem } });
        break;
      case 'purchase':
      case 'clearCart':
        state.cart.forEach(item => {
          act({ ...nextAction, detail: { item } });
        });
        state.cart = [];
        break;
      case 'readCartList':
        state.cart.forEach(item => {
          act({ ...nextAction, detail: { item } });
        });
        break;
    }
  }, this);
}

const initialState = { // Do not include function.
  cart: [],
  view: 'Leave',
  prevView: null,
  selectedItem: null,
  searchWord: null,
  searchWordCandidates: [ 'Java', 'python', 'Javascript' ]
};

const config = {
  period: [ '2017-01-01 00:00:00', '2017-01-03 23:59:59' ],

  activeFrequency: 1 * 24 * 60 * 60 * 1000, // 1 session in 1 day.

  idRange: [ 1, 10 ], // user id range

  decisionCoefficient: 1, // A coefficient related to time to judgment.

  initialState: Object.assign({}, initialState),

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
        weight: 1, // if
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

flg.setUserConfig(config);

flg.generate(log => {
  const user_id = log.id;
  const action = log.action;
  const json = JSON.stringify(log.detail);
  const timestamp = moment(log.timestamp).utc().format('YYYY-MM-DD HH:mm:ss');

  const query = `INSERT INTO actions (user_id, action, detail, timestamp) VALUES (${user_id},'${action}','${json}','${timestamp}');`;
  console.log(query);

  /*
  INSERT INTO actions (user_id, action, detail, timestamp) VALUES (1,'transit','{"view":"Ranking"}','2017-01-01 11:16:06');
  INSERT INTO actions (user_id, action, detail, timestamp) VALUES (1,'transit','{"view":"SearchResult"}','2017-01-01 11:16:07');
  INSERT INTO actions (user_id, action, detail, timestamp) VALUES (1,'search','{"word":"python"}','2017-01-01 11:16:07');
  ...
  */
});
```

