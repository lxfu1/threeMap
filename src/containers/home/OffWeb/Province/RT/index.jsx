/*
 * author: yzsexe
 * date: 18/8/16
 * describe: 官网推行-省地图-右上echarts图
 */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { OffWebStore } from 'store';
import moment from 'moment';
import Box from 'components/Box';
import Title from 'components/Title';
import SortItem from 'components/SortItem';
import Bar from 'components/echarts/WebRmBar';
import styles from './style.scss';

const CHEARTSOPTION = {
    grid: [
        {
            top: '3%',
            left: 110,
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
    YaxisLabel: 110
}

const sortList = [
    {
        label: '正序',
        value: 'score-desc'
    },
    {
        label: '倒序',
        value: 'score-asc'
    }
];

@observer
class RTBox extends Component {
    constructor(props) {
        super(props);
    }

    handleToggle = (key, value, target) => {
        OffWebStore.changeSort(key, value, target)
    }

    render() {
        const { data, boxName } = this.props;
        const { cityOrderToggle, years, provinceCode } = OffWebStore;

        return (
            <Box
                classNames={styles.container}
                config={{ height: 'calc(100% * .54)' }}
                warpStyle={{ padding: '0 1rem .5rem' }}
            >
                <Title
                    text={`${boxName}官网推行活跃度排行榜`}
                    all={`/main/home/offweb/rankingcity/${moment(years).format('YYYYMM')}/${provinceCode}`}
                    allTooltip={'查看完整榜单'}
                />
                <SortItem
                    classNames={styles.sortBox}
                    data={sortList}
                    current={cityOrderToggle}
                    handleToggle={(ite) => {
                        this.handleToggle('cityOrderToggle', ite, 'province')
                    }}
                />
                <Bar data={data} style={{height: 'calc(100% - 2.75rem)'}} options={CHEARTSOPTION} />
            </Box>
        );
    }
}
export default RTBox;
