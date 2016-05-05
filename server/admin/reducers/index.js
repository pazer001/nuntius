import {combineReducers, createStore, applyMiddleware} from 'redux';
import ReduxPromise from 'redux-promise';
import {login, chat, chatClick, banners, sessions, brands, settings, statistics} from '../actions/actions'

const createStoreWithMiddleware =   applyMiddleware(ReduxPromise)(createStore);

const rootReducer   =   createStoreWithMiddleware(combineReducers({
    brands: brands,
    login: login,
    chat: chat,
    banners: banners,
    sessions: sessions,
    settings: settings,
    statistics: statistics
}));

export default rootReducer;