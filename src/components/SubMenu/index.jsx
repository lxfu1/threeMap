/*
 *author: yzsexe
 * date: 18/8/8
 * describe: 二级导航菜单组件
 */
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import cls from 'classnames';
import styles from './style.scss';

const MENU = [
    {
        name: '官网推行',
        to: '/main/home/1'
    },
    {
        name: '趋势研究',
        to: '/main/home/2'
    },
    {
        name: '流向监控',
        to: '/main/home/3'
    },
    {
        name: '舆情中心',
        to: '/main/home/4'
    }
];

class SubMenu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { data, classNames, style = {} } = this.props;

        return (
            <div className={cls(styles.root, classNames)} style={style}>
                {data &&
                    data.map((ite, index) =>
                        <NavLink
                            key={ite.to + index}
                            to={ite.to}
                            className={styles.subItem}
                            activeClassName={styles.activeItem}
                        >
                            {ite.name}
                        </NavLink>
                    )}
            </div>
        );
    }
}

export default SubMenu;
