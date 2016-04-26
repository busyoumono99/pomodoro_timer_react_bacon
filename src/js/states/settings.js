import Bacon        from 'baconjs';
import _            from 'lodash';
// import moment       from 'moment';

import Dispatcher   from '../lib/dispatcher.js';
import Const        from '../lib/const.js';

// import ControlFlgs  from './control_flgs.js';
// import Timer        from './timer.js';

const d = new Dispatcher();

// ********************
// Property
let pomodoro_duration = d.stream('pomodoro_duration')
  .toProperty(Const.POMODORO_DURATION)
  .map((val) => parseInt(val, 10));

let short_break = d.stream('short_break')
  .toProperty(Const.SHORT_BREAK)
  .map((val) => parseInt(val, 10));

let long_break = d.stream('long_break')
  .toProperty(Const.LONG_BREAK)
  .map((val) => parseInt(val, 10));

let long_break_after = d.stream('long_break_after')
  .toProperty(Const.LONG_BREAK_AFTER)
  .map((val) => parseInt(val, 10));





// ***************************
// Property(combine)
let data = Bacon.combineTemplate({
    pomodoro_duration,
    short_break,
    long_break,
    long_break_after,
  })
  .debounce(100);

// ********************
// Logic


// ********************
// public
export default {
  // ***************************
  // Property
  data,

  // ***************************
  // function
  updatePomodoroDuration: (val) =>{
    d.push('pomodoro_duration', val);
  },
  updateShortBreak: (val) =>{
    d.push('short_break', val);
  },
  updateLongBreak: (val) =>{
    d.push('long_break', val);
  },
  updateLongBreakAfter: (val) =>{
    d.push('long_break_after', val);
  },
};
