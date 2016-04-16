import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory, IndexRoute  } from 'react-router'
import {Provider} from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

import state from './reducers/index';

import Layout from './components/Layout.jsx';
import Default from './components/Default.jsx';
import Login from './components/Login.jsx';
import Sessions from './components/Sessions.jsx';


ReactDOM.render((
    <Provider store={state}>
        <Router history={hashHistory}>
            <Route path="/" component={Layout}>
                <IndexRoute component={Default}></IndexRoute>
                <Route path="login" component={Login}/>
                <Route path="chat" component={Sessions}/>
            </Route>
        </Router>
    </Provider>
), document.getElementById('nuntius-app'));