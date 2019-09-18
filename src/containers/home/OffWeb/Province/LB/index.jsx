/*
 * author: yzsexe
 * date: 18/8/16
 * describe: 官网推行-省地图-左下echarts图
 */
import React, { Component } from 'react';
import Box from 'components/Box';
import Title from 'components/Title';
import Table from 'components/MiniTable';
import Bar from 'components/echarts/WebRmBar';
import resource from 'resource';
import styles from './style.scss';

const CHEARTSOPTION = {
    grid: [
        {
            top: '3%',
            left: 150,
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
    YaxisLabel: 150,
    noRank: true
}

class LBBox extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                label: '', key: 'name',
                align: 'left', style: { width: '85%' }
            },
            {
                label: '', key: 'value',
                align: 'left', style: { width: '15%' },
                filter: (value, ite) => {
                    let val;

                    if (ite.feature === 'feature_8' || ite.feature === 'feature_9') {
                        val = ite.value ? '是' : '否'
                    } else {
                        val = ite.value;
                    }
                    return <span>{val}</span>
                }
            }
        ];
    }

    render() {
        const { data = [], boxConfig, boxName } = this.props;

        return (
            <Box
                classNames={styles.container}
                config={boxConfig}
                warpStyle={{ padding: '0 1rem .5rem' }}
            >
                <Title text={`${boxName}官网推行活跃度分项指标`} />
                <Table
                    warpStyle={{ height: 'calc(100% - 2.75rem)', marginTop: '.3rem' }}
                    columns={this.columns}
                    dataSource={data}
                />
                {/* <Bar data={data} style={{height: 'calc(100% - 2.75rem)'}} options={CHEARTSOPTION} /> */}
            </Box>
        );
    }
}
export default LBBox;
