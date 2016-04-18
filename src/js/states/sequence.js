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
 * @return {void}
 */
let createSequence = () => {
  let pomodoros = _.fill(Array(Const.LONG_BREAK_AFTER), Const.POMODORO_DURATION);
  let breaks = _.fill(Array(Const.LONG_BREAK_AFTER - 1), Const.SHORT_BREAK)
  breaks.push(Const.LONG_BREAK);

  let merged =_.reduce(pomodoros, (result, value, key)=>{
    result.push(value);
    result.push(breaks[key]);
    return result;
  }, []);
  // console.log(merged);
  d.push('replace',merged);
}

let start = () => {
  d.push('next_index', 1);
}


// ********************
// public
export default {
  // ***************************
  // Property
  init,

  // ***************************
  // function
  createSequence,
  // next: ()=>{
  //   d.push('next', null);
  // },
  // シーケンスの開始
  start: () => {
    d.push('next_index', 1);
  }
};
