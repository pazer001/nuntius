import React from 'react';
import {connect} from 'react-redux';
import {getBanners, hideBanners} from '../actions/data';
import {bindActionCreators} from 'redux';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import ajax from 'superagent';
import appConfig from '../../config'
import RaisedButton from 'material-ui/lib/raised-button';
import Success from 'material-ui/lib/svg-icons/action/thumb-up';
import Failed from 'material-ui/lib/svg-icons/action/thumb-down';
import Dialog from 'material-ui/lib/dialog';

class Banners extends React.Component {
    constructor() {
        super();
        this.state  =   {
            selectedBannerData: false,
            selectedBannerId: false,
            sendBannerSuccess: false
        }
    }

    componentWillMount() {
        this.props.getBanners(this.props.state.login.data.agent[0].company_id);
    }

    closePopup() {
        this.props.hideBanners();
    }

    changeBanner(event) {
        this.state.selectedBannerData   =   this.props.state.banners.bannersData.body.data[event.target.value].banner_data;
        this.state.selectedBannerId     =   event.target.value;
        this.state.sendBannerSuccess    =   false;
        this.setState({})
    }

    sendBanner(bannerId, sessionHash, companyId) {
        if(!bannerId || !sessionHash || !companyId) return;
        ajax.post(`${appConfig.URL}/banners/sendBanner/`, {
            bannerId, sessionHash, companyId
        })
            .end((err, data) => {
                this.setState({sendBannerSuccess: data.body.code})
            })
    }

    bannersPopup() {
        if(!this.props.state.banners.showBanners || !this.props.state.banners.bannersData) return (<div></div>);
        let banners =   this.props.state.banners.bannersData.body.data,
            closeSVGIcon    =   '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 294.843 294.843" style="enable-background:new 0 0 294.843 294.843;" xml:space="preserve" width="512px" height="512px"> <g> <path d="M147.421,0C66.133,0,0,66.133,0,147.421s66.133,147.421,147.421,147.421c38.287,0,74.567-14.609,102.159-41.136 c2.389-2.296,2.464-6.095,0.167-8.483c-2.295-2.388-6.093-2.464-8.483-0.167c-25.345,24.367-58.672,37.786-93.842,37.786 C72.75,282.843,12,222.093,12,147.421S72.75,12,147.421,12s135.421,60.75,135.421,135.421c0,16.842-3.052,33.273-9.071,48.835 c-1.195,3.091,0.341,6.565,3.432,7.761c3.092,1.193,6.565-0.341,7.761-3.432c6.555-16.949,9.879-34.836,9.879-53.165 C294.843,66.133,228.71,0,147.421,0z" fill="#006DF0"/> <path d="M167.619,160.134c-2.37-2.319-6.168-2.277-8.485,0.09c-2.318,2.368-2.277,6.167,0.09,8.485l47.236,46.236 c1.168,1.143,2.683,1.712,4.197,1.712c1.557,0,3.113-0.603,4.288-1.803c2.318-2.368,2.277-6.167-0.09-8.485L167.619,160.134z" fill="#006DF0"/> <path d="M125.178,133.663c1.171,1.171,2.707,1.757,4.243,1.757s3.071-0.586,4.243-1.757c2.343-2.343,2.343-6.142,0-8.485 L88.428,79.942c-2.343-2.343-6.143-2.343-8.485,0c-2.343,2.343-2.343,6.142,0,8.485L125.178,133.663z" fill="#006DF0"/> <path d="M214.9,79.942c-2.343-2.343-6.143-2.343-8.485,0L79.942,206.415c-2.343,2.343-2.343,6.142,0,8.485 c1.171,1.171,2.707,1.757,4.243,1.757s3.071-0.586,4.243-1.757L214.9,88.428C217.243,86.084,217.243,82.286,214.9,79.942z" fill="#006DF0"/> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg>',
            bannersKeys =   Object.keys(banners),
            firstBanner =   banners[bannersKeys[0]].banner_data;
        this.state.selectedBannerId     =   this.state.selectedBannerId || banners[bannersKeys[0]].id;
        
        return  (
            <Dialog open={true} onRequestClose={this.closePopup.bind(this)}>
                    <button className="blue-grey darken-4" id="closeBannersDialog" onClick={this.closePopup.bind(this)} dangerouslySetInnerHTML={{__html: closeSVGIcon}}></button>
                    <div className="row">
                        <div className="col-sm-8">
                            <select onChange={this.changeBanner.bind(this)} className="form-control">
                                {banners.map((banner) => {
                                    return (<option value={banner.id} key={banner.id}>{banner.name}</option>);
                                })}
                            </select>
                        </div>
                        <div className="col-sm-3">
                            <RaisedButton primary={true} label="Choose" onClick={() => {this.sendBanner(this.state.selectedBannerId, this.props.state.banners.selectedBannerSessionHash, this.props.state.login.data.agent[0].company_id)}} />
                        </div>
                        <div className="col-sm-1">
                            {
                                (()  =>  {
                                    if(!this.state.sendBannerSuccess) {
                                        return <div></div>
                                    } else if(this.state.sendBannerSuccess === 200) {
                                        return <Success />
                                    } else {
                                        return <Failed />
                                    }
                                })()
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="card-panel teal" dangerouslySetInnerHTML={{__html: this.state.selectedBannerData || firstBanner}}></div>
                    </div>
            </Dialog>
        )

    }

    render() {
        return this.props.state.banners.showBanners ? this.bannersPopup() : (<div></div>);
    }
}

function mapStateToProps(state) {
    return {state};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({getBanners, hideBanners}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Banners);