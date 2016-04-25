import React from 'react';
import {connect} from 'react-redux';
import Loader from './Loader.jsx';
import {login} from '../actions/data';
import {bindActionCreators} from 'redux';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';


class Login extends React.Component {
    constructor() {
        super()
        this.data   =   {
            login: {
                email: null,
                password: null,
                companyId: null
            },
            loader: false
        }
        this.state  =   {
            loader: false
        }
    }

    renderBrands() {
        this.data.login.companyId   =   this.props.state.brands[0].id;
        return this.props.state.brands.map((brand) => {
            return (<option  value={brand.id} key={brand.id}>{brand.name}</option>)
        });
    }

    login() {
        this.setState({loader: true});
        this.props.login(this.data.login)
    }

    render() {
        return (
            <div className="container-fluid">
                <h1>Login</h1>
                <div className="row">
                    <form className="col s12">
                        <div className="row">
                            <TextField hintText="Email" onChange={(event) => this.data.login.email = event.target.value} fullWidth={true} />
                        </div>
                        <div className="row">
                            <TextField hintText="Password" type="password" onChange={(event) => this.data.login.password = event.target.value} fullWidth={true} />
                        </div>
                        <div className="row">
                            <select onChange={(event) => this.data.login.companyId = event.target.value} fullWidth={true} className="form-control form-control-lg" >
                                {this.renderBrands()}
                            </select>
                        </div>
                        <div className="row">
                            <div><RaisedButton onClick={() => {this.login()}} primary={true} label="login" /></div>
                            <div className="col-md-3">
                                {this.state.loader === true && !this.props.state.login.data ? <Loader /> : (this.props.state.login.data && this.props.state.login.data.code === 400) ? <div className="chip"> Wrong Username/Password/Company.</div> : ''}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {state}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({login}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)