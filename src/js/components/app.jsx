import React from 'react';

import Const      from '../lib/const.js';
import CountDownTime from '../states/count_down_time.js';

export default class App extends React.Component{

  onClickStartBtn() {
    CountDownTime.start(Const.POMODORO_DURATION);
  }
  onClickSuspendBtn() {
    CountDownTime.suspend();
  }
  onClickResumeBtn() {
    CountDownTime.resume();
  }
  onClickResetBtn() {
    CountDownTime.reset(Const.POMODORO_DURATION);
  }

  render() {
    return (
      <div>
        <h1>Pomodoro Timer</h1>
        <div>{this.props.count_down_time.time}</div>
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
