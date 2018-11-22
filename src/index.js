import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { updateAdminReducer } from './redux/reducers';

import { saveAppData as helperSaveAppData } from './utilities/data';

import App from './App';

const store = createStore(updateAdminReducer);

// const unsubscribe = store.subscribe(() => {
store.subscribe(() => {
    // console.log('store getState in Index subscribe', store.getState());

    helperSaveAppData(store.getState().appData, true);              //If the store is updated then need to save the data
});

// unsubscribe();

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)