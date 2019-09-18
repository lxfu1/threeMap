import React, { Component } from 'react';
import { OffWebStore } from 'store';
import moment from 'moment';
import style from './style.scss';
import Charts from './subPage/chartspro';
import resource from 'util/resource';
import qs from 'qs'


class Ranking extends Component {
    constructor(props) {
        super(props);
        // let url = this.props.location.pathname;
        let url = this.props.location.pathname;
        let arr = url.substr(url.lastIndexOf('#')+1).split('/');

        this.urYear = arr[5];
        this.urlData = arr[6];
        this.state={
            provence:'',
            years:201801,
            themeId:sessionStorage.getItem('themeID'),
            parentCode:'',
            data:[]
        }
    }

    componentWillMount() {
        this.getData();
    }

    getData = () => {
        resource.get(`/govacademy-server/offweb/rankOfNational?years=${this.urYear}&parentCode=${this.urlData}&themeId=${this.state.themeId}`).then(res => {
            if(res.code===200){
                this.setState({
                    data:res.data
                })
            }

        });
    };

    handleGoBack = () => {
        this.props.history.goBack();
    }
    render() {
        let { data } = this.state;

        return (
            <div className={style.container}>
                <div className={style.content}>
                        <div className={style.back}>
                            <button onClick={ this.handleGoBack} >返回</button>
                        </div>
                    <div className={style.rangings}>
                        <div className={style.left}>
                            <div className={style.switchs}>
                                 <span className={style.government}>省内各政府活跃度排行榜</span>
                            </div>
                            <div className={style.proportion}>
                                <span>省内排名/国内排名</span>
                            </div>
                            {/*<div className={style.charts} style={{ height:data.length * 30+'px'  }}>*/}
                            <div className={style.charts}>
                                <Charts data={data}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Ranking;
