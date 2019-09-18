/*
 * author: yzsexe
 * date: 18/8/16
 * describe: 教育扶贫-省地图-下echarts图
 */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { EducationStore } from 'store';
import cls from 'classnames';
import { Select } from 'antd';
import Box from 'components/Box';
import Title from 'components/Title';
import Line from 'components/echarts/EducationTrLine';
import styles from './style.scss';

const Option = Select.Option;

const TYPE = [
    { label: '类别', value: '类别' },
    {label: '指标', value: '指标'}
]

const subType = {
    '类别': [
        { label: '义务教育', value: '义务教育' },
        { label: '高中教育', value: '高中教育' },
        {label: '农村教育花费', value: '农村教育花费'}
    ],
    '指标': [
        { label: '学校数量增长率', value: '学校数量增长率' },
        { label: '专任教师数量增长率', value: '专任教师数量增长率' },
        {label: '入学增长率', value: '入学增长率'}
    ]
}

@observer
class BCBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '类别'
        }
    }

    changeType = ite => {
        this.setState({
            type: ite
        }, () => {
            EducationStore.changeType(ite, subType[ite][0].value)
        })
    }
    changeSubType = ite => {
        const { type } = this.state;

        EducationStore.changeType(type, ite)
    }

    render() {
        const { type } = this.state;
        const { data, boxConfig, boxClassName } = this.props;
        let initData = [];
        let years = [];

        if (data) {
            initData = data.data;
            years = data.years;
        }

        return (
            <Box
                classNames={cls(styles.container, boxClassName)}
                config={boxConfig}
                warpStyle={{ padding: '0 1rem .5rem' }}
            >
                <Title text={'教育扶贫趋势分析'} />
                <div className={styles.selectWarp}>
                    <Select
                        defaultValue={EducationStore.type}
                        onChange={this.changeType}
                        style={{ width: '10rem', marginRight: '.5rem' }}
                    >
                        {
                            TYPE.map((ite, index) =>
                                <Option key={ite.value + index} value={ite.value}>{ite.label}</Option>
                            )
                        }
                    </Select>
                    <Select
                        value={EducationStore.subType}
                        onChange={this.changeSubType}
                        style={{ width: '10rem' }}
                    >
                        {
                            subType[type].map((ite, index) =>
                                <Option key={ite.value + index} value={ite.value}>{ite.label}</Option>
                            )
                        }
                    </Select>
                </div>
                <Line data={initData} years={years} style={{height: 'calc(100% - 2.75rem)'}} />
            </Box>
        );
    }
}

export default BCBox;
