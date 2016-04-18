import Bacon      from 'baconjs';
import _          from 'lodash';
import moment     from 'moment';

import Dispatcher from '../lib/dispatcher.js';
import Const      from '../lib/const.js';

const d = new Dispatcher();

// ********************
// Property
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

let data = Bacon.combineTemplate({
    is_suspend,
    is_reset,
  })

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
  suspend: () => {
    d.push('is_suspend', true);
  },

  resume: () => {
    d.push('is_suspend', false);
  },

  reset: () => {
    d.push('is_reset', true);
  },

  clear_reset: () => {
    d.push('is_reset', false);
  },

  init: () => {
    d.push('is_reset', false);
    d.push('is_suspend', false);
  },
};
