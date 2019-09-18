/*
 * author: yzsexe
 * date: 18/8/16
 * describe: 右中echarts图
 */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { EducationStore } from 'store';
import Box from 'components/Box';
import Title from 'components/Title';
import SortItem from 'components/SortItem';
import Bar from 'components/echarts/WebRmBar';
import styles from './style.scss';

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

@observer
class RMBox extends Component {
    constructor(props) {
        super(props);
    }

    handleToggle = (key, value, target) => {
        EducationStore.changeSort(key, value, target)
    }

    render() {
        const { data } = this.props;
        const { provOrderToggle } = EducationStore;

        console.log(data.length);

        return (
            <Box
                classNames={styles.container}
                config={{ height: 'calc(100% / 3)' }}
                warpStyle={{ padding: '0 1rem .5rem' }}
            >
                <Title text={'教育扶贫政府活跃度排行榜'} />
                <div className={styles.sortBox}>
                    <SortItem
                        data={sortList2}
                        current={provOrderToggle}
                        handleToggle={(ite) => {
                            this.handleToggle('provOrderToggle', ite, 'china')
                        }}
                    />
                </div>
                <div className={styles.echartWarp}>
                    <Bar data={data} style={{ height: `${data.length * 3.2}rem` }} />
                </div>
                {/* <Bar data={data} style={{height: 'calc(100% - 2.75rem)'}} /> */}
            </Box>
        );
    }
}
export default RMBox;
