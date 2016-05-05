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
    
    renderChatBoxesContainers() {
        let data    =   this.props.state.chat.body,
            chat,
            messageColor,
            messageTime,
            that = this,
            timeDifference = new Date().getTimezoneOffset(),
            primaryText,
            user,
            messageSession,
            hash;
        var chatContainer   =   [];
        if(data && data.messages.data) {
            let sessionKeys =   Object.keys(this.props.state.sessions.chatHashesChoosed),
                sessionKeysIndex;
            for(sessionKeysIndex in sessionKeys) {
                if(!data.sessions.data[sessionKeys[sessionKeysIndex]]) continue;
                chat            =   data.messages.data[sessionKeys[sessionKeysIndex]] || [];
                user            =   data.sessions.data[sessionKeys[sessionKeysIndex]].user_id || 'Guest';
                messageSession  =   `messages_${sessionKeys[sessionKeysIndex]}`;
                hash            =   data.sessions.data[sessionKeys[sessionKeysIndex]].hash;
                chatContainer.push( (
                        <Card key={hash} className="col-sm-2">
                            <div className="label label-default">User ID: {user}</div>
                                <ul ref={messageSession} className="messages-wrapper list-group">
                                    {chat.map(message => {
                                        messageTime     =   moment(message.datetime).subtract(timeDifference, 'minutes').format('YYYY-MM-DD HH:mm:ss');
                                        messageColor    =   message.source == 'agent' ? `list-group-item list-group-item-success`: `list-group-item list-group-item-info`;
                                        primaryText     =   message.source == 'agent' ? <div><span className="label label-success">{messageTime}: </span> {message.message} </div> : <div><span className="label label-info">{messageTime}:</span> {message.message}</div>;
                                        return (<li className={messageColor}  key={message.datetime} >{primaryText} </li>)
                                    })}
                                </ul>
                            <div className="chat-text">
                                <div className="col-sm-8">
                                    <textarea onChange={(event) => {this.setLastMessageText(event, sessionKeys[sessionKeysIndex])}} className="form-control chat-text"  rows="2"></textarea>
                                </div>
                                <div className="col-sm-4">
                                    <RaisedButton className="send-button" label={<CommunicationChat />} primary={true}  onClick={this.sendMessage.bind(this, sessionKeys[sessionKeysIndex], this.state.lastMessageText[sessionKeys[sessionKeysIndex]])} />
                                </div>
                            </div>
                        </Card>
                ))
            }
            return chatContainer;
        }
    }

    render() {
        let data    =   this.props.state.chat.body && this.props.state.chat.body.messages.code === 200;
        if(data) {
            return (<Card id="chat-wrapper">{this.renderChatBoxesContainers()}</Card>)
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