import Bacon  from 'baconjs';
import _      from 'lodash';

import ControlFlgs  from './states/control_flgs.js';
import Timer        from './states/timer.js';
import Sequence     from './states/sequence.js';


// ********************
// Logic


// ***************************
// Property(Bus)


// ***************************
// Property(combine)
// Appコンポーネント用のstateプロパティ
var state = Bacon.combineTemplate({
  timer: Timer.data,
  sequence: Sequence.init([]),
  control_flgs:ControlFlgs.data,
})
  .doAction((state) => {
    console.log(state);
  });


export default {
  // ********************
  // main property (app component state)
  /**
  * @property {Bacon.Property} combineTemplate for Component state
  */
  state

};
