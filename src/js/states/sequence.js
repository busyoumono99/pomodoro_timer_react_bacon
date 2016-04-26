import Bacon        from 'baconjs';
import _            from 'lodash';
import moment       from 'moment';

import Dispatcher   from '../lib/dispatcher.js';
import Const        from '../lib/const.js';

import ControlFlgs  from './control_flgs.js';
import Timer        from './timer.js';

const d = new Dispatcher();

// ********************
// Property


let init = (initialValue) => {
  let flgs = {};

  let replaceSequence = (items, newSequence) => {
    return newSequence;
  };

  let nextSequence = (items) => {
    let newSequence = _.tail(items);
    return newSequence;
  };

  let clearSequence = () => {
    d.push('current_duration',0)
    return [];
  };

  // カレント配列、ストリーム、配列を返す関数の組み合わせ
  const sequenceS = Bacon.update(initialValue,
    [d.stream('replace')],          replaceSequence,
    [d.stream('next')],             nextSequence,
    [d.stream('clear')],            clearSequence,
  )
  return sequenceS;
};

/**
 * 次のindex。
 * @var  {int}
 */
let next_index = d.stream('next_index')
  .scan(0, (seed, val)=>{
    if (val > 0) {
      return seed + val;
    }
    return 0;
  });


// ***************************
// Property(combine)
Bacon.combineTemplate({
  next_index,
  sequence: init([]),
  flgs:   ControlFlgs.data,
})
  // next_indexが同じ場合は停止。sequenceかflgsの更新で次に進むと無限ループに入る
  .skipDuplicates((_old, _new) => _old.next_index === _new.next_index)
  // .doAction((val)=>console.log(val))
  // next_indexが0以外は次へ
  .filter((val)=>val.next_index !== 0)
  .flatMap((val)=>{
    // sequenceが0なら終了処理へ
    if(val.sequence.length === 0){
      return new Bacon.Error();
    }
    // リセットフラグが立っていれば終了処理へ
    if (val.flgs.is_reset) {
      return new Bacon.Error();
    }
    return val;
  })
  // .doAction((val) => console.log(val))
  // sequenceを進める
  .doAction((val)=>d.push('next'))
  // タイマーの設定。タイマー終了時のコールバックでsequenceを進める
  .map((val)=>{
    Timer.start(val.sequence[0],()=>{
      d.push('next_index', 1);
    })
  })
  // 終了処理
  .mapError(()=>{
    d.push('replace', []);
    d.push('next_index', 0);
    ControlFlgs.init();
  })
  .onValue();


// ********************
// Logic
/**
 * キューのシーケンスを作る。ポモドーロ、休憩、ポモドーロ、休憩...を繰り返すようにする
 * @param  {int} duration    ポモドーロ時間の間隔
 * @param  {int} short_break 休憩時間:短い
 * @param  {int} long_break  休憩時間:長い
 * @param  {int} break_after 何回繰り返した後か
 * @return {void}
 */
let createSequence = (duration, short_break, long_break, break_after) => {
  // ポモドーロと休憩の配列をそれぞれ作る
  let pomodoros = _.fill(Array(break_after), duration);
  let breaks = [];
  if (break_after !== 1) {
    breaks = _.fill(Array(break_after - 1), short_break)
    breaks.push(long_break);
  } else {
    // 1回の時は短い休憩のみにする
    breaks = _.fill(Array(break_after), short_break)
  }

  //  交互に配置する
  let merged =_.reduce(pomodoros, (result, value, key)=>{
    result.push(value);
    result.push(breaks[key]);
    return result;
  }, []);
  // console.log(merged);
  // 設定
  d.push('replace',merged);
}


// ********************
// public
export default {
  // ***************************
  // Property
  init,

  // ***************************
  // function
  createSequenceAll: (stt)=>{
    createSequence(stt.pomodoro_duration, stt.short_break, stt.long_break, stt.long_break_after);
  },

  createSequenceOnce: (stt)=>{
    createSequence(stt.pomodoro_duration, stt.short_break, stt.long_break, 1);
  },

  // シーケンスの開始
  start: () => {
    d.push('next_index', 1);
  },
};
