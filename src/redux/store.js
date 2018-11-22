import Redux from 'react-redux';
import counter from './reducers';

const state = { count: 0 }

const store = Redux.createStore(counter, state);