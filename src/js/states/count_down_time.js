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
let time = d.stream('time')
  .toProperty(Const.POMODORO_DURATION);

/**
 * 一時停止フラグ
 * @var  {bool}
 */
let is_suspend = d.stream('is_suspend')
  .toProperty(false);

/**
 * リセットプロパティ
 * @var  {bool}
 */
let is_reset = d.stream('is_reset')
  .toProperty(false);

// ***************************
// Property(combine)
// TODO:ms表示から時刻表示に変更
let data = Bacon.combineTemplate({
    time,
    is_suspend,
    is_reset,
  })

// ********************
// Logic
/**
 * カウントダウンの開始。
 * TODO:キューを作ってポモドーロ、休憩、ポモドーロ、休憩、ポモドーロ、休憩、を繰り返すようにする
 * @return {void}
 */
let _start = (current_duration) => {
  // 1秒毎にカウントダウンする
  let interval = 1000;

  // ループストリームの作成
  let poll = Bacon.fromPoll(interval, () => interval);
  // ストリーム、プロパティの合成
  let combine = Bacon.combineTemplate({
      interval:poll,
      is_suspend:is_suspend,
      is_reset:is_reset,
    })
    .doAction((val)=>console.log(val))
    .takeWhile((val)=>!val.is_reset)
    .filter((val)=>!val.is_suspend)
    .doAction((val)=>console.log(val))
    .scan(current_duration, (prev, val) => prev - val.interval)
    .doAction((time) => d.push('time', time) )
    .takeWhile((time)=> time > 0);

    // ストリームの端点の設定
    combine.onValue();
    combine.onEnd(() => {
      // 終了するので初期化処理
      d.push('time', 0);
      d.push('is_suspend', false);
      d.push('is_reset', false);
    });
}


// ********************
// public
export default {
  // ***************************
  // Property
  data,

  // ***************************
  // function
  start:(current_duration) => {
    d.push('is_reset', false);
    _start(current_duration);
  },

  suspend: () => {
    d.push('is_suspend', true);
  },

  resume: () => {
    d.push('is_suspend', false);
  },

  reset: (next_duration) => {
    d.push('is_reset', true);
    d.push('time', next_duration);
  },
};
