/*
 * author: yzsexe
 * date: 18/8/16
 * describe: 官网推行-省地图-右上echarts图
 */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { OffWebStore } from 'store';
import Box from 'components/Box';
import Title from 'components/Title';
import SortItem from 'components/SortItem';
import Bar from 'components/echarts/WebRmBar';
import styles from './style.scss';

const sortList = [
    {
        label: '正序',
        value: 'score-asc'
    },
    {
        label: '倒序',
        value: 'score-desc'
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
        const { cityOrderToggle } = OffWebStore;

        return (
            <Box
                classNames={styles.container}
                config={{ height: 'calc(100% * .54)' }}
                warpStyle={{ padding: '0 1rem .5rem' }}
            >
                <Title text={`${boxName}官网推行活跃度排行榜`} />
                <SortItem
                    classNames={styles.sortBox}
                    data={sortList}
                    current={cityOrderToggle}
                    handleToggle={(ite) => {
                        this.handleToggle('cityOrderToggle', ite, 'province')
                    }}
                />
                <Bar data={data} style={{height: 'calc(100% - 2.75rem)'}} />
            </Box>
        );
    }
}
export default RTBox;
