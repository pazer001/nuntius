import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux'
import AppBar from 'material-ui/lib/app-bar';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';

export default class Layout extends React.Component {
    componentWillMount() {
        if(localStorage.getItem('Login') != 'undefined') {
            this.props.state.login.body = JSON.parse(localStorage.getItem('Login'))
        }
    }

    logout() {
        this.props.state.login     =   false;
        localStorage.removeItem('Login');
        this.setState({});
    }

    renderMenuButton() {
        return (
            <div>
                <RaisedButton  label="Home" />
                {this.props.state.login.body && this.props.state.login.body.code === 200 ? <RaisedButton  onClick={this.logout.bind(this)} label="Logout" /> : <Link to="login" ><RaisedButton  label="login" /></Link>}
                {this.props.state.login.body && this.props.state.login.body.code === 200 ? <Link to="chat" ><RaisedButton  label="Chat" /></Link> : ''}
                {this.props.state.login.body && this.props.state.login.body.code === 200 ? <FlatButton label={this.props.state.login.body.agent[0].name} disabled={true} />  : ''}
            </div>
        )
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <AppBar
                        title={<span>Nuntius</span>}
                        iconElementLeft={<div></div>}
                        iconElementRight={this.renderMenuButton()}
                    />


                </div>
                <div className="row">
                    <div className="col-sm-12">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {state}
}

export default connect(mapStateToProps)(Layout)