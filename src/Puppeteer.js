import Puppet from './Puppet';
import LifeTime from './LifeTime';
import { extract } from './RandomOperator';

export default class Puppetteer {
  config;
  clock;

  constructor(config) {
    this.config = config;
  }

  performance(callback) {
    const { idRange, initialState, period, activeFrequency } = this.config;

    // for id
    const offset = idRange[0];
    const max = idRange[1] || idRange[0];

    // for initialState
    const stateJson = JSON.stringify(initialState);

    // for clock
    for (let id = offset; id <= max; id++) {
      const state = JSON.parse(stateJson); // deep copy
      const lifeTime = new LifeTime(period, activeFrequency);
      const puppet = new Puppet(id, state, lifeTime);

      this.manipulate(puppet, callback);
    }
  }

  manipulate(puppet, callback) {
    const { action } = this.config;

    while (!puppet.isObsoleted) {
      const extracted = extract(this.config.actionsTable[puppet.state.view]);

      let isLeave = false;
      let isActed = false;

      action(
        puppetAction => {
          isActed = true;
          const actionLog = puppet.action(puppetAction);

          if (!puppet.isObsoleted) {
            return callback(actionLog);
          }
        },
        () => {
          isLeave = true;
        },
        extracted.actions,
        puppet.state
      );

      if (isLeave) {
        puppet.leave();
      } else if (isActed) {
        puppet.think(extracted.decisionTime * this.config.decisionCoefficient);
      }
    }
  }
}
