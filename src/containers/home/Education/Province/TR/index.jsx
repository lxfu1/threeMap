/*
 * author: yzsexe
 * date: 18/8/16
 * describe: 教育扶贫-省地图-左下echarts图
 */
import React, { Component } from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import { EducationStore } from 'store';
import cls from 'classnames';
import { Select } from 'antd';
import Box from 'components/Box';
import Title from 'components/Title';
import Bar from 'components/echarts/WebRmBar';
import resource from 'resource';
import styles from './style.scss';

const Option = Select.Option;

const CHEARTSOPTION = {
    grid: [
        {
            top: '3%',
            left: 220,
            right: '15%',
            bottom: '3%',
            gridIndex: 0
        },
        {
            top: '3%',
            left: '85%',
            bottom: '3%',
            width: '0%',
            gridIndex: 1
        }
    ],
    YaxisLabel: 220,
    noRank: true
}

@observer
class TRBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            years: []
        }
    }

    componentDidMount() {
        this.initSelect()
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
        EducationStore.changeYears(val, 'province');
    }

    render() {
        const { data = [], boxConfig, boxName, boxClassName } = this.props;

        return (
            <Box
                classNames={cls(styles.container, boxClassName)}
                config={boxConfig}
                warpStyle={{ padding: '0 1rem .5rem' }}
            >
                <Title text={`${boxName}教育扶贫指标得分排行`} />
                <Select
                    value={EducationStore.years}
                    onChange={this.changeYear}
                    className={styles.yearPicker}
                >
                    {this.state.years.map((ite, index) => <Option key={ite + index} value={ite}>{ite}</Option>)}
                </Select>
                <Bar data={data} style={{height: 'calc(100% - 2.75rem)'}} options={CHEARTSOPTION} />
            </Box>
        );
    }
}
export default TRBox;
