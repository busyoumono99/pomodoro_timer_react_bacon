import React from 'react';

import Timer from '../states/timer.js';

export default class App extends React.Component{

  onClickStartBtn() {
    Timer.start();
  }
  onClickSuspendBtn() {
    Timer.suspend();
  }
  onClickResumeBtn() {
    Timer.resume();
  }
  onClickResetBtn() {
    Timer.reset();
  }

  render() {
    return (
      <div>
        <h1>Pomodoro Timer</h1>
        <div>{this.props.timer.format_time}</div>
        <input
          type="button"
          value="start"
          onClick={this.onClickStartBtn.bind(this)}
          />
        <input
          type="button"
          value="suspend"
          onClick={this.onClickSuspendBtn.bind(this)}
          />
        <input
          type="button"
          value="resume"
          onClick={this.onClickResumeBtn.bind(this)}
          />
        <input
          type="button"
          value="reset"
          onClick={this.onClickResetBtn.bind(this)}
          />
      </div>
    );
  }

};
