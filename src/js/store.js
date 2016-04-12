import Bacon  from 'baconjs';
import _      from 'lodash';

import CounDownTime from './states/count_down_time.js';


// ********************
// Logic


// ***************************
// Property(Bus)


// ***************************
// Property(combine)
// Appコンポーネント用のstateプロパティ
var state = Bacon.combineTemplate({
  count_down_time: CounDownTime.current_time_ms,
})
  .doAction((state) => console.log(state));


export default {
  // ********************
  // main property (app component state)
  /**
  * @property {Bacon.Property} combineTemplate for Component state
  */
  state

};
