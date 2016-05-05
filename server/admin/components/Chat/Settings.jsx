import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showAddAgentDialog, hideAddAgentDialog} from '../../actions/data';
import AddAgentDialog from './AddAgentDialog.jsx';
import RaisedButton from 'material-ui/lib/raised-button';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';



class Settings extends React.Component {
    render() {
        return (
            <Card initiallyExpanded={true}  >
                <CardHeader title="Settings" showExpandableButton={true} actAsExpander={true} />
                <CardText expandable={true}>
                    <RaisedButton label="Add Agent" onClick={() => {this.props.showAddAgentDialog(this.props.state.settings.showAddAgentDialog)}} />
                    <AddAgentDialog />
                </CardText>
            </Card>
        )
    }
}

function mapStateToProps(state) {
    return {state};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({showAddAgentDialog, hideAddAgentDialog}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);