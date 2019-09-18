import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { OffWebStore } from 'store';
import moment from 'moment';
import style from './style.scss';
import ChartsDown from './subPage/chartsdown';
import ChartsUp from './subPage/chartsup';
import resource from 'util/resource';
import qs from 'qs'

// const themeid = sessionStorage.getItem('themeID');

@observer
class Ranking extends Component {
    constructor(props) {
        super(props);
        // let url = this.props.location.pathname
        let url = this.props.location.pathname;
        let arr = url.substr(url.lastIndexOf('#')+1).split('/');

        this.urlData = arr[5];
        this.state = {
            provence: ['省份', '城市'],
            currentIndex: 0,
            reverseIndex: 0,
            datadesc:[],
            dataasc:[],
            years:201103,
            typedesc:0,
            typeasc:0,
            sortasc:'score-asc',
            sortdesc:'score-desc',
            themeId:sessionStorage.getItem('themeID'),
            parentCode: '',
            charsHeight: 'calc(100vh - 5.625rem - 4.6rem - 1.625rem)',
            lSortChange: '省份'
        };
    }

    componentWillMount() {
        this.getDataDesc();
        this.getDatAasc();
    }

    getReverseData = index => {

        this.setState({
            reverseIndex: index,
            typedesc:index === 0 ? 0 : 1
        },this.getDataDesc);
    };

    getProvinceData= (index, ite) => {
        this.setState({
            currentIndex: index,
            typeasc: index === 0 ? 0 : 1,
            lSortChange: ite
        },this.getDatAasc);
    };

    getDataDesc = () => {
        const { years } = OffWebStore;

        resource.get(`/govacademy-server/offweb/getActiveIndex?years=${this.urlData}&type=${this.state.typedesc}&sort=${this.state.sortdesc}&themeId=${this.state.themeId}&parentCode=${this.state.parentCode}`).then(res => {
            if(res.code===200){
                this.setState({
                    datadesc:res.data
                })
            }

        });
    };

    getDatAasc = () => {
        const { years } = OffWebStore;

        resource.get(`/govacademy-server/offweb/getActiveIndex?years=${this.urlData}&type=${this.state.typeasc}&sort=${this.state.sortasc}&themeId=${this.state.themeId}&parentCode=${this.state.parentCode}`).then(res => {
            if(res.code===200){
                this.setState({
                    dataasc:res.data
                })
            }

        });
    };

    handleGoBack = () => {
        this.props.history.goBack();
    }

    render() {
        let { provence, dataasc, datadesc, charsHeight, typeasc, typedesc, lSortChange } = this.state;
        
        return (
            <div className={style.container}>
                <div className={style.content}>
                    <div className={style.back}>
                        <button onClick={ this.handleGoBack} >返回</button>
                    </div>
                    <div className={style.titles}>
                        <div className={style.switchs}>
                            <span className={style.government}>政府活跃度排行榜(正序)</span>
                            <span className={style.region}>
                                    {provence.map((item, index) => {
                                        return (
                                            <span
                                                key={index}
                                                onClick={() => this.getProvinceData(index, item)}
                                                style={{
                                                    background: this.state.currentIndex === index ? '#03abff' : '',
                                                    color: this.state.currentIndex === index ? '#000' : ''
                                                }}
                                            >
                                                {item}
                                            </span>
                                        );
                                    })}
                                </span>
                        </div>
                        <div className={style.switchs}>
                            <span className={style.government}>政府活跃度排行榜(倒序)</span>
                            <span className={style.region}>
                                    {provence.map((item, index) => {
                                        return (
                                            <span
                                                key={index}
                                                onClick={() => this.getReverseData(index)}
                                                style={{
                                                    background: this.state.reverseIndex === index ? '#03abff' : '',
                                                    color: this.state.reverseIndex === index ? '#000' : ''
                                                }}
                                            >
                                                {item}
                                            </span>
                                        );
                                    })}
                                </span>
                        </div>
                    </div>
                    <div className={style.rangings}>
                        <div className={style.left}>

                            <div className={style.charts} style={{ height: !typeasc ? charsHeight : dataasc.length * 30+'px' }}>
                                <ChartsUp dataasc={dataasc.reverse() } sortChange={lSortChange} />
                            </div>
                        </div>
                        <div className={style.right}>

                            <div className={style.charts} style={{ height: !typedesc ? charsHeight :datadesc.length * 30+'px' }}>
                                <ChartsDown datadesc={datadesc.reverse()}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Ranking;
