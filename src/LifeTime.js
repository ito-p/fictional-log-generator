import ActiveTimeZoneTable from './ActiveTimeZoneTable';

export default class LifeTime {
  sessionCount = 0;

  activeFrequency;
  activeTimeZoneTable;
  currentDate;
  startDate;
  endDate;

  constructor(period, activeFrequency, activeTimeZoneTableConfig) {
    this.activeFrequency = activeFrequency;
    this.activeTimeZoneTable = new ActiveTimeZoneTable(activeTimeZoneTableConfig);

    this.startDate = new Date(period[0]);
    this.endDate = new Date(period[1]);
    this.currentDate = new Date(period[0]);

    this.fowardToCurrentSession();
  }

  fowardToNextTime(time) {
    const error = time * 0.2;
    const actionTime = time + (Math.random() * error) - (error / 2); // 20% error

    this.addToCurrentTime(actionTime);
  }

  fowardToNextSession() {
    this.sessionCount += 1;

    this.fowardToCurrentSession();
  }

  fowardToCurrentSession() {
    const isSessionExist = this.activeTimeZoneTable.checkSessionExist(this.currentSessionStartTime, this.currentSessionStartTime + this.activeFrequency);

    if (isSessionExist) {
      const sessionTime = this.activeTimeZoneTable.getSessionStartTime(this.currentSessionStartTime, this.currentSessionStartTime + this.activeFrequency);

      this.updateCurrentTime(sessionTime);
    }
  }

  addToCurrentTime(time) {
    this.currentDate = new Date(this.currentTime + time);
  }

  updateCurrentTime(time) {
    this.currentDate = new Date(time);
  }

  get currentSessionStartTime() {
    return this.activeFrequency * this.sessionCount + this.startDate.getTime();
  }

  get termTime() {
    return this.endDate.getTime() - this.startDate.getTime();
  }

  get currentTime() {
    return this.currentDate.getTime();
  }

  get isOver() {
    return this.currentTime >= this.endDate.getTime();
  }
}
