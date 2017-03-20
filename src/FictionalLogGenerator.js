// during
// time table
// decide time
// user_id range
// action mapper
// initial state

import Puppeteer from './Puppeteer';

export default class FictionalLogGenerator {
  configs = [];

  setUserConfig(config) {
    this.configs = [ ...this.configs, config ];
  }

  generate(callback) {
    this.configs.forEach(config => {
      const puppeteer = new Puppeteer(config);
      puppeteer.performance(callback);
    }, this);
  }
}
