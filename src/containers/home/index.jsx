/*
 *author: yzsexe
 * date: 18/8/8
 * describe: 指数中心容器
 */
import React, { Component } from 'react';
import Menu from 'components/SubMenu';
import styles from './style.scss';

const navs = [
    {
        name: '官网推行',
        to: '/main/home/offweb'
    },
    {
        name: '趋势研究',
        to: '/main/home/trendResearch'
    },
    {
        name: '流向监控',
        to: '/main/home/monitor'
    },
    {
        name: '教育扶贫',
        to: '/main/home/education'
    }
];

class Home extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.checkTheme();
    }

    checkTheme = () => {
        let themeId = sessionStorage.getItem('themeID');
        let pathname = this.props.history.location.pathname;

        if (!themeId && pathname === '/main/home') {
            this.props.history.push('/main/home/monitor');
        } else if (pathname === '/main/home') {
            this.props.history.push('/main/home/offweb');
        }
    }

    render() {
        const themeId = sessionStorage.getItem('themeID');

        return (
            <div className={styles.container}>
                <Menu {...this.props} data={themeId ? navs : navs.slice(1)} />
                <div className={styles.subContent}>{this.props.children}</div>
            </div>
        );
    }
}
export default Home;
