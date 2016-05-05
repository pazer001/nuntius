import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setBrands} from '../../actions/data';
import Chats from './Chats.jsx';
import Banners from './Banners.jsx';
import Actions from './Actions.jsx';
import Sessions from './Sessions.jsx';
import Settings from './Settings.jsx';
import Statistics from './Statistics.jsx';


import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';


class Index extends React.Component {
    componentDidMount() {
        if(!this.props.state.login.body) return;
        let companyId   =   this.props.state.login.body.agent[0].company_id;
        this.props.setBrands(companyId);
    }

    render() {
        return (
            <Tabs>
                <Tab label="Live Chats" >
                    <Sessions />
                    <Banners />
                    <Chats />
                </Tab>
                <Tab label="Live Actions" >
                    <Actions />
                </Tab>
                <Tab label="Statistics" >
                    <Statistics />
                </Tab>
                <Tab label="Settings" >
                    <Settings />
                </Tab>
            </Tabs>
        )
    }
}

function mapStateToProps(state) {
    return {state}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({setBrands}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)