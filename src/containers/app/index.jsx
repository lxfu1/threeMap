import React, { Component } from 'react';
import style from './style.scss';
import Header from 'components/Header';
import Footer from 'components/Footer';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider } from 'antd';
import DataAcquisitionInfo from 'containers/dataAcquisitionInfo'

export default class App extends Component {
    render() {
        return (
            <LocaleProvider locale={zhCN}>
                <div id={style['home-page']}>
                    <Header />
                    <DataAcquisitionInfo />
                    <div className={style.children}>{this.props.children}</div>
                </div>
            </LocaleProvider>
        );
    }
}
