/*
 * author: yzsexe
 * date: 18/7/26
 * describe: 数据统计-各echarts容器-标题组件
 */
import React, { Component } from 'react';
import styles from './style.scss';

class BlockTitle extends Component {
    render() {
        return (
            <div className={styles.blockTitle}>
                <img src={require('../../static/images/title-icon.png')} />
                {this.props.title}
            </div>
        );
    }
}

export default BlockTitle;
