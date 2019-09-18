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
import LT from './LT';
import LB from './LB';
import RT from './RT';
import RB from './RB';
import styles from './style.scss';

const { MonthPicker } = DatePicker;

@inject('OffWebStore')
@observer
class Province extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     mapName: 'china',
        //     stack: [{ name: '贵州', code: 520000000000 }]
        // };
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        const { name, year } = this.props.match.params;

        OffWebStore.linkYears(name, year, 'province');
    }

    clickMap = params => {
        const { name } = this.props.match.params;
        const { province, provinceCode } = OffWebStore;

        this.props.history.push(`/main/home/offweb/city/${province}/${provinceCode}/${params.name.replace(/市/, '')}`);
    }

    back = () => {
        this.props.history.push(`/main/home/offweb/state`);
    }

    monthChange = date => {
        let years = date;

        OffWebStore.changeYears(years, 'province');
    }

    disabledEndDate = (endValue) => {
        const startValue = moment();

        if (!endValue || !startValue) {
            return false;
        }

        return endValue.valueOf() >= startValue.valueOf();
    }

    componentWillUnmount() {
        OffWebStore.clearProv();
    }

    render() {
        const { name } = this.props.match.params;
        let boxName = `${name}省`;

        return (
            <div className={styles.provinceContainer}>
                <div className={styles.l_box}>
                    <LT boxName={boxName} data={OffWebStore.provLTData} boxConfig={{ height: 'calc(100% * .3)' }} />
                    <LB boxName={boxName} data={OffWebStore.provLBData} boxConfig={{ height: 'calc(100% * .7)' }} />
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
                    <Map mapName={name} data={OffWebStore.provMapData} clickMap={this.clickMap} visualMap={true} />
                </div>
                <div className={styles.r_box}>
                    <RT boxName={boxName} data={OffWebStore.provRTData} />
                    {/* <RB /> */}
                    <RB data={OffWebStore.provRBData} boxConfig={{ height: 'calc(100% * .46)' }} />
                </div>
            </div>
        );
    }
}
export default Province;
