import React        from 'react';
import _            from 'lodash';

import Const        from '../lib/const.js';
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
  onChangeShortBreak(ev) {
    Settings.updateShortBreak(ev.currentTarget.value);
  }
  onChangeLongBreak(ev) {
    Settings.updateLongBreak(ev.currentTarget.value);
  }
  onChangeLongBreakAfter(ev) {
    Settings.updateLongBreakAfter(ev.currentTarget.value);
  }

  render() {
    const pd_options = _.map(Const.OPTIONS_RANGE.POMODORO_DURATION, (val, key) => {
      return <option key={key} value={val*60*1000}>{val}:00</option>;
    });
    const sb_options = _.map(Const.OPTIONS_RANGE.SHORT_BREAK, (val, key) => {
      return <option key={key} value={val*60*1000}>{val}:00</option>;
    });
    const lb_options = _.map(Const.OPTIONS_RANGE.LONG_BREAK, (val, key) => {
      return <option key={key} value={val*60*1000}>{val}:00</option>;
    });
    const lba_options = _.map(Const.OPTIONS_RANGE.LONG_BREAK_AFTER, (val, key) => {
      return <option key={key} value={val}>{val}</option>;
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
            {pd_options}
          </select>
          <select
            value={this.props.settings.short_break}
            onChange={this.onChangeShortBreak.bind(this)}>
            {sb_options}
          </select>
          <select
            value={this.props.settings.long_break}
            onChange={this.onChangeLongBreak.bind(this)}>
            {lb_options}
          </select>
          <select
            value={this.props.settings.long_break_after}
            onChange={this.onChangeLongBreakAfter.bind(this)}>
            {lba_options}
          </select>
        </div>
      </div>
    );
  }

};
