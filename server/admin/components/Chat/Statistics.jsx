import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import {getChatStatistics} from '../../actions/data';
import ReactHighcharts from 'react-highcharts';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import HighChartsTheme from '../../HighChartsTheme'

class Statistics extends React.Component {
    constructor() {
        super();
        this.highchartsDefaultConfig    =   {
            chart: {
                type: 'pie',
                shadow: true
            },
            credit: {
                enabled: false
            },
            exporting: {
                enabled: true
            },
            legend: {
                enabled: true
            }
        }
    }

    componentWillMount() {
        this.props.getChatStatistics(this.props.state.login.body.agent[0].company_id)
        ReactHighcharts.Highcharts.setOptions(HighChartsTheme);
    }

    shouldComponentUpdate(nextProps) {
        if(!_.isEqual(this.props.state.statistics.body, nextProps.state.statistics.body)) return true;
        return false
    }

    renderGetAnsweredChats() {
        const config    =   this.highchartsDefaultConfig;
        config.title    =   {text:'Answered Chats'}
        config.series       =   [{
            name: 'Answered Chats',
            data: [
                {
                    name: 'Answered Chats',
                    y: this.props.state.statistics.body.getAnsweredChats.data.AnsweredChats
                },
                {
                    name: 'Unanswered Chats',
                    y: this.props.state.statistics.body.getAnsweredChats.data.UnansweredChats
                }
            ]
        }]

        return (<ReactHighcharts config = {config} theme = {ReactHighcharts.dark}></ReactHighcharts>);
    }
    
    render() {
        if(!this.props.state.statistics.body) return (<div></div>)

        return (
            <Card initiallyExpanded={true}  >
                <CardHeader title="Statistics" showExpandableButton={true} actAsExpander={true} />
                <CardText expandable={true}>
                    <Card className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12">{this.renderGetAnsweredChats()}</Card>
                    <Card className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12">{this.renderGetAnsweredChats()}</Card>
                    <Card className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12">{this.renderGetAnsweredChats()}</Card>
                    <Card className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12">{this.renderGetAnsweredChats()}</Card>
                </CardText>
            </Card>



        )
    }
}

function mapStateToProps(state) {
    return {state};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({getChatStatistics}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);