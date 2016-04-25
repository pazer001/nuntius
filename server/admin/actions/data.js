import ajax from 'superagent'
import appConfig from '../config'

export function login(data) {
    const request   =   ajax.post(`${appConfig.URL}/login`)
                            .send({
                                email: data.email,
                                password: data.password,
                                companyId: data.companyId
                            })
                            // .end();

    return {
        type: 'LOGIN_AGENT',
        payload: request
    }
}

export function getChats(companyId, chatHashes) {
    const request   =   ajax.get(`${appConfig.URL}/chat/getData/${companyId}`)
                            .query({chatHashes: Object.keys(chatHashes)});
    return {
        type: 'GET_CHATS',
        payload: request
    }
}

export function getBanners(companyId, chatHashes) {
    const request   =   ajax.get(`${appConfig.URL}/banners/getBanners/${companyId}`);
    return {
        type: 'GET_BANNERS',
        payload: request
    }
}

export function showBanners() {
    return {
        type: 'SHOW_BANNERS',
        payload: true
    }
}

export function hideBanners() {
    return {
        type: 'HIDE_BANNERS',
        payload: true
    }
}

export function selectedBannerSessionHash(session_hash) {
    return {
        type: 'SELECTED_BANNER_SESSION_HASH',
        payload: session_hash
    }
}

export function chatClick(sessionHash) {
    return {
        type: 'CHAT_CLICK',
        payload: sessionHash
    }
}