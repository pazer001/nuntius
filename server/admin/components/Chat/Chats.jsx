import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import ajax from 'superagent';
import appConfig from '../../config';
import moment from 'moment';
import {bindActionCreators} from 'redux';
import {getChats, chatClick} from '../../actions/data';
import Card from 'material-ui/lib/card/card';
import CommunicationChat from 'material-ui/lib/svg-icons/communication/chat';
import RaisedButton from 'material-ui/lib/raised-button';
import {grey50, blue400, lime600, grey900} from 'material-ui/lib/styles/colors'

class Chats extends React.Component {
    constructor() {
        super();
        this.interval   =   {
            getChats: false
        };

        this.state  =   {
            chats: {},
            lastMessageText: []
        };
    }

    sendMessage(sessionHash, message) {
        if(!sessionHash || !message) return;
        let that    =   this;
        ajax.post(`${appConfig.URL}/chat/message/${sessionHash}`)
            .send({
                message,
                source: 'agent',
                companyId: that.props.state.login.body.agent[0].company_id
            })
            .end(() => {that.props.getChats(that.props.state.login.body.agent[0].company_id, that.props.state.sessions.chatHashesChoosed)});

    }

    setLastMessageText(event, sessionHash) {
        if(event.target.value) {
            this.state.lastMessageText[sessionHash] = event.target.value;
        }
    }

    shouldComponentUpdate(nextProp) {
        return !_.isEqual(this.props.state.chat.body, nextProp.state.chat.body)
    }

    renderChatBoxesContainers() {
        let data    =   this.props.state.chat.body,
            chat,
            messageColor,
            messageTime,
            that = this,
            timeDifference = new Date().getTimezoneOffset(),
            primaryText,
            user,
            messageSession;
        var chatContainer   =   [];
        if(data && data.messages.data) {
            let sessionKeys =   Object.keys(this.props.state.sessions.chatHashesChoosed),
                sessionKeysIndex,
                sendSvgIcon  =   '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 512 512" enable-background="new 0 0 512 512" width="512px" height="512px"> <g> <g> <path d="m415.9,339.3c-3.5,3.9-5.4,9.1-5.2,14.4l2.3,63.6-65.8-26.1c-5.9-2.4-11.3-1.2-13.1-0.6-23.4,6.7-47.5,9-70.9,5.6-140.5-20.2-155.8-151.6-152.5-185.6 8.6-87.7 83.9-158.8 174.4-158.8 96.5,0 175,77.5 175,172.8 0.1,42.2-15.7,83-44.2,114.7zm-281.1,88.6c-4.9-1.4-10-0.9-14.6,1.3l-36.5,17.8 2.4-37.9c0.3-5.5-1.5-10.9-5.2-15-18.8-20.9-29.1-47.6-29.1-75.3 0-23 7-45 19.7-63.5 11.3,77.3 64.6,142.2 137.4,169.4-23,8.9-49,10.4-74.1,3.2zm317-67.7c31.8-38.2 49.2-86 49.2-135.5 0-117.8-96.8-213.7-215.8-213.7-108.2,0-200.2,80.9-214.1,185.9-37.8,29.2-60.1,74.2-60.1,121.9 0,34.9 12,68.6 33.9,95.9l-4.1,64.8c-0.5,7.3 3,14.2 9,18.3 3.4,2.3 11.4,5.2 20.3,1.4l61.3-30c48.2,11.3 98.2-1 135.4-31.6 23.7,2 47.9,0.1 71.6-5.9l88.6,35.1c8.5,3.2 15.8,0.2 19.3-2.3 5.6-4 8.9-10.5 8.6-17.4l-3.1-86.9z" fill="#006DF0"/> <path d="m359.8,154.7h-141c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h141c11.3,0 20.4-9.1 20.4-20.4 0-11.2-9.1-20.4-20.4-20.4z" fill="#006DF0"/> <path d="m359.8,261.8h-141c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h141c11.3,0 20.4-9.1 20.4-20.4 0-11.2-9.1-20.4-20.4-20.4z" fill="#006DF0"/> </g> </g> </svg>';
            for(sessionKeysIndex in sessionKeys) {
                chat    =   data.messages.data[sessionKeys[sessionKeysIndex]] || [];
                user    =   data.sessions.data[sessionKeys[sessionKeysIndex]].user_id || 'Guest';
                messageSession  =   `messages_${sessionKeys[sessionKeysIndex]}`;
                chatContainer.push( (
                        <Card key={sessionKeys[sessionKeysIndex]} className="col-sm-2">
                            <div className="label label-default">User ID: {user}</div>
                                <ul ref={messageSession} className="messages-wrapper list-group">
                                    {chat.map(message => {
                                        messageTime     =   moment(message.datetime).subtract(timeDifference, 'minutes').format('YYYY-MM-DD HH:mm:ss');
                                        messageColor    =   message.source == 'agent' ? `list-group-item list-group-item-success`: `list-group-item list-group-item-info`;
                                        primaryText     =   message.source == 'agent' ? <div><span className="label label-success">{messageTime}: </span> {message.message} </div> : <div><span className="label label-info">{messageTime}:</span> {message.message}</div>;
                                        return (<li className={messageColor}  key={message.id ? message.id : 0} >{primaryText} </li>)
                                    })}
                                </ul>
                            <div className="chat-text">
                                <div className="col-sm-8">
                                    <textarea onChange={(event) => {this.setLastMessageText(event, sessionKeys[sessionKeysIndex])}} className="form-control chat-text"  rows="2"></textarea>
                                </div>
                                <div className="col-sm-4">
                                    <RaisedButton className="send-button" label={<CommunicationChat />} primary={true}  onClick={() => {this.sendMessage(sessionKeys[sessionKeysIndex], this.state.lastMessageText[sessionKeys[sessionKeysIndex]])}} />
                                </div>
                            </div>
                        </Card>
                ))
            }
            return chatContainer;
        }
    }

    render() {
        let data    =   this.props.state.chat.body && this.props.state.chat.body.messages;
        if(data) {
            return (<div className="blue-grey darken-4" id="chat-wrapper">{this.renderChatBoxesContainers()}</div>)
        } else {
            return (<div></div>)
        }
    }
}

function mapStateToProps(state) {
    return {state};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({getChats, chatClick}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Chats);