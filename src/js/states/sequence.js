import Bacon      from 'baconjs';
import _          from 'lodash';
import moment     from 'moment';

import Dispatcher from '../lib/dispatcher.js';
import Const      from '../lib/const.js';

import ControlFlgs  from './control_flgs.js';
import Timer from './timer.js';

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
    Timer.start(newSequence[0], ()=>{
      if (newSequence.length >0) {
        d.push('next');
      }
    });
    return newSequence;
  };

  let clearSequence = () => {
    d.push('current_duration',0)
    return [];
  };

  let startSequence = (items) => {
    Timer.start(items[0], ()=>{
      d.push('next');
    });
    return items;
  }



  // カレント配列、ストリーム、配列を返す関数の組み合わせ
  const sequenceS = Bacon.update(initialValue,
    [d.stream('replace')],          replaceSequence,
    [d.stream('next')],             nextSequence,
    [d.stream('clear')],            clearSequence,
    [d.stream('start')],            startSequence,
  )
  return sequenceS;
  // return Bacon.combineAsArray([sequenceS, flgsP]).map(withDisplayStatus)
};

// 初期化を実行する
// init([]);








/**
 * 現在の時間(ms)。キックされた後に減っていく。
 * @var  {int}
 */
let current_duration = d.stream('current_duration')
  .toProperty(0);

/**
 * 現在の時間(ms)。キックされた後に減っていく。
 * @var  {int}
 */
// let sequence = d.stream('sequence')
//   .toProperty([]);

/**
 * 一時停止フラグ
 * @var  {bool}
 */
// let current_index = d.stream('current_index')
//   .toProperty(0);
//
// let next = d.stream('next');

// ***************************
// Property(combine)
// let next_value = next
//   .combine(sequence,(val1, val2)=>{
//     console.log(val1);
//     console.log(val2);
//     return 'hoge';
//   });

// let data = Bacon.combineTemplate({
//   sequence,
//   current_index,
//   // next_value,
// });

// ********************
// Logic
/**
 * カウントダウンの開始。
 * TODO:キューを作ってポモドーロ、休憩、ポモドーロ、休憩、ポモドーロ、休憩、を繰り返すようにする
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
  d.push('start', null);
}


// ********************
// public
export default {
  // ***************************
  // Property
  // data,
  init,
  start,

  // ***************************
  // function
  createSequence,
  next: ()=>{
    d.push('next', null);
  },

  // start: ()=>{
  // }
};
