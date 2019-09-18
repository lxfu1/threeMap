/*
 *author: yzsexe
 * date: 18/8/24
 * describe: 官网推行 省事、正序倒序切换
 */
import React, { Component } from 'react';
import cls from 'classnames';
import styles from './style.scss';

class SortItem extends Component {

    handleToggle = val =>{
        const { handleToggle } = this.props;

        if(handleToggle) {
            handleToggle(val);
        }
    }

    render() {
        const { data, current, classNames, style={} } = this.props;

        return (
            <div className={cls(styles.root, classNames)} style={style}>
                {
                    data.map((ite, index) =>
                        <span
                            key={`${index}${ite.label || ite.value}`}
                            className={cls(
                                styles.sortIte,
                                styles[current === ite.value ? 'active': '' ]
                            )}
                            onClick={() => {
                                this.handleToggle(ite.value)
                            }}
                        >
                        {ite.label}
                        </span>
                    )
                }
            </div>
        )
    }
}

export default SortItem;
