/**
 * @author yaowei
 */
import React, { Component } from 'react';
import style from './style.scss';
import { withRouter } from 'react-router';
import resource from 'util/resource';
import LoginService from 'service/Login';
import unselected from './images/unselected.png';
import selectedImage from './images/selected.png';
import username from './images/username.png';
import password from './images/password.png';
import { message } from 'antd';
import { TOKEN, USER, TOCENTYPE, REFRESHTOKEN, ckTimes, refreshTimes, remerberTimes } from 'constants/storage';
import { Base64 } from 'js-base64';
import { guid } from 'utils';
import API from 'api';

class Login extends Component {
    constructor(props) {
        super(props);
        this.password = '';
        this.username = '';
        this.code = '';
        try {
            this.TOKEN = localStorage.getItem(TOKEN);
        } catch (e) {
            this.TOKEN = '';
        }

        if (this.TOKEN) {
            props.history.push('/main');
        }
    }

    state = {
        message: '',
        selected: false,
        captcha: false,
        captchaUrl: '',
        uuid: null,
        username: '',
        password: ''
    };

    componentWillMount() {
        const cookieUserNmae = CK.getCookie('username');
        const cookiePassword = CK.getCookie('password');

        if (cookieUserNmae && cookiePassword) {
            this.setState({
                username: cookieUserNmae,
                password: cookiePassword
            });
        }
    }
    componentWillReceiveProps() {
        if (this.code) {
            this.code.value = '';
        }
    }
    setUserName = username => {
        this.setState({
            username
        });
        // 获取cookie中存储的信息
        const cookieUserNmae = CK.getCookie('username');
        const cookiePassword = CK.getCookie('password');

        if (cookieUserNmae === username && cookiePassword) {
            this.setState({ password: cookiePassword });
        }
    };
    login = () => {
        let state = this.state;

        if (!this.state.username || !this.state.password) {
            message.info('请输入用户名或密码');
            return;
        }
        LoginService.login({
            username: this.state.username,
            password: this.state.password,
            remember: this.state.selected,
            imgcode: this.state.captcha ? this.code.value : '',
            uuid: this.state.uuid
        }).then(status => {
            //登录成功
            if (status === true) {
                this.props.onClose();
                if (this.state.selected) {
                    //记住密码
                    CK.setCookie('username', this.state.username, refreshTimes);
                    CK.setCookie('password', this.state.password, refreshTimes);
                } else {
                    //没有记住就删除
                    CK.setCookie('username', this.state.username, 0);
                    CK.setCookie('password', this.state.password, 0);
                }
                if (typeof this.props.loginCallBack === 'function') {
                    this.props.loginCallBack(this.props.loginCallBackKeyWord);
                }
                //不要验证码
                this.setState(
                    {
                        captcha: false
                    },
                    this.getImageCode
                );
            } else if (status.code === 601) {
                //需要验证码
                this.setState(
                    {
                        captcha: true
                    },
                    this.getImageCode
                );
            }
        });
        if (this.code) {
            this.code.value = '';
        }
    };

    getImageCode = () => {
        const uuid = guid();

        this.setState({
            captchaUrl: API.login.loginImgcode + '/' + uuid,
            uuid
        });
    };

    onKeyPress = e => {
        if (e.keyCode === 13 || e.charCode === 13) {
            this.login();
        }
    };

    handleSelect = () => {
        let state = this.state;

        state.selected = !state.selected;
        this.setState(state);
    };

    render() {
        let { selected, captcha } = this.state;

        return (
            <div className={style.form}>
                <ul>
                    <li>
                        <img className={style.img} src={username} title="用户名" />
                        <input
                            onKeyPress={this.onKeyPress}
                            type="text"
                            placeholder="请输入用户名"
                            style={{ backgroundImage: require('./images/username.png') }}
                            onChange={e => {
                                this.setUserName(e.target.value);
                            }}
                            value={this.state.username}
                        />
                    </li>
                    <li>
                        <img src={password} className={style.img} title="用户名" />
                        <input
                            onKeyPress={this.onKeyPress}
                            type="password"
                            placeholder="请输入密码"
                            style={{ backgroundImage: require('./images/password.png') }}
                            onChange={e => {
                                this.setState({ password: e.target.value });
                            }}
                            value={this.state.password}
                        />
                    </li>
                    {captcha ?
                        <li className={style.captcha}>
                            <input
                                onKeyPress={this.onKeyPress}
                                type="text"
                                placeholder="请输入验证码"
                                id={style.input}
                                ref={e => {
                                    this.code = e;
                                }}
                                onChange={this.testImageCode}
                            />
                            <img src={this.state.captchaUrl} alt="验证码" title="验证码" onClick={this.getImageCode} />
                        </li> :
                        ''
                    }
                    <li className={style.remenber}>
                        <dl>
                            <dt>
                                <img src={selected ? selectedImage : unselected} alt="" onClick={this.handleSelect} />
                                <label onClick={this.handleSelect}>记住密码</label>
                            </dt>
                            {/* <dd>忘记密码</dd> */}
                        </dl>
                    </li>
                    <li className={style.login}>
                        <div
                            onClick={() => {
                                this.login();
                            }}
                        >
                            登录
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}

export default withRouter(Login);
