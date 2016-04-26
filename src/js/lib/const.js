import _            from 'lodash';

export default {
  // ***************************
  //  ポモドーロ時間(ms)
  POMODORO_DURATION: 25 * 60 * 1000,

  SHORT_BREAK: 5 * 60 * 1000,

  LONG_BREAK: 15 * 60 * 1000,


  // LONG_BREAK_AFTER:4,
  LONG_BREAK_AFTER:2,

  OPTIONS_RANGE:{
    POMODORO_DURATION:  _.range(5, 61, 5),
    SHORT_BREAK:        _.range(1, 11, 1),
    LONG_BREAK:         _.range(5, 31, 1),
    LONG_BREAK_AFTER:   _.range(1, 11, 1),
  }

};
