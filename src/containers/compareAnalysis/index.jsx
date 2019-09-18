import React, { Component } from 'react';
import Menu from 'components/SubMenu';
import styles from './style.scss';

const sideMenu = [
    {
        name: '专题分析',
        to: '/main/compare/thematic'
    },
    {
        name: '相似分析',
        to: '/main/compare/similarity'
    },
    {
        name: '政策溯源',
        to: '/main/compare/trace'
    },
    // {
    //     name: '政策图谱',
    //     to: '/main/compare/policyGraph'
    // }
];

class Compare extends Component {
    render() {
        return (
            <div className={styles.container}>
                <Menu {...this.props} data={sideMenu} />
                <div className={styles.subContent}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Compare;
