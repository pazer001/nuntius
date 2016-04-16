import {combineReducers, createStore, applyMiddleware} from 'redux';
import ReduxPromise from 'redux-promise';
import {login, chat, chatClick, banners} from '../actions/actions'

const createStoreWithMiddleware =   applyMiddleware(ReduxPromise)(createStore);

const rootReducer   =   createStoreWithMiddleware(combineReducers({
    brands: function () {
        return [
            {id: 1, name: 'IGMD'},
            {id: 2, name: 'Future Binary'}
        ]
    },
    login: login,
    chat: chat,
    banners: banners
}));

export default rootReducer;