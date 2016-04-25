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
  .toProperty(Const.POMODORO_DURATION);
  // .toProperty



// ***************************
// Property(combine)
let data = Bacon.combineTemplate({
    pomodoro_duration,
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
  }
};
