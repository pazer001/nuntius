import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getChats, chatClick, showBanners, hideBanners, selectedBannerSessionHash} from '../../actions/data';
import moment from 'moment';
import _ from 'lodash';
import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import {green900, green50, deepPurple900, deepPurple50, teal900, teal50, deepOrange900, deepOrange50} from 'material-ui/lib/styles/colors'
import IconButton from 'material-ui/lib/icon-button';
import ChatButton from 'material-ui/lib/svg-icons/communication/chat';
import BannerButton from 'material-ui/lib/svg-icons/av/web';
import CardHeader from 'material-ui/lib/card/card-header';

export default class Sessions extends React.Component {
    constructor() {
        super();
        this.intervals  =   {
            getChats: null,
            getChatsTime: 1000,
            activeChatColor: 'green'
        };

        this.state  =   {
            chatHashesChoosed: [],
            firstChatMessage: [],
            showFirstChatMessageDialog: [],
            messageInChat: []
        }
    }



    componentDidMount() {
        if(!this.props.state.login.body) return;
        this.props.getChats(this.props.state.login.body.agent[0].company_id, this.props.state.sessions.chatHashesChoosed);
        clearInterval(this.intervals.getChats);
        this.intervals.getChats     =   setInterval(() => {
            if(!this.props.state.login.body) {
                clearInterval(this.intervals.getChats);
                location.href   =   '#/';
                return;
            } else {
                this.props.getChats(this.props.state.login.body.agent[0].company_id, this.props.state.sessions.chatHashesChoosed);
            }

        }, this.intervals.getChatsTime);
    }

    componentWillUnmount() {
        clearInterval(this.intervals.getChats);
    }

    chatClick(sessionHash) {
        this.props.chatClick(sessionHash);
        setTimeout(() => {this.props.getChats(this.props.state.login.body.agent[0].company_id, this.props.state.sessions.chatHashesChoosed)})
    }

    bannerClick(session_hash) {
        this.props.showBanners();
        this.props.selectedBannerSessionHash(session_hash)
    }

    designSessions() {
        let data    =   this.props.state.chat.body;
        if(!data) return;
        let timeDifference,
            boxStyle,
            lastHeading,
            utcDifference = moment().utcOffset(),
            that = this,
            sessions,
            textColor   =   {},
            userMessages    =   0,
            agentMessages   =   0;

        this.intervals.activeChatColor  =   this.intervals.activeChatColor == 'green' ? 'blue' : 'green';
        return sessions =   _.values(data.sessions.data).map((session) => {
            if(data.chats.data[session.hash] && data.chats.data[session.hash]) {
                userMessages    =   data.chats.data[session.hash].user_messages;
                agentMessages   =   data.chats.data[session.hash].agent_messages;
            }

            if(data.chats.data[session.hash] && (userMessages && !agentMessages)) {
                boxStyle    =   {
                    'backgroundColor': teal900,
                    'color': teal50
                };
                lastHeading     =   'Last Message';
                that.state.messageInChat[session.hash]   =   true
            } else if(data.chats.data[session.hash] && (userMessages && agentMessages)) {
                boxStyle = {
                    'backgroundColor': deepPurple900,
                    'color': deepPurple50
                };
                lastHeading = 'Last Message';
                that.state.messageInChat[session.hash] = true;
            } else if(data.chats.data[session.hash] && (!userMessages && agentMessages)) {
                boxStyle    =      {
                    'backgroundColor': green900,
                    'color': green50
                };
                lastHeading     =   'Last Message';
            } else {
                boxStyle    =      {
                    'backgroundColor': deepOrange900,
                    'color': deepOrange50
                };
                lastHeading     =   'On Site';
            }
            timeDifference  =   moment(session.datetime).subtract(-utcDifference, 'minutes').fromNow(true);
            return (
                <Card key={session.id} className="chat-box">
                    <CardText >
                        <Table selectable={false} style={boxStyle}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow selectable={false}>
                            <TableHeaderColumn color={boxStyle.color}>User</TableHeaderColumn>
                            <TableHeaderColumn color={boxStyle.color}>{lastHeading}</TableHeaderColumn>
                            <TableHeaderColumn color={boxStyle.color}>Action</TableHeaderColumn>
                        </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false} adjustForCheckbox={false} >
                        <TableRow selectable={false} color={boxStyle.color}>
                            <TableRowColumn>{session.user_id || 'Guest'}</TableRowColumn>
                            <TableRowColumn>{timeDifference}</TableRowColumn>
                            <TableRowColumn>
                                <IconButton tooltip="Open Chat" onClick={() => {this.chatClick(session.hash)}}>
                                    <ChatButton color={boxStyle.color} />
                                </IconButton>
                                <IconButton tooltip="Open Banner" onClick={this.chatClick.bind(this, session)} onClick={() => {this.bannerClick(session.hash)}}>
                                    <BannerButton color={boxStyle.color} />
                                </IconButton>
                            </TableRowColumn>
                        </TableRow>
                        </TableBody>
                    </Table>
                    </CardText>
                </Card>
            );
        });
    }

    render() {
        return (
            <Card>
                <CardHeader title="Sessions" />
                {this.designSessions()}
            </Card>
        )
    }
}

function mapStateToProps(state) {
    return {state};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({getChats, chatClick, showBanners, hideBanners, selectedBannerSessionHash}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Sessions);