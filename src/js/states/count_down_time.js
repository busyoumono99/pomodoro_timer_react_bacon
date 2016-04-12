import Bacon      from 'baconjs';
import _          from 'lodash';
import moment     from 'moment';

import Dispatcher from '../lib/dispatcher.js';
import Const      from '../lib/const.js';

const d = new Dispatcher();

// ********************
// Property
/**
 * 現在の時間(ms)。キックされた後に減っていく。
 * @var  {int}
 */
let current_time_ms = d.stream('current_time_ms')
  .toProperty(Const.POMODORO_DURATION);

// ***************************
// Property(combine)
// TODO:ms表示から時刻表示に変更

// ********************
// Logic
/**
 * カウントダウンの開始。
 * TODO:キューを作ってポモドーロ、休憩、ポモドーロ、休憩、ポモドーロ、休憩、を繰り返すようにする
 * @return {void}
 */
let start = () => {
  // 1秒毎にカウントダウンする
  let interval = 1000;

  // ストリームの作成
  let poll = Bacon.fromPoll(interval, () => interval)
    .scan(Const.POMODORO_DURATION, (prev, _interval) => prev - _interval)
    .doAction((time) => d.push('current_time_ms', time) )
    .takeWhile((time)=> time > 0);

    // ストリームの端点の設定
    poll.onValue();
    poll.onEnd(() => d.push('current_time_ms', Const.POMODORO_DURATION))
}


// ********************
// public
export default {
  // ***************************
  // Property
  current_time_ms,

  // ***************************
  // function
  start,
};
