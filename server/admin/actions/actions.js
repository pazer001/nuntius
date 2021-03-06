export function settings(state = {}, action) {
    let data;
    switch (action.type) {
        case 'SHOW_ADD_AGENT_DIALOG':
            data    =   Object.assign({}, state);
            data.showAddAgentDialog     =   action.payload;
            return data;

        case 'HIDE_ADD_AGENT_DIALOG':
            data    =   Object.assign({}, state);
            data.showAddAgentDialog     =   action.payload;
            return data;

        case 'ADD_AGENT':
            data    =   Object.assign({}, state);
            if(!action.payload) data.addAgentErrorFieldLength = true;
            if(action.payload) {
                data.addAgentErrorFieldLength   =   false;
                data.addAgentResult             =   action.payload;
            }
            return data;
    }
    return state;
}

export function brands(state = {}, action) {
    switch (action.type) {
        case 'SET_BRANDS':
            return action.payload
    }
    return state;
}


export function login(state = {}, action) {
    switch (action.type) {
        case 'LOGIN_AGENT':
            if(action.payload.body && action.payload.body.code && action.payload.body.code === 200) {
                localStorage.setItem('Login', JSON.stringify(action.payload.body));
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

export function sessions(state = {}, action) {
    switch (action.type) {
        case 'CHAT_CLICK':
            let data    =   Object.assign({}, state);
            if(data.chatHashesChoosed[action.payload]) {
                delete data.chatHashesChoosed[action.payload]
            } else {
                data.chatHashesChoosed[action.payload] =    true
            }
            return data;
    }
    if(!state.chatHashesChoosed) state.chatHashesChoosed = {};
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
            action.payload.body.data    =   newDate;
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

export function statistics(state = {}, action) {
    switch (action.type) {
        case 'GET_CHAT_STATISTICS':
            return action.payload;
    }
    return state;
}