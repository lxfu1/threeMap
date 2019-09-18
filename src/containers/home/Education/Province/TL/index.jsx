/*
 * author: yzsexe
 * date: 18/8/16
 * describe: 教育扶贫-省地图-左上echarts图
 */
import React, { Component } from 'react';
import cls from 'classnames';
import Box from 'components/Box';
import Title from 'components/Title';
import Gauge from 'components/echarts/Gauge';
import styles from './style.scss';

class TLBox extends Component {

    ratio = (yearRatio) => {

        return (
            <div className={styles.ratioBox}>
                <div className={styles.ratioTop}>
                    <p>活跃度环比</p>
                    <p>{yearRatio}</p>
                </div>
            </div>
        )
    }

    render() {
        const { data, boxName, boxConfig, boxClassName } = this.props;
        let initData = 0;
        let yearRatio = '0%';

        if (data) {
            initData = data.score ? Number((data.score / 100).toFixed(4)) : 0;
            yearRatio = data.ratio && Number(data.ratio.replace(/%/, '')) > 0 ? `+${data.ratio}` : data.ratio;
        }
        return (
            <Box
                classNames={cls(styles.container, boxClassName)}
                config={boxConfig}
                warpStyle={{ padding: '0 1rem .5rem' }}
            >
                <Title text={`${boxName}官网推行活跃度`} />
                <div className={styles.activeBox} style={{height: 'calc(100% - 2.75rem)'}}>
                    <Gauge data={initData} name={boxName} style={{ width: '63%' }} />
                    {this.ratio(yearRatio)}
                </div>
            </Box>
        );
    }
}

export default TLBox;