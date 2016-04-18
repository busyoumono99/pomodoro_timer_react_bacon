import Bacon        from 'baconjs';
import _            from 'lodash';
import moment       from 'moment';

import Dispatcher   from '../lib/dispatcher.js';
import Const        from '../lib/const.js';

import ControlFlgs  from './control_flgs.js';

const d = new Dispatcher();

// ********************
// Property
/**
 * 現在の時間(ms)。キックされた後に減っていく。
 * @var  {int}
 */
let time = d.stream('time')
  .toProperty(Const.POMODORO_DURATION);

// ***************************
// Property(combine)
let format_time = Bacon.combineAsArray(time)
  .map((val)=>val[0])
  .map((val)=>{
    if (_.isUndefined(val)) {
      return 0;
    }
    return val;
  })
  .map((val) => moment(val).format("mm:ss"));


let data = Bacon.combineTemplate({
    format_time,
    time,
  })

// ********************
// Logic
/**
 * カウントダウンの開始。
 * TODO:キューを作ってポモドーロ、休憩、ポモドーロ、休憩、ポモドーロ、休憩、を繰り返すようにする
 * @return {void}
 */
let _start = (duration, callback) => {
  // 1秒毎にカウントダウンする
  let interval = 1000;

  // ループストリームの作成
  let poll = Bacon.fromPoll(interval, () => interval);
  // ストリーム、プロパティの合成
  let combine = Bacon.combineTemplate({
      interval: poll,
      flgs:     ControlFlgs.data,
    })
    .doAction((val)=>{
      // console.log(ControlFlgs);
      // console.log(ControlFlgs.data);
      // console.log(ControlFlgs.data.is_suspend);
      console.log(val)
    })
    .takeWhile((val)=>!val.flgs.is_reset)
    .filter((val)=>!val.flgs.is_suspend)
    // .doAction((val)=>console.log(val))
    .scan(duration, (prev, val) => prev - val.interval)
    .doAction((time) => d.push('time', time) )
    .takeWhile((time)=> time > 0);

    // ストリームの端点の設定
    combine.onValue();
    combine.onEnd((val) => {
      console.log(val);
      // 終了するので初期化処理
      d.push('time', 0);
      // d.push('is_suspend', false);
      // d.push('is_reset', false);
      // ControlFlgs.init();
      callback();
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
  start:(duration, callback) => {
    _start(duration, callback);
  },
};