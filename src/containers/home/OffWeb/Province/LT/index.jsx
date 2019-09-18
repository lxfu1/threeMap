/*
 * author: yzsexe
 * date: 18/8/16
 * describe: 官网推行-省地图-左上echarts图
 */
import React, { Component } from 'react';
import { observable } from 'mobx';
import Box from 'components/Box';
import Title from 'components/Title';
import Gauge from 'components/echarts/Gauge';
import styles from './style.scss';

class LTBox extends Component {

    ratio = ({ yearRatio, ringRatio }) => {

        return (
            <div className={styles.ratioBox}>
                <div className={styles.ratioTop}>
                    <p>活跃度同比</p>
                    <p>{yearRatio}</p>
                </div>
                <div className={styles.ratioBottom}>
                    <p>活跃度环比</p>
                    <p>{ringRatio}</p>
                </div>
            </div>
        )
    }

    render() {
        const { data, boxName, boxConfig } = this.props;
        let initData = 0;
        let yearRatio = 0;
        let ringRatio = 0;

        if (data) {
            initData = data.current ? Number((data.current / 100).toFixed(4)) : 0;
            yearRatio = data.yearRatio;
            ringRatio = data.ringRatio;
        }
        return (
            <Box
                classNames={styles.container}
                config={boxConfig}
                warpStyle={{ padding: '0 1rem .5rem' }}
            >
                <Title text={`${boxName}官网推行活跃度`} />
                <div className={styles.activeBox} style={{height: 'calc(100% - 2.75rem)'}}>
                    <Gauge data={initData} name={boxName} style={{ width: '63%' }} />
                    {this.ratio({yearRatio, ringRatio})}
                </div>
            </Box>
        );
    }
}

export default LTBox;
