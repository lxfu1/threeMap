/*
 *author: yzsexe
 * date: 18/8/8
 * describe: 官网推行-全国地图
 */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import { EducationStore } from 'store';
import { Select } from 'antd';
import Map from 'components/echarts/Map';
import RT from './RT';
import RM from './RM';
import RB from './RB';
import styles from './style.scss';

const Option = Select.Option;

@observer
class National extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mapName: 'china',
            years: []
        };
    }

    componentDidMount() {
        this.initSelect()
        EducationStore.chinaInit();
    }

    initSelect = () => {
        let current = Number(moment().format('YYYY'));
        let length = current - 1990 + 1;
        let arr = [];

        for (let i = 0; i < length; i++) {
            arr.push(1990 + i)
        }
        this.setState({
            years: arr.reverse()
        })
    }

    changeYear = val => {
        EducationStore.changeYears(val, 'china');
    }

    clickMap = params => {
        console.log('click', params);
        this.props.history.push(`/main/home/education/prov/${params.name}`);
    }

    render() {
        const { mapName } = this.state;

        return (
            <div className={styles.nationalContainer}>
                <div className={styles.l_box}>
                <Select
                    value={EducationStore.years}
                    onChange={this.changeYear}
                    className={styles.yearPicker}
                >
                    {this.state.years.map((ite, index) => <Option key={ite + index} value={ite}>{ite}</Option>)}
                </Select>
                    <Map
                        mapName={mapName}
                        data={EducationStore.chinaMapData}
                        clickMap={this.clickMap}
                        visualMap={true}
                    />
                </div>
                <div className={styles.r_box}>
                    <RT data={EducationStore.chinaRTData} />
                    <RM data={EducationStore.chinaRMData} />
                    <RB data={EducationStore.chinaRBData} />
                </div>
            </div>
        );
    }
}
export default National;
