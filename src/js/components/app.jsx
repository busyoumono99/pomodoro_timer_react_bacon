import React from 'react';

import ControlFlgs  from '../states/control_flgs.js';
import Timer        from '../states/timer.js';
import Sequence     from '../states/sequence.js';

export default class App extends React.Component{

  onClickStartBtn() {
    Timer.start();
  }
  onClickSuspendBtn() {
    ControlFlgs.suspend();
  }
  onClickResumeBtn() {
    ControlFlgs.resume();
  }
  onClickResetBtn() {
    ControlFlgs.reset();
  }
  onClickCreateSeqBtn() {
    Sequence.createSequence();
  }
  onClickStartSeqBtn() {
    Sequence.start();
  }
  onClickNextSeqBtn() {
    Sequence.next();
  }

  render() {
    return (
      <div>
        <h1>Pomodoro Timer</h1>
        <div>{this.props.timer.format_time}</div>
        <div>
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
        <div>
          <input
            type="button"
            value="create_sequence"
            onClick={this.onClickCreateSeqBtn.bind(this)}
            />
          <input
            type="button"
            value="start_sequence"
            onClick={this.onClickStartSeqBtn.bind(this)}
            />
          <input
            type="button"
            value="next_sequence"
            onClick={this.onClickNextSeqBtn.bind(this)}
            />
        </div>
      </div>

    );
  }

};
