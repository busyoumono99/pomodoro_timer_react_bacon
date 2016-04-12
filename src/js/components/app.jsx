import React from 'react';

import CountDownTime from '../states/count_down_time.js';

export default class App extends React.Component{

  onClickStartBtn() {
    CountDownTime.start();
  }

  render() {
    return (
      <div>
        <h1>Pomodoro Timer</h1>
        <div>{this.props.count_down_time}</div>
        <input
          type="button"
          value="start"
          onClick={this.onClickStartBtn.bind(this)}
          />
      </div>
    );
  }

};
