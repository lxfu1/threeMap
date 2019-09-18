/*
 * author: yzsexe
 * date: 18/8/16
 * describe: 右中echarts图
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { OffWebStore } from 'store';
import moment from 'moment';
import Box from 'components/Box';
import Title from 'components/Title';
import SortItem from 'components/SortItem';
import Bar from 'components/echarts/WebRmBar';
import styles from './style.scss';

const sortList1 = [
    {
        label: '省份',
        value: '0'
    },
    {
        label: '城市',
        value: '1'
    }
];

const sortList2 = [
    {
        label: '正序',
        value: 'score-desc'
    },
    {
        label: '倒序',
        value: 'score-asc'
    }
];

@withRouter
@observer
class RMBox extends Component {
    constructor(props) {
        super(props);
    }

    handleToggle = (key, value, target) => {
        OffWebStore.changeSort(key, value, target)
    }

    render() {
        const { data } = this.props;
        const { proCityToggle, provOrderToggle, years } = OffWebStore;

        return (
            <Box
                classNames={styles.container}
                config={{ height: 'calc(100% / 3)' }}
                warpStyle={{ padding: '0 1rem .5rem' }}
            >
                <Title
                    text={'政府活跃度排行榜'}
                    all={`/main/home/offweb/rankingpro/${moment(years).format('YYYYMM')}`}
                    allTooltip={'查看完整榜单'}
                />
                <div className={styles.sortBox}>
                    <SortItem
                        data={sortList1}
                        current={proCityToggle}
                        handleToggle={(ite) => {
                            this.handleToggle('proCityToggle', ite, 'china')
                        }}
                        style={{ marginRight: '1rem' }}
                    />
                    <SortItem
                        data={sortList2}
                        current={provOrderToggle}
                        handleToggle={(ite) => {
                            this.handleToggle('provOrderToggle', ite, 'china')
                        }}
                    />
                </div>
                <Bar data={data} style={{height: 'calc(100% - 2.75rem)'}} />
            </Box>
        );
    }
}
export default RMBox;
