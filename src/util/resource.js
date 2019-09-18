import axios from 'axios';
import {
    TOKEN,
    RETOKEN,
    REMEMBERME,
    TOCENTYPE,
    REFRESHTOKEN,
    Service,
    ckTimes,
    refreshTimes,
    remerberTimes
} from '../constants/storage';
import loading from './loading';
import { convertQueryString } from 'utils';
import createHashHistory from 'history/createHashHistory';
let loadingLayer = loading();
let changeToken = false;
/*
 *   封装axios get, post, delete, put 方法, 可配置是否有缓冲
 * */
var resource = {
    count: 0,
    timer: null,
    isOpen: true,
    width: 0, // 顶部加载进度条宽度
    post: function (uri, params, isLoading) {
        return this.send(uri, params, 'post', isLoading);
    },

    // 删除数据
    'delete': function (uri, isLoading) {
        return this.send(uri, null, 'delete', isLoading);
    },

    // 更新数据
    put: function (uri, params, isLoading) {
        return this.send(uri, params, 'put', isLoading);
    },

    // 获取数据
    get: function (uri, params, isLoading) {
        let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');

        if (reg.test(uri)) {
            uri = encodeURI(uri);
        }
        return this.send(uri, params, 'get', isLoading);
    },
    open: function () {
        // this.isOpen = true;
    },
    close: function () {
        // this.isOpen = false;
    },

    send: function (uri, params, method, isLoading) {
        if (!(isLoading === false) && ++this.count === 1) {
            clearInterval(this.timer);
            if (this.width < 80) {
                this.timer = setInterval(() => {
                    this.width += 1;
                    loadingLayer.style.width = this.width + '%';
                    if (this.width >= 80) {
                        clearInterval(this.timer);
                    }
                }, 30);
            }
        }

        switch (method) {
            case 'post':
                return axios.post(uri, params).then(
                    res => {
                        this.isStop(isLoading);
                        return res.data;
                    },
                    res =>
                        new Promise((resolve, reject) => {
                            reject(res.response.data);
                        })
                );
            case 'delete':
                return axios.delete(uri).then(
                    res => {
                        this.isStop(isLoading);
                        return res.data;
                    },
                    res =>
                        new Promise((resolve, reject) => {
                            reject(res.response.data);
                        })
                );
            case 'put':
                return axios.put(uri, params).then(
                    res => {
                        this.isStop(isLoading);
                        return res.data;
                    },
                    res =>
                        new Promise((resolve, reject) => {
                            reject(res.response.data);
                        })
                );
            case 'get':
                return axios.get(uri + convertQueryString(params)).then(
                    res => {
                        this.isStop(isLoading);
                        return res.data;
                    },
                    res =>
                        new Promise((resolve, reject) => {
                            reject(res.response.data);
                        })
                );

            default:
                return false;
        }
    },

    isStop: function (isLoading) {
        if (!(isLoading === false) && --this.count === 0) {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.width += 5;
                loadingLayer.style.width = this.width + '%';
                if (this.width >= 110) {
                    clearInterval(this.timer);
                    this.width = 0;
                    loadingLayer.style.width = 0;
                }
            }, 20);
        }
    }
};

// axios.defaults.baseURL = 'http://192.168.1.169:7087';

// 请求拦截器
axios.interceptors.request.use(
    function (config) {
        return new Promise((resolve, reject) => {
            if(changeToken){
                setTimeout(()=>{
                    config.headers.Authorization = CK.getCookie(TOKEN);
                    resolve(config);
                }, 1000)
            }else if(!CK.getCookie(TOKEN) && CK.getCookie(REFRESHTOKEN)){
                changeToken = true;
                let xhr;

                if(window.ActiveXObject){
                    xhr =  ActiveXObject("Microsoft.XMLHTTP");
                }else {
                    xhr = new XMLHttpRequest();
                }
                xhr.onreadystatechange = () => {
                    if(xhr.readyState === 4){
                        if(xhr.status === 200){
                            changeToken = false;
                            CK.setCookie(TOKEN, JSON.parse(xhr.responseText).data.token, ckTimes);
                            CK.setCookie(REFRESHTOKEN, JSON.parse(xhr.responseText).data.retoken, localStorage.getItem('remerber') ? remerberTimes : refreshTimes);
                            config.headers.Authorization = JSON.parse(xhr.responseText).data.token;
                            resolve(config)
                        }else{
                            reject('刷新token失败');
                            createHashHistory().push('/login');
                        }
                    }
                };
                xhr.open('get',`/${Service}/anonymous/refreshToken`, true);
                xhr.setRequestHeader("retoken", CK.getCookie(REFRESHTOKEN));
                xhr.send();
            }else{
                config.headers.Authorization = CK.getCookie(TOKEN);
                resolve(config);
            }
        })
    },
    function (error) {
        return Promise.reject(error)
    }
);

// 响应拦截器
axios.interceptors.response.use(
    function (response) {
        switch (response.code) {
        case 401:
            // if(localStorage.getItem(REMEMBERME))
            // {
            //     resource.post('/support-user/security/retoken',{
            //         retoken: localStorage.getItem(RETOKEN)
            //     }).then((res) => {
            //         if(res.status === 401)
            //         {
            //             hashHistory.push('/login');
            //         }
            //     });
            // }else{
            //     hashHistory.push('/login');
            // }
            hashHistory.push('/login');
            break;
        case 500:
            break;
        default:
            break;
        }
        return response;
    },
    function (error) {
        if (error.toString().indexOf('401') >= 0 || error.toString().indexOf('403') >= 0) {
            sessionStorage.removeItem(TOKEN);
            sessionStorage.removeItem(TOCENTYPE);
            localStorage.removeItem(TOKEN);
            localStorage.removeItem(TOCENTYPE);
            createHashHistory().push('/login');
        }

        if (resource.timer) {
            resource.isStop(true);
        }

        return Promise.reject(error);
    }
);

export default resource;
