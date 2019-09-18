/*
 * author: yzsexe
 * date: 18/8/16
 * describe: 右上echarts图
 */
import React, { Component } from 'react';
import Box from 'components/Box';
import Title from 'components/Title';
import Line from 'components/echarts/WebRtLine';
import resource from 'resource';
import styles from './style.scss';

class RTBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { data } = this.props;

        return (
            <Box
                classNames={styles.container}
                config={{ height: 'calc(100% / 3)' }}
                warpStyle={{ padding: '0 1rem .5rem' }}
            >
                <Title text={'实时数据统计'} style={{ position: 'absolute' }} />
                <Line data={data} style={{ height: '100%' }} options={{ gridTop: '30%' }} />
            </Box>
        );
    }
}
export default RTBox;
