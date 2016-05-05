import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory, IndexRoute  } from 'react-router'
import {Provider} from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

import darkBaseTheme from 'material-ui/lib/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';

import state from './reducers/index';

import Layout from './components/Layout.jsx';
import Default from './components/Default.jsx';
import Login from './components/Login.jsx';
import IndexChat from './components/Chat/IndexChat.jsx';

injectTapEventPlugin();
const darkMuiTheme = getMuiTheme(darkBaseTheme);

ReactDOM.render((
    <Provider store={state}>
        <MuiThemeProvider muiTheme={darkMuiTheme}>
            <Router history={hashHistory}>
                <Route path="/" component={Layout}>
                    <IndexRoute component={Default}></IndexRoute>
                    <Route path="login" component={Login}/>
                    <Route path="chat" component={IndexChat}/>
                </Route>
            </Router>
        </MuiThemeProvider>
    </Provider>
), document.getElementById('nuntius-app'));