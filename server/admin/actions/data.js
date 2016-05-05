import ajax from 'superagent'
import appConfig from '../config'
import _ from 'lodash';

export function showAddAgentDialog(currentShowAddAgentDialog) {
    currentShowAddAgentDialog   =   !currentShowAddAgentDialog;
    return {
        type: 'SHOW_ADD_AGENT_DIALOG',
        payload: currentShowAddAgentDialog
    }
}

export function hideAddAgentDialog(currentShowAddAgentDialog) {
    currentShowAddAgentDialog   =   !currentShowAddAgentDialog;
    return {
        type: 'HIDE_ADD_AGENT_DIALOG',
        payload: currentShowAddAgentDialog
    }
}

export function addAgent(addAgentDialogData, companyId) {
    let valuesLength                =   1,
        addAgentDialogDataIndex;
    for(addAgentDialogDataIndex in addAgentDialogData) {
        if(!_.isEmpty(addAgentDialogData[addAgentDialogDataIndex])) {
            valuesLength++
        }
    }

    if (valuesLength === 6) {
        const request = ajax.post(`${appConfig.URL}/agents/add`)
            .send({
                companyId: companyId,
                agentName: addAgentDialogData.agentName,
                agentRealName: addAgentDialogData.agentRealName,
                agentEmail: addAgentDialogData.agentEmail,
                agentPassword: addAgentDialogData.agentPassword,
                agentLevel: addAgentDialogData.agentLevel,
                deskName: addAgentDialogData.deskName
            })
        return {
            type: 'ADD_AGENT',
            payload: request
        }
    } else {
        return {
            type: 'ADD_AGENT',
            payload: false
        }
    }
}

export function setBrands(companyId) {
    const request   =   ajax.get(`${appConfig.URL}/system/brands`)
        .query({ companyId });

    return {
        type: 'SET_BRANDS',
        payload: request
    }
}

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

export function getChatStatistics(companyId) {
    const request   =   ajax.get(`${appConfig.URL}/chat/getChatStatistics`)
        .query({
            companyId: companyId
        });

    return {
        type: 'GET_CHAT_STATISTICS',
        payload: request
    }
}