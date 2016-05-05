import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getChats, chatClick, showBanners, hideBanners, selectedBannerSessionHash} from '../../actions/data';
import moment from 'moment';
import _ from 'lodash';
import Card from 'material-ui/lib/card/card';
import {green900, green50, deepPurple900, deepPurple50, teal900, teal50, deepOrange900, deepOrange50} from 'material-ui/lib/styles/colors'
import CardText from 'material-ui/lib/card/card-text';
import FaceIcon from 'material-ui/lib/svg-icons/action/face';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import RaisedButton from 'material-ui/lib/raised-button';

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
            messageInChat: [],
            expanded: true
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
        let data    =   this.props.state.chat.body,
            timeDifference,
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
            if(data.chats.data[session.hash]) {
                userMessages    =   data.chats.data[session.hash].user_messages;
                agentMessages   =   data.chats.data[session.hash].agent_messages;
            } else {
                userMessages    =   0;
                agentMessages   =   0;
            }

            if(data.chats.data[session.hash] && (userMessages && !agentMessages)) {
                boxStyle    =   {
                    'boxShadow': `0px 0px .5em ${teal900}`,
                    'color': teal50
                };
                lastHeading     =   'Last Message';
                that.state.messageInChat[session.hash]   =   true
            } else if(data.chats.data[session.hash] && (userMessages && agentMessages)) {
                console.log('here')
                boxStyle = {
                    'boxShadow': `0px 0px .5em ${deepPurple900}`,
                    'color': deepPurple50
                };
                lastHeading = 'Last Message';
                that.state.messageInChat[session.hash] = true;
            } else if(data.chats.data[session.hash] && (!userMessages && agentMessages)) {
                boxStyle    =      {
                    'boxShadow': `0px 0px .5em ${green900}`,
                    'color': green50
                };
                lastHeading     =   'Last Message';
            } else {
                boxStyle    =      {
                    'boxShadow': `0px 0px .5em ${deepOrange900}`,
                    'color': deepOrange50
                };
                lastHeading     =   'On Site';
            }
            timeDifference  =   moment(session.datetime).subtract(-utcDifference, 'minutes').fromNow(true);
            return (
                <Card key={session.hash} className="session-box col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-1" style={boxStyle}>
                        <CardHeader
                            title={session.user_id || 'Guest'}
                            subtitle={timeDifference}
                            avatar={this.props.state.brands.body ? this.props.state.brands.body[session.brand_id].image_url : <FaceIcon />}
                        />
                    <CardActions>
                        <RaisedButton label="Chat" onClick={() => {this.chatClick(session.hash)}} />
                        <RaisedButton label="Banner" onClick={this.chatClick.bind(this, session)} onClick={() => {this.bannerClick(session.hash)}} />
                    </CardActions>

                </Card>
            );
        });
    }

    render() {
        if(!this.props.state.chat.body) return (<div></div>)
        return (
            <Card initiallyExpanded={true}  >
                <CardHeader title="Sessions" showExpandableButton={true} actAsExpander={true} />
                <CardText expandable={true}>
                    {this.designSessions()}
                </CardText>
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