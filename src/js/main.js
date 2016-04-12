import React    from 'react';
import ReactDOM from 'react-dom';

import App      from './components/app.jsx';
import store    from './store.js';


store.state.onValue((state) => {
  ReactDOM.render(<App {...state} />, document.getElementById('app'))
})
