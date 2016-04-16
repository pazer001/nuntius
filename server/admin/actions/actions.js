import ajax from 'superagent'

export function login(state = {}, action) {
    switch (action.type) {
        case 'LOGIN_AGENT':
            if(action.payload.data.code === 200) {
                localStorage.setItem('Login', JSON.stringify(action.payload.data));
                location.href   =   '#/'
            }

            return action.payload
    }
    return state;
}

export function chat(state = {}, action) {
    switch (action.type) {
        case 'GET_CHATS':
            return action.payload
    }
    return state;
}

export function banners(state = {}, action) {
    switch (action.type) {
        case 'GET_BANNERS':
            let data    =   Object.assign({}, state);
            var newDate =   [];
            for(let i in action.payload.body.data) {
                newDate[action.payload.body.data[i].id] =   action.payload.body.data[i];
            }
            action.payload.body.data    =   newDate
            data.bannersData            =   action.payload;
            return data;
    }

    switch (action.type) {
        case 'SHOW_BANNERS':
            let data    =   Object.assign({}, state);
            data.showBanners    =   true;
            return data
    }

    switch (action.type) {
        case 'HIDE_BANNERS':
            let data    =   Object.assign({}, state);
            data.showBanners    =   false;
            return data
    }

    switch (action.type) {
        case 'SELECTED_BANNER_SESSION_HASH':
            let data    =   Object.assign({}, state);
            data.selectedBannerSessionHash    =   action.payload;
            return data
    }
    return state;
}