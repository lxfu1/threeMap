/*
 *author: yzsexe
 * date: 18/8/8
 * describe: 官网推行-容器
 */
import React, { Component } from 'react';
import styles from './style.scss';

class OffWeb extends Component {
    render() {
        return <div className={styles.container}>{this.props.children}</div>;
    }
}
export default OffWeb;
