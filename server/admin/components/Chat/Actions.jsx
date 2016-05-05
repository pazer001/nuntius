import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import moment from 'moment';
import {getChats, chatClick, bannerClick, showBanners, selectedBannerSessionHash} from '../../actions/data';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import ChatButton from 'material-ui/lib/svg-icons/communication/chat';
import BannerButton from 'material-ui/lib/svg-icons/av/web';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import Avatar from 'material-ui/lib/avatar';
import FaceIcon from 'material-ui/lib/svg-icons/action/face';

class Actions extends React.Component {
    chatClick(sessionHash) {
        this.props.chatClick(sessionHash);
        setTimeout(() => {this.props.getChats(this.props.state.login.body.agent[0].company_id, this.props.state.sessions.chatHashesChoosed)})
    }

    bannerClick(session_hash) {
        this.props.showBanners();
        this.props.selectedBannerSessionHash(session_hash)
    }

    renderActions() {
        let actions     =   this.props.state.chat.body.actions.data,
            actionKey   =   0;
        if(!actions.length) return (<div></div>);
        return (
                <Table className="actions-table" fixedHeader={true}>
                    <TableHeader displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>Action</TableHeaderColumn>
                            <TableHeaderColumn>Action Name</TableHeaderColumn>
                            <TableHeaderColumn>Amount</TableHeaderColumn>
                            <TableHeaderColumn>Extra</TableHeaderColumn>
                            <TableHeaderColumn>User</TableHeaderColumn>
                            <TableHeaderColumn>Brand</TableHeaderColumn>
                            <TableHeaderColumn>Date Time</TableHeaderColumn>
                            <TableHeaderColumn>User IP</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} adjustForCheckbox={false} stripedRows={true} showRowHover={false} preScanRows={false}>
                        {actions.map((action) => {
                            return (
                                <TableRow selectable={false} key={actionKey++}>
                                    <TableRowColumn>
                                        <ChatButton className="pointer" onClick={() => {this.chatClick(action.session_hash)}} />
                                        <BannerButton className="pointer" onClick={() => {this.bannerClick(action.session_hash)}} />
                                    </TableRowColumn>
                                    <TableRowColumn>{action.action_name}</TableRowColumn>
                                    <TableRowColumn>{action.amount}</TableRowColumn>
                                    <TableRowColumn>{action.extra_data}</TableRowColumn>
                                    <TableRowColumn>{action.user_id || 'Guest'}</TableRowColumn>
                                    <TableRowColumn>{this.props.state.brands.body ? <Avatar src={this.props.state.brands.body[action.brand_id].image_url} /> : <FaceIcon />}</TableRowColumn>
                                    <TableRowColumn>{moment(action.timestamp).format('YYYY-MM-DD HH:mm:ss')}</TableRowColumn>
                                    <TableRowColumn>{action.user_ip}</TableRowColumn>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
        )
    }

    shouldComponentUpdate(nextProps) {
        return !_.isEqual(this.props.state.chat.body, nextProps.state.chat.body);
    }

    render() {
        if(!this.props.state.chat.body) return (<div></div>);
        return (
            <Card initiallyExpanded={true}>
                <CardHeader title="Actions" showExpandableButton={true} actAsExpander={true} />+
                <CardText expandable={true}>
                    {this.renderActions()}
                </CardText>
            </Card>
        )
    }
}

function mapStateToProps(state) {
    return {state};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({getChats, chatClick, bannerClick, showBanners, selectedBannerSessionHash}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Actions);

