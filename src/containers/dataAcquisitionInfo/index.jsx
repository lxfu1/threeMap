import React, { Component } from 'react';
import Box from 'components/Box';
import style from './style.scss';
import Title from 'components/Title';
import resource from 'resource';
import API from 'api';
import { sumStrings, formatNumByComma } from 'utils';

export default class dataAcquisitionInfo extends Component {
    constructor() {
        super();
        this.state = {
            left: 0,
            todayNewsNum: 0,//今日新闻总量
            allNewsNum: 0,//所有新闻总量
            todayPolicyNum: 0,//今日政策总量
            allPolicyNum: 0,//所有政策总量
            allNum: 0,//所有总量
            todayNum: 0//今日总量
        }
    }

    componentDidMount() {
        this.getData();
        this.retract();
    }
    componentWillUnmount() {
        this.removeMouseMove();
    }
    //鼠标监听
    bindMouseMove = () => {
        document.addEventListener('mousemove', this.show)
    };
    //移除监听
    removeMouseMove = () => {
        document.removeEventListener('mousemove', this.show)
    };
    //展示
    show = (e) => {

        //鼠标位置判断 + 当前的left值是否已经看不到 DIV
        if (e.clientX < 10 && e.clientY > 280 && this.state.left < -12.8) {

            if (!this.inAreaTimer) {
                // 在区域内的定时
                this.inAreaTimer = setTimeout(() => {
                    this.removeMouseMove();
                    this.setLeftMax();
                }, 2000);
            }
        } else {
            clearTimeout(this.inAreaTimer);
            this.inAreaTimer = null;
        }
    };
    //收起
    retract = () => {
        this.setLeftMin();
        this.bindMouseMove();
    };
    //隐藏
    setLeftMin = () => {
        // 隐藏时候的定时
        this.retractInterval = setInterval(() => {
            //判断是否移除屏幕
            if (this.state.left > -12.8) {
                this.setState({
                    left: this.state.left - 0.2
                })
            } else {
                clearInterval(this.retractInterval);
            }
        }, 1);
    }
    //显示
    setLeftMax = () => {
        clearTimeout(this.inAreaTimer);
        // 展示时候的定时
        this.showInterval = setInterval(() => {
            //判断是否贴在屏幕最左边
            if (this.state.left < 0) {
                this.setState({
                    left: this.state.left + 0.2
                })
            } else {
                clearInterval(this.showInterval);
            }
        }, 1);
    }
    getData = () => {
        resource.get(API.dataAcquisitionInfo.getData).then(res => {
            if (res.code === 200) {
                const data = res.data;
                const todayNewsNum = res.data.XW_today;//今日新闻总量
                const allNewsNum = res.data.XW_all;//所有新闻总量
                const todayPolicyNum = res.data.ZC_today;//今日政策总量
                const allPolicyNum = res.data.ZC_all;//所有政策总量
                const allNum = sumStrings(allNewsNum, allPolicyNum);//所有总量
                const todayNum = sumStrings(todayNewsNum, todayPolicyNum);//今日总量

                this.setState({
                    todayNewsNum: formatNumByComma(todayNewsNum),
                    allNewsNum: formatNumByComma(allNewsNum),
                    todayPolicyNum: formatNumByComma(todayPolicyNum),
                    allPolicyNum: formatNumByComma(allPolicyNum),
                    allNum: formatNumByComma(allNum),
                    todayNum: formatNumByComma(todayNum)
                });


            } else {
                message.info(res.message);
            }
        });
    }

    render() {
        return (
            <Box
                classNames={style.container}
                config={{ left: this.state.left + 'rem', position: 'absolute' }}
            >
                <div className={style.title}>
                    <p className={style.retractButton} onClick={this.retract}>&#60;&#60;收起</p>
                    <h2>数据采集总量</h2>
                </div>

                <div className={style.underLine}></div>
                <div>
                    <div className={style.info}>
                        <span>所有（总量）</span>
                        <p>{this.state.allNum}</p>
                        <span>所有（今日）</span>
                        <p>{this.state.todayNum}</p>
                    </div>
                    <div className={style.underLine}></div>
                    <div className={style.info}>
                        <span>政策（总量）</span>
                        <p>{this.state.allPolicyNum}</p>
                        <span>政策（今日）</span>
                        <p>{this.state.todayPolicyNum}</p>
                    </div>
                    <div className={style.underLine}></div>
                    <div className={style.info}>
                        <span>新闻（总量）</span>
                        <p>{this.state.allNewsNum}</p>
                        <span>新闻（今日）</span>
                        <p>{this.state.todayNewsNum}</p>
                    </div>
                </div>
            </Box>
        );
    }
}