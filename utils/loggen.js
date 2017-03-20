import test from 'ava';

import Puppeteer from './Puppeteer';
import BookItems from '../utils/BookItems';

test('Generate user action log', t => {

  const puppeteer = new Puppeteer({
    period: [ '2017-01-01 00:00:00', '2017-01-03 23:59:59' ],

    activeFrequency: 1 * 24 * 60 * 60 * 1000, // 1 session in 1 day.

    idRange: [ 1, 10 ],

    judgement: 1, // A coefficient related to time to judgment.

    initialState: { // Do not include function.
      cart: [],
      view: 'Leave',
      prevView: null,
      selectedItem: null,
      searchWord: null
    },

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

    action: (act, leave, nextActions, state) => {
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
            break;
          case 'search':
            state.searchWord = BookItems.searchFromWord([ 'Java', 'Javascript' ]);
            break;
          case 'addToCart':
            state.cart.push(state.selectedItem);
            act({ ...nextAction, detail: { item: state.selectedItem } });
            break;
        }
      }, this);
    }
  });

  puppeteer.performance(log => {
    // console.log(log);
    // t.is(
    //   false,
    //   false
    // );
  });
});
