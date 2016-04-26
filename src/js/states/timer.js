import Bacon        from 'baconjs';
import _            from 'lodash';
import moment       from 'moment';

import Dispatcher   from '../lib/dispatcher.js';
import Const        from '../lib/const.js';

import ControlFlgs  from './control_flgs.js';
import Settings     from './settings.js';

const d = new Dispatcher();

// ********************
// Property
/**
 * 現在の時間(ms)。キックされた後に減っていく。
 *  設定プロパティとも同期している
 * @var  {int}
 */
let time = d.stream('time')
  .toProperty(0)
  .combine(Settings.data, (time, settings)=> {
    return {time: time, duration: settings.pomodoro_duration}
  })
  .slidingWindow(2)
  // 変化している状態を判定して、している値を返す。
  .map((arr)=>{
    let pre = arr[0];
    let current = arr[1];
    if(current == null) return pre.duration;
    if(pre.time !== current.time) return current.time;
    if(pre.duration !== current.duration) return current.duration;
  });


/**
 * 進捗(%)。キックされた後に減っていく。
 * @var  {flot}
 */
let progress = d.stream('progress')
  .toProperty(100)
  .map((pro)=> (pro < 0) ? 0 : pro);

// ***************************
// Property(combine)
let format_time = Bacon.combineAsArray(time)
  .map((val)=>val[0])
  .map((val)=> (val < 0) ? 0 : val )
  .map((val) => moment(val).format("mm:ss"));


let data = Bacon.combineTemplate({
    format_time,
    time,
    progress,
  })
  .debounce(100);

// ********************
// Logic
/**
 * カウントダウンの開始。
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
    .takeWhile((val)=>!val.flgs.is_reset)
    .filter((val)=>!val.flgs.is_suspend)
    // .doAction((val)=>console.log(val))
    .scan(duration, (prev, val) => prev - val.interval)
    .doAction((time) => d.push('progress', (time / duration) * 100) )
    .doAction((time) => d.push('time', time) )
    .takeWhile((time)=> time >= 0);

    // ストリームの端点の設定
    combine.onValue();
    combine.onEnd(() => {
      // 終了するので初期化処理
      d.push('time', duration);
      d.push('progress', 100);
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
