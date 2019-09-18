import React, { Component } from 'react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { message, Modal } from 'antd';
import searchImg from 'static/images/search.png';
import resource from 'resource';
import { convertQueryString } from 'utils';
import API from 'api';
import { TOKEN, USER, TOCENTYPE, REFRESHTOKEN } from 'constants/storage';
import styles from './style.scss';

const confirm = Modal.confirm;

const NavItem = ({ name, to }) => {
    return (
        <NavLink to={to} className={styles.navItem} activeClassName={styles.navItemActive} key={name + to}>
            {name}
        </NavLink>
    );
};

const navs = [
    {
        key: 'home',
        name: '指数中心',
        to: '/main/home'
    },
    {
        key: 'info',
        name: '信息库',
        to: '/main/info'
    },
    {
        key: 'compare',
        name: '对比分析',
        to: '/main/compare'
    },
    {
        key: 'user',
        name: '个人中心',
        to: '/main/personal'
    }
];

class Header extends Component {
    constructor(props) {
        super(props);
        try {
            this.token = CK.getCookie(TOKEN);
        } catch (e) {
            this.token = '';
        }
        if (this.token) {
            let data = this.token.split('.');

            // 此处报错
            // this.result = JSON.parse(Base64.decode(data[1]));
        }
        this.state = {
            navs: navs,
            theme: '',
            themId: '',
            keyword: sessionStorage.getItem('themeName') || ''
        };
    }

    // 根据用户权限配置 NavBar
    componentWillMount() {
        this.refreshNav();
        // if( sessionStorage.getItem(USER) ){
        //   const menus = JSON.parse(sessionStorage.getItem(USER)).menus;
        //   let newNavs = [];
        //   for ( let i = 0; i < navs.length; i++ ){
        //     if( menus.indexOf(navs[i].key) !== -1 ){
        //       newNavs.push(navs[i])
        //     }else if( navs[i].subNav && (navs[i].subNav.filter(val => menus.indexOf(val) !== -1)).length > 0 ){
        //       if( newNavs.indexOf(navs[i]) === -1 ) newNavs.push(navs[i]);
        //     }
        //   }
        //   this.setState({
        //     navs: newNavs
        //   }, () => {
        //     let targetUrl = navsMap[this.state.navs[0].key];
        //     if( targetUrl !== '/main'){
        //       this.props.history.push(targetUrl);
        //     }
        //   })
        // }
    }

    componentWillReceiveProps(nextProps) {
        this.refreshThemeName();
        this.refreshNav();
    }

    refreshThemeName = () => {
        this.setState({
            keyword: sessionStorage.getItem('themeName')
        });
    };

    refreshNav = () => {
        if (this.props.history.location.pathname === '/main/wordRecord') {
            this.setState({
                navs: []
            });
        } else {
            this.setState({
                navs: navs
            });
        }
    };

    searchKeyWords = () => {
        const { keyword } = this.state;

        if (!keyword) {
            message.info('请输入要搜索的关键词');
            return;
        }

        resource.get(API.keyWords.getKeyWords, { keyword: keyword }).then(res => {
            if (res.code === 200) {
                const list = res.data.list;

                if (list.length > 0) {
                    //搜索到结果，有主题
                    this.toTheme(list[0]);
                } else {
                    message.info('无相关主题');
                }
            } else {
                message.info(res.message);
            }
        });
    };

    //跳转到主题页面
    toTheme = info => {
        sessionStorage.setItem('themeID', info.themeId);
        sessionStorage.setItem('themeName', info.theme);
        sessionStorage.setItem('keyword', info.keyword);
        sessionStorage.setItem('keywordId', info.id);
        this.props.history.push('/main/home');
    };

    keyDownListener = event => {
        let code = event.keyCode || event.which || event.charCode;

        if (code === 13) {
            this.searchKeyWords();
        }
    };

    logout = () => {
        let _this = this;

        confirm({
            title: '你确定退出吗？',
            content: '',
            onOk() {
                CK.setCookie(REFRESHTOKEN, null, -1); //设置过期时间0
                CK.setCookie(TOKEN, null, -1); //设置过期时间0
                _this.props.history.push('/login');
            },
            onCancel() {

            },
        });
    };

    render() {
        const userInfo = JSON.parse(CK.getCookie('user'));
        const userName = userInfo && userInfo.userinfo ? userInfo.userinfo.username : '-';
        const { keyword } = this.state;

        return (
            <div className={styles.container}>
                <h5 className={styles.title}>政策 · 大数据预警平台</h5>
                <div className={styles.search}>
                    <input
                        type="text"
                        placeholder="请输入查询内容"
                        value={keyword}
                        onKeyDown={this.keyDownListener}
                        onChange={e => {
                            this.setState({
                                keyword: e.target.value
                            });
                        }}
                    />
                    <img src={searchImg} alt="搜索" onClick={this.searchKeyWords} />
                </div>
                <div className={styles.nav_container}>
                    <div className={styles.nav}>{this.state.navs.map(item => NavItem(item))}</div>
                    <div className={styles.logout}>
                        <span>{userName}</span>
                        <img src={require('./images/logout.png')} onClick={this.logout} />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);
