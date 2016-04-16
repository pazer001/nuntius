import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getChats, chatClick, showBanners, hideBanners, selectedBannerSessionHash} from '../actions/data';
import Chats from './Chats.jsx';
import Banners from './Banners.jsx';
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
import {grey50, green900, indigo900, grey900} from 'material-ui/lib/styles/colors'
import IconButton from 'material-ui/lib/icon-button';
import ChatButton from 'material-ui/lib/svg-icons/communication/chat';
import BannerButton from 'material-ui/lib/svg-icons/av/web';

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
        if(!this.props.state.login.data) return;
        this.props.getChats(this.props.state.login.data.agent[0].company_id, this.state.chatHashesChoosed);
        clearInterval(this.intervals.getChats);
        this.intervals.getChats     =   setInterval(() => {
            if(!this.props.state.login.data) {
                clearInterval(this.intervals.getChats);
                location.href   =   '#/';
                return;
            }
            this.props.getChats(this.props.state.login.data.agent[0].company_id, this.state.chatHashesChoosed)
        }, this.intervals.getChatsTime);
    }

    componentWillUnmount() {
        clearInterval(this.intervals.getChats);

    }

    chatClick(sessionHash) {
        if(this.state.chatHashesChoosed[sessionHash]) {
            delete this.state.chatHashesChoosed[sessionHash];
        } else {
            this.state.chatHashesChoosed[sessionHash]    =   sessionHash;
        }

        this.props.getChats(this.props.state.login.data.agent[0].company_id, this.state.chatHashesChoosed)
    }

    bannerClick(session_hash) {
        this.props.showBanners()
        this.props.selectedBannerSessionHash(session_hash)
    }

    designChats() {
        let data    =   this.props.state.chat.body;
        if(!data) return;
        let timeDifference,
            boxStyle,
            lastHeading,
            utcDifference = moment().utcOffset(),
            that = this,
            sessions,
            sessionHash,
            textColor;
        this.intervals.activeChatColor  =   this.intervals.activeChatColor == 'green' ? 'blue' : 'green';
        return sessions =   _.values(data.sessions.data).map((session) => {
            sessionHash     =   session.hash;

            if(data.chats.data[sessionHash] && (data.chats.data[sessionHash].user_messages && !data.chats.data[sessionHash].agent_messages)) {
                boxStyle    =   {
                    'backgroundColor': indigo900
                };
                textColor   =   {
                    'color':grey50
                };
                lastHeading     =   'Last Message';
                that.state.messageInChat[sessionHash]   =   true
            }

            if(data.chats.data[sessionHash] && (data.chats.data[sessionHash].user_messages && data.chats.data[sessionHash].agent_messages)) {
                boxStyle        =   {
                    'backgroundColor': green900
                };
                textColor       =   {
                    'color':grey50
                };
                lastHeading     =   'Last Message';
                that.state.messageInChat[sessionHash]   =   true;
            }


            if(!data.chats.data[sessionHash]) {
                boxStyle    =      {
                    'backgroundColor': grey50
                };
                textColor       =   {
                    'color': grey900
                };
                lastHeading     =   'On Site';
            }

            timeDifference  =   moment(session.datetime).subtract(-utcDifference, 'minutes').fromNow(true);
            return (
                <Card key={session.id} className="chat-box">
                    <CardText >
                        <Table selectable={false} style={boxStyle}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow selectable={false} style={textColor}>
                            <TableHeaderColumn>User</TableHeaderColumn>
                            <TableHeaderColumn>{lastHeading}</TableHeaderColumn>
                            <TableHeaderColumn>Action</TableHeaderColumn>
                        </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false} adjustForCheckbox={false} >
                        <TableRow selectable={false} style={textColor}>
                            <TableRowColumn>{session.user_id || 'Guest'}</TableRowColumn>
                            <TableRowColumn>{timeDifference}</TableRowColumn>
                            <TableRowColumn>
                                <IconButton tooltip="Open Chat" onClick={() => {this.chatClick(sessionHash)}}>
                                    <ChatButton color={textColor.color} />
                                </IconButton>
                                <IconButton tooltip="Open Banner" onClick={this.chatClick.bind(this, session)} onClick={() => {this.bannerClick(sessionHash)}}>
                                    <BannerButton color={textColor.color} />
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
            <div className="row">
                {this.designChats()}
                <Chats chatHashesChoosed={this.state.chatHashesChoosed} />
                {this.props.state.banners.showBanners ? <Banners /> : (<div></div>)}
            </div>
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