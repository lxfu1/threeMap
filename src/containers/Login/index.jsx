/**
 * @author yaowei
 */
import React, { Component } from 'react';
import style from './style.scss';
import { withRouter } from 'react-router';
import resource from 'util/resource';
import Earth from 'components/threeMap';
import LoginService from 'service/Login';
import searchImg from '../../static/images/search.png';
import leftTop from './images/left-top.png';
import buttonRight from './images/button-right.png';
import { message } from 'antd';
import { TOKEN, USER, TOCENTYPE, REFRESHTOKEN } from 'constants/storage';
import { Base64 } from 'js-base64';
import Login from './login';
import Rodal from 'rodal';
import API from 'api';
import Title from 'components/Title';
import { Link } from 'react-router-dom';
import help from '../../static/doc/help.pdf';

class IndexPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loginView: false,
            searchKeyWords: '',
            keywordStatistics: [], //数据统计
            allWords: [],
            loginCallBack: this.isLogin,
            loginCallBackKeyWord: null,
            clientHeight: 0, //浏览器最小高度
            isLogin: false,
            noKeyWordsView: false
        };

        this.password = '';
        this.username = '';
    }

    componentDidMount() {
        this.keywordStatistics();
        this.getAllKeyWords();
        this.onChange('clientHeight', document.body.clientHeight);
        this.isLogin();
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value
        });
    };

    //判断是否登录
    isLogin = () => {
        const token = CK.getCookie(REFRESHTOKEN);

        this.setState({ isLogin: Boolean(token) });
        return Boolean(token);
    };
    //查询
    search = () => {
        //没有登录则登录
        if (!this.isLogin()) {
            return this.setState(
                {
                    loginCallBack: this.getKeyWords,
                    loginCallBackKeyWord: this.state.searchKeyWords
                },
                this.onChange('loginView', true)
            );
        }
        this.getKeyWords(this.state.searchKeyWords);
    };

    clickMap = keyword => {
        //没有登录则登录
        if (!this.isLogin()) {
            return this.setState(
                {
                    loginCallBack: this.getKeyWords,
                    loginCallBackKeyWord: keyword
                },
                this.onChange('loginView', true)
            );
        }
        this.getKeyWords(keyword);
    };
    getAllKeyWords = () => {
        resource.get('/govacademy-server/keyword/queryAllKeyword?page=1&size=100').then(res => {
            if (res.code === 200) {
                this.setState({
                    allWords: res.data.list
                });
            } else {
                message.info(res.message);
            }
        });
    };
    onKeyPress = e => {
        if (e.keyCode === 13 || e.charCode === 13) {
            this.search();
        }
    };
    getKeyWords = (keyword = '') => {
        this.isLogin();

        if (!keyword) {
            return message.info('请输入查询内容');
        }
        resource.get(API.keyWords.getKeyWords + '?keyword=' + keyword).then(res => {
            if (res.code === 200) {
                const list = res.data.list;

                if (list.length > 0) {
                    //搜索到结果，有主题
                    this.toTheme(list[0]);
                } else {
                    sessionStorage.removeItem('themeName');
                    sessionStorage.removeItem('themeID');
                    // this.props.history.push('/main/wordRecord');
                    this.setState({ noKeyWordsView: true });
                }
            } else {
                message.info(res.message);
            }
        });
    };
    //数据统计
    keywordStatistics = () => {
        resource.get(API.keyWords.keywordStatistics).then(res => {
            if (res.code === 200) {
                this.setState({
                    keywordStatistics: res.data
                });
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
        this.props.history.push('/main');
    };
    // 跳转到关键词页面
    toWordRecord = () => {
        //没有登录则登录
        if (!this.isLogin()) {
            return this.setState(
                {
                    loginCallBack: this.props.history.push,
                    loginCallBackKeyWord: '/main/wordRecord'
                },
                this.onChange('loginView', true)
            );
        }
        this.props.history.push('/main/wordRecord');
    };
    logout = () => {
        CK.setCookie(REFRESHTOKEN, null, -1); //设置过期时间0
        CK.setCookie(TOKEN, null, -1); //设置过期时间0
        this.setState({
            isLogin: false
        });
    };
    render() {
        let { selected, captcha, count, allWords } = this.state;
        const userInfo = JSON.parse(CK.getCookie('user'));
        const userName = userInfo && userInfo.userinfo ? userInfo.userinfo.username : '-';

        return (
            <div className={style.container} style={{ minHeight: this.state.clientHeight }}>
                <div className={style.earths}>
                    <Earth words={allWords} click={this.clickMap} />
                </div>
                <div className={style.context}>
                    {!this.state.isLogin ?
                        '' :
                        <div className={style.loginStatus}>
                            <span>
                                <a target="_blank" href={help}>
                                    帮助
                                </a>
                                {userName},
                                <span onClick={this.logout} className={style.logout}>
                                    退出
                                </span>
                            </span>
                        </div>
                    }

                    <div className={style.entry}>
                        <div>
                            <h4>政策·大数据预警平台</h4>
                            {!this.state.isLogin ?
                                <span>
                                    <span className={style.loginButton} onClick={() => this.onChange('loginView', true)}>
                                        登录
                                    </span>
                                    <span className={style.help}>
                                        <a target="_blank" href={help}>
                                            帮助
                                        </a>
                                    </span>
                                </span> :
                                ''
                            }
                        </div>
                        <div className={style.search}>
                            <input
                                onKeyPress={this.onKeyPress}
                                placeholder="请输入查询内容"
                                value={this.state.searchKeyWords}
                                onChange={e => this.setState({ searchKeyWords: e.target.value })}
                            />
                            <img src={searchImg} onClick={this.search} alt="搜索" />
                        </div>
                        <DataItem toWordRecord={this.toWordRecord} data={this.state.keywordStatistics} />
                    </div>
                </div>
                <Rodal visible={this.state.loginView} onClose={() => this.onChange('loginView', false)} showCloseButton={true}>
                    <Login
                        loginCallBack={this.state.loginCallBack}
                        loginCallBackKeyWord={this.state.loginCallBackKeyWord}
                        onClose={() => this.onChange('loginView', false)}
                    />
                    <img className={style.leftTopPic} src={leftTop} />
                    <img className={style.buttonRightPic} src={buttonRight} />
                </Rodal>
                <Rodal
                    visible={this.state.noKeyWordsView}
                    onClose={() => this.onChange('noKeyWordsView', false)}
                    showCloseButton={true}
                >
                    <div className={style.noKeyWordsView}>
                        <Title text={'友情提示'} />
                        <p>
                            您好，关键词 “ {this.state.searchKeyWords} ”
                            未被收录，如要查看相关数据，请手动添加该关键词，平台将会在2-3个工作日完成该关键词的收录及计算，谢谢！
                        </p>
                        <div className={style.button}>
                            <Link to={`${'/main/wordRecord'}`} style={{ color: 'white' }}>
                                点击添加
                            </Link>
                        </div>
                    </div>
                    <img className={style.leftTopPic} src={leftTop} />
                    <img className={style.buttonRightPic} src={buttonRight} />
                </Rodal>
            </div>
        );
    }
}

const DataItem = ({ data, toWordRecord }) => {
    return (
        <ul>
            <li>
                <p>数据总量</p>
                <p>{data.countTotal}</p>
            </li>
            <li>
                <p>今日新增</p>
                <p>{data.todayAddTotal}</p>
            </li>
            <li className={style.toWordRecord} onClick={toWordRecord}>
                <p>收录热词</p>
                <p>{data.countKeyword}</p>
            </li>
        </ul>
    );
};

export default withRouter(IndexPage);
