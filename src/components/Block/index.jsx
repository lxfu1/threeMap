/*
 * author: yzsexe
 * date: 18/7/26
 * describe: 数据统计-各echarts容器-高阶组件
 */
import React, { Component } from 'react';
import Title from 'components/BlockTitle';
import styles from './style.scss';

function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
}

const withBlock = (title, style = {}) => {
    return WrappedComponent => {
        return class Block extends Component {
            static displayName = `Block(${getDisplayName(WrappedComponent)})`;
            render() {
                return (
                    <div className={styles.block} style={style}>
                        <div className={styles.warpBox}>
                            <Title title={title} />
                            <WrappedComponent {...this.props} />
                        </div>
                    </div>
                );
            }
        };
    };
};

export default withBlock;
