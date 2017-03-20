import BookItems from './BookItems';

export const initialState = { // Do not include function.
  cart: [],
  view: 'Leave',
  prevView: null,
  selectedItem: null,
  searchWord: null,
  searchWordCandidates: [ 'Java', 'python', 'Javascript' ]
};

export function userAction(act, leave, nextActions, state) {
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
