/*
 * author: yzsexe
 * date: 18/8/16
 * describe: 官网推行-省地图-右下echarts图
 */
import React, { Component } from 'react';
import Box from 'components/Box';
import Title from 'components/Title';
import Bar from 'components/echarts/WebRbBar';
import resource from 'resource';
import styles from './style.scss';

class RBBox extends Component {

    render() {
        const { data, province, boxConfig } = this.props;

        return (
            <Box
                classNames={styles.container}
                config={boxConfig}
                warpStyle={{ padding: '0 1rem .5rem' }}
            >
                <Title text={'发文频数统计'} />
                <Bar data={data} style={{height: 'calc(100% - 2.75rem)'}} />
            </Box>
        );
    }
}

export default RBBox;
