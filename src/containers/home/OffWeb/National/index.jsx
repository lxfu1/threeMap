/*
 *author: yzsexe
 * date: 18/8/8
 * describe: 官网推行-全国地图
 */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import cls from 'classnames';
import moment from 'moment';
import { OffWebStore } from 'store';
import { DatePicker } from 'antd';
import Map from 'components/echarts/Map';
import RT from './RT';
import RM from './RM';
import RB from './RB';
import styles from './style.scss';

const { MonthPicker } = DatePicker;

const SJS = ['北京', '上海', '重庆', '天津']

@inject('OffWebStore')
@observer
class National extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mapName: 'china'
        };
    }

    componentDidMount() {
        OffWebStore.chinaInit();
    }

    clickMap = params => {
        console.log('click', params);
        const { provinceCodeMap } = OffWebStore;
        let name = params.name;

        if (SJS.indexOf(name) !== -1) {
            this.props.history.push(
                `/main/home/offweb/city/${name}/${provinceCodeMap[name]}/${name.replace(/市/, '')}`);
            return;
        }
        this.props.history.push(`/main/home/offweb/prov/${params.name}`);
    }

    monthChange = date => {
        let years = date;

        OffWebStore.changeYears(years, 'china');
    }

    disabledEndDate = (endValue) => {
        const startValue = moment();

        if (!endValue || !startValue) {
            return false;
        }

        return endValue.valueOf() >= startValue.valueOf();
    }

    render() {
        const { mapName } = this.state;

        return (
            <div className={styles.nationalContainer}>
                <div className={styles.l_box}>
                    <MonthPicker
                        className={cls(styles.monthPicker, 'rootPicker')}
                        disabledDate={this.disabledEndDate}
                        defaultValue={OffWebStore.years}
                        format={'YYYY年MM月'}
                        allowClear={false}
                        placeholder={'请选择月份'}
                        onChange={this.monthChange}
                    />
                    <Map
                        mapName={mapName}
                        data={OffWebStore.chinaMapData}
                        clickMap={this.clickMap}
                        visualMap={true}
                    />
                </div>
                <div className={styles.r_box}>
                    <RT data={OffWebStore.chinaRTData} />
                    <RM data={OffWebStore.chinaRMData} />
                    <RB data={OffWebStore.chinaRBData} />
                </div>
            </div>
        );
    }
}
export default National;
