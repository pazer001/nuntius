import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {hideAddAgentDialog, addAgent} from '../../actions/data';
import update from 'react-addons-update';
import _ from 'lodash';
import TextField from 'material-ui/lib/text-field';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import RaisedButton from 'material-ui/lib/raised-button';
import { Modal } from 'react-bootstrap';

class AddAgentDialog extends React.Component {
    constructor() {
        super();
        this.state  =   {
            addAgentDialog: {
                agentLevel: 1,
                deskName: 'EN'
            },
            addAgentDialogFieldsLength: 0
        }
    }

    addAgentName(event) {
        this.state.addAgentDialog.agentName     =   event.target.value;
    }

    addAgentRealName(event) {
        this.state.addAgentDialog.agentRealName     =   event.target.value;
    }

    addAgentEmail(event) {
        this.state.addAgentDialog.agentEmail     =   event.target.value;
    }

    addAgentPassword(event) {
        this.state.addAgentDialog.agentPassword     =   event.target.value;
    }

    addAgentDialogChangeAgentLevel(event, index, value) {
        let data    =   update(this.state, {addAgentDialog: {agentLevel: {$set: value}}});
        this.setState(data)
    }

    addAgentDialogChangeDeskName(event, index, value) {
        let data    =   update(this.state, {addAgentDialog: {deskName: {$set: value}}});
        this.setState(data)
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log(this.props.state.settings.addAgentResult.body.code)
        if(!_.isEqual(this.props.state.settings, nextProps.state.settings)) return true;
        if(!_.isEqual(this.state.addAgentDialog, nextState.addAgentDialog)) return true;
        return false;
    }

    render() {
        return (
            <Modal show={this.props.state.settings.showAddAgentDialog} onHide={() => {this.props.hideAddAgentDialog(this.props.state.settings.showAddAgentDialog)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Agent</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-sm-6">
                            <h4> <span className="label label-default">Agent Name</span></h4>
                        </div>
                        <div className="col-sm-6">
                            <TextField hintText="Agent Name" onChange={(event) => {this.addAgentName(event)}} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <h4> <span className="label label-default">Agent Real Name</span></h4>
                        </div>
                        <div className="col-sm-6">
                            <TextField hintText="Agent Real Name" onChange={(event) => {this.addAgentRealName(event)}} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <h4> <span className="label label-default">Email</span></h4>
                        </div>
                        <div className="col-sm-6">
                            <TextField hintText="Email" onChange={(event) => {this.addAgentEmail(event)}} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <h4> <span className="label label-default">Password</span></h4>
                        </div>
                        <div className="col-sm-6">
                            <TextField hintText="Password" type="password" onChange={(event) => {this.addAgentPassword(event)}} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <h4> <span className="label label-default">Agent Level</span></h4>
                        </div>
                        <div className="col-sm-6">
                            <DropDownMenu value={this.state.addAgentDialog.agentLevel} onChange={(event, index, value) => {this.addAgentDialogChangeAgentLevel(event, index, value)}}>
                                <MenuItem value={1} primaryText="Agent" />
                                <MenuItem value={2} primaryText="Shift Manager" />
                                <MenuItem value={3} primaryText="Super Manager" />
                                <MenuItem value={4} primaryText="Administrator" />
                            </DropDownMenu>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <h4> <span className="label label-default">Desk Name</span></h4>
                        </div>
                        <div className="col-sm-6">
                            <DropDownMenu value={this.state.addAgentDialog.deskName} onChange={(event, index, value) => {this.addAgentDialogChangeDeskName(event, index, value)}}>
                                <MenuItem value={'EN'} primaryText="EN" />
                                <MenuItem value={'RU'} primaryText="RU" />
                                <MenuItem value={'DE'} primaryText="DE" />
                                <MenuItem value={'SE'} primaryText="SE" />
                            </DropDownMenu>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <RaisedButton label="Submit" primary={true} onClick={() => {this.props.addAgent(this.state.addAgentDialog, this.props.state.login.body.agent[0].company_id)}} />
                        </div>
                        <div className="col-sm-6">
                            <h4>{this.props.state.settings.addAgentErrorFieldLength ? <span className="label label-danger">Please fill all fields!</span> : null} </h4>
                            <h4>{this.props.state.settings.addAgentResult && this.props.state.settings.addAgentResult.body.code === 200 && !this.props.state.settings.addAgentErrorFieldLength ? <span className="label label-success">Agent Added Successfully!</span> : null} </h4>
                            <h4>{this.props.state.settings.addAgentResult && this.props.state.settings.addAgentResult.body.code === 400 && !this.props.state.settings.addAgentErrorFieldLength ? <span className="label label-danger">Agent Added Failed!</span> : null} </h4>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {state};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({hideAddAgentDialog, addAgent}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAgentDialog);