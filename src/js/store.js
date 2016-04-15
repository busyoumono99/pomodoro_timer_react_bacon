import Bacon  from 'baconjs';
import _      from 'lodash';

import CounDownTime from './states/timer.js';


// ********************
// Logic


// ***************************
// Property(Bus)


// ***************************
// Property(combine)
// Appコンポーネント用のstateプロパティ
var state = Bacon.combineTemplate({
  timer: CounDownTime.data,
})
  .doAction((state) => {
    console.log(state)
  });


export default {
  // ********************
  // main property (app component state)
  /**
  * @property {Bacon.Property} combineTemplate for Component state
  */
  state

};
