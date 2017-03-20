export default class LifeTime {
  sessionCount = 0;

  activeFrequency;
  currentDate;
  startDate;
  endDate;

  constructor(period, activeFrequency) {
    this.activeFrequency = activeFrequency;

    this.startDate = new Date(period[0]);
    this.endDate = new Date(period[1]);

    this.currentDate = new Date(period[0]);
    this.updateCurrentTime(this.currentSessionStartTime + (Math.random() * this.activeFrequency));
  }

  fowardToNextTime(time) {
    const error = time * 0.2;
    const actionTime = time + (Math.random() * error) - (error / 2); // 20% error

    this.addToCurrentTime(actionTime);
  }

  fowardToNextSession() {
    this.sessionCount += 1;

    this.updateCurrentTime(this.currentSessionStartTime + (Math.random() * this.activeFrequency));
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
