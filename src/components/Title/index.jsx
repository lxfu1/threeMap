// 上帝保佑,永无bug

import React, { Component } from 'react';
import { Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import cls from 'classnames';
import styles from './style.scss';

export default class Title extends Component {
    render() {
        const { text, style={}, classNames, all, url, allTooltip } = this.props;

        return (
            <div style={style} className={cls(styles.wrap, classNames)}>
                <h3>
                    {text}
                    {all && allTooltip ?
                        <Tooltip
                            title={allTooltip}
                            placement="bottomLeft"
                        >
                            <Link to={all} className={styles.all}>
                            <img src={require('./images/arrow.png')} />
                            </Link>
                        </Tooltip> :
                        all && <Link to={all} className={styles.all}>
                            <img src={require('./images/arrow.png')} />
                        </Link>
                    }
                </h3>
                {url &&
                    <Link to={url} target="_blank" className={styles.more}>
                    更多
                </Link>
                }
            </div>
        );
    }
}
