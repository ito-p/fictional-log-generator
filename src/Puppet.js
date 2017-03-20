export default class Puppet {
  id;
  lifeTime;
  state;

  constructor(id, state, lifeTime) {
    this.id = id;
    this.lifeTime = lifeTime;
    this.state = state;
  }

  get isObsoleted() {
    return this.lifeTime.isOver;
  }

  isActive() {
    return this.lifeTime.checkSessionExist();
  }

  action(actionLog) {
    return { id: this.id, ...actionLog, timestamp: this.lifeTime.currentDate };
  }

  think(time) {
    this.lifeTime.fowardToNextTime(time);
  }

  leave() {
    this.lifeTime.fowardToNextSession();
  }
}
