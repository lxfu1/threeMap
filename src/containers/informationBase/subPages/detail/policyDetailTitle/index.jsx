/**
 * @author yaowei
 */
import React, { Component } from 'react';
import style from './style.scss';
import Title from 'components/Title';
import { message } from 'antd';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import similarityService from 'service/Similarity';

class policyDetailTitle extends Component {
    state = {
        info: [],
        bettleList: []
    };
    componentDidMount() {
        this.setState(
            {
                info: this.props.data
            },
            this.queryCart
        );
    }
    componentWillReceiveProps(newProps) {
        this.setState({
            info: newProps.data
        });
    }

    // 判断是否在对比列表
    isInbattleList = () => {
        if (this.state.info) {
            for (var val of this.state.bettleList) {
                if (val.bbdXgxxId === this.state.info.bbdXgxxId) {
                    return true;
                }
            }
        }
    };
    // 添加到对比列表
    addBettleItem = () => {
        similarityService.addPolicy(this.state.info.bbdXgxxId).then(d => {
            this.queryCart();
        });
    };
    queryCart = () => {
        const params = { size: 100, page: 1 };

        this.setState({ loading: true }, () => {
            similarityService.myList(params).then(d => {
                const { list } = d;

                this.setState({ bettleList: list });
            });
        });
    };
    // 从对比列表删除
    removeBettleItem = () => {
        similarityService.delPolicy(this.state.info.bbdXgxxId).then(d => {
            this.queryCart();
        });
    };

    toPolicyOrigins = () => {
        sessionStorage.setItem('policyDetail', JSON.stringify(this.state.info));
        this.props.history.push(`${'/main/compare/trace/'}${this.state.info.policyUniqueId}`);
    };
    render() {
        return (
            <div className={style.container}>
                <div className={style.btns}>
                    {this.isInbattleList() ?
                        <span className={style.normal} onClick={() => this.removeBettleItem(this.state.id)}>
                            √&nbsp;已添加
                        </span> :
                        <span className={style.willAdd} onClick={this.addBettleItem}>
                            +添加至对比
                        </span>
                    }
                    <Link className={style.normal} to={`${'/main/compare/similarity?from=others'}`}>
                        查看添加结果
                    </Link>
                    <span onClick={this.toPolicyOrigins} className={style.normal}>
                        +政策溯源
                    </span>
                </div>
                <div>
                    <Title text="高级检索" />
                </div>
                <div className={style.table}>
                    <ul>
                        <li>
                            索&nbsp;&nbsp;引&nbsp;&nbsp;号：
                            <span>{this.state.info.indexNumber || '-----'}</span>
                        </li>
                        <li>
                            发文机关：
                            <span>{this.state.info.office || '-----'}</span>
                        </li>
                        <li>
                            发文字号：
                            <span>{this.state.info.issued || '-----'}</span>
                        </li>
                        <li>
                            主&nbsp;&nbsp;题&nbsp;&nbsp;词：
                            <span>{this.state.info.keyWord || '-----'}</span>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            主题分类：
                            <span>{this.state.info.subject || '-----'}</span>
                        </li>
                        <li>
                            成文日期：
                            <span>{this.state.info.writtenDate || '-----'}</span>
                        </li>
                        <li>
                            发布日期：
                            <span>{this.state.info.time || '-----'}</span>
                        </li>
                        <li>
                            发文部门：
                            <span>{this.state.info.department || '-----'}</span>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
export default withRouter(policyDetailTitle);
