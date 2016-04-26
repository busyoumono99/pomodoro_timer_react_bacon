import React        from 'react';
import _            from 'lodash';

import ControlFlgs  from '../states/control_flgs.js';
import Timer        from '../states/timer.js';
import Sequence     from '../states/sequence.js';
import Settings     from '../states/settings.js';

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
  onClickCreateSeqAllBtn() {
    Sequence.createSequenceAll();
  }
  onClickCreateSeqOnceBtn() {
    Sequence.createSequenceOnce();
  }
  onClickStartSeqBtn() {
    Sequence.start();
  }
  onChangePomodoroDuration(ev) {
    console.log(ev.currentTarget.value);
    Settings.updatePomodoroDuration(ev.currentTarget.value);
  }

  render() {
    const options = _.map(_.range(5, 61, 5), (val, key) => {
      return <option key={key} value={val*60*1000}>{val}:00</option>;
    });

    return (
      <div>
        <h1>Pomodoro Timer</h1>
        <h4>Timer</h4>
        <div>{this.props.timer.format_time}</div>
        <div>{this.props.timer.progress}%</div>
        <h4>Control</h4>
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
            value="create_sequence_all"
            onClick={this.onClickCreateSeqAllBtn.bind(this)}
            />
          <input
            type="button"
            value="create_sequence_once"
            onClick={this.onClickCreateSeqOnceBtn.bind(this)}
            />
          <input
            type="button"
            value="start_sequence"
            onClick={this.onClickStartSeqBtn.bind(this)}
            />
        </div>
        <h4>Settings</h4>
        <div>
          <select
            value={this.props.settings.pomodoro_duration}
            onChange={this.onChangePomodoroDuration.bind(this)}>
            {options}
          </select>
        </div>
      </div>
    );
  }

};
