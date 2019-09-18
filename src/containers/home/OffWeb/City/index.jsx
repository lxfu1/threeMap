/*
 *author: yzsexe
 * date: 18/8/8
 * describe: 官网推行-省地图
 */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { DatePicker } from 'antd';
import cls from 'classnames';
import moment from 'moment';
import { OffWebStore } from 'store';
import Map from 'components/echarts/Map';
import LT from '../Province/LT';
import RBox from '../Province/LB';
import LB from '../Province/RB';
import styles from './style.scss';

const SJS = ['北京', '上海', '重庆', '天津']
const { MonthPicker } = DatePicker;

@inject('OffWebStore')
@observer
class City extends Component {
    constructor(props) {
        super(props);
        this.mapType = 'city';
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        const { name, year, code } = this.props.match.params;

        OffWebStore.linkYears(name, year, 'city', code);
    }

    clickMap = params => {
        console.log('click', params);
    }

    back = () => {
        const { prov } = this.props.match.params;

        if (SJS.indexOf(prov) !== -1) {
            this.props.history.push('/main/home/offweb/state');
            return;
        }
        this.props.history.push(`/main/home/offweb/prov/${prov}`);
    }

    monthChange = date => {
        let years = date;

        OffWebStore.changeYears(years, 'city');
    }

    disabledEndDate = (endValue) => {
        const startValue = moment();

        if (!endValue || !startValue) {
            return false;
        }

        return endValue.valueOf() >= startValue.valueOf();
    }

    componentWillUnmount() {
        OffWebStore.clearCity();
    }

    render() {
        const { prov, name } = this.props.match.params;
        let boxName = `${name}市`;

        return (
            <div className={styles.provinceContainer}>
                <div className={styles.l_box}>
                    <LT
                        data={OffWebStore.cityLTData}
                        boxName={boxName}
                        boxConfig={{ height: 'calc(100% * .33)' }}
                    />
                    <LB
                        data={OffWebStore.cityLBData}
                        boxConfig={{ height: 'calc(100% * .66)', marginTop: 'calc(100% * .01)' }}
                    />
                </div>
                <div className={styles.m_box}>
                    <img className={styles.back}
                        src={require('../../image/back.png')}
                        onClick={this.back}
                    />
                    <MonthPicker
                        className={cls(styles.monthPicker, 'rootPicker')}
                        disabledDate={this.disabledEndDate}
                        value={OffWebStore.years}
                        format={'YYYY年MM月'}
                        allowClear={false}
                        placeholder={'请选择月份'}
                        onChange={this.monthChange}
                    />
                    <Map
                        mapName={name}
                        prov={prov}
                        data={OffWebStore.cityMapData}
                        clickMap={this.clickMap}
                        visualMap={true}
                     />
                </div>
                <div className={styles.r_box}>
                    <RBox boxName={boxName} data={OffWebStore.cityRData} boxConfig={{ height: '100%' }} />
                </div>
            </div>
        );
    }
}
export default City;
