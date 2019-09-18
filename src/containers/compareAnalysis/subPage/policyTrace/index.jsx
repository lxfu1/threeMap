/*
 *author: 姚伟
 * date: 18/8/8
 * describe: 政策溯源
 */
import React, { Component } from 'react';
import style from './style.scss';
import Box from 'components/Box';
import searchImg from '../../.././../static/images/search.png';
import API from 'api';
import { message } from 'antd';
import resource from 'resource';
import Pagination from 'components/PaginationNoEnd';
import { Link } from 'react-router-dom';
import Modal from 'components/Modal';
import { Spin } from 'antd';
import similarityService from 'service/Similarity';

class PolicyTrace extends Component {
    constructor() {
        super();
        this.state = {
            pageSize: 12, // 每页数量
            pageNum: 1, // 当前页数
            list: [], // 数据列表
            text: '', // 查询
            total: 0, // 总数
            isLoading: false,
            isSearch: false,
            bettleList: [] //对比列表
        };
    }
    componentDidMount() {
        this.search();
        this.queryCart();
    }
    // 判断是否在对比列表
    isInbattleList = id => {
        for (var val of this.state.bettleList) {
            if (val.bbdXgxxId === id) {
                console.log(id);
                return true;
            }
        }
    };
    // 添加到对比列表
    addBettleItem = id => {
        similarityService.addPolicy(id).then(d => {
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
    removeBettleItem = id => {
        similarityService.delPolicy(id).then(d => {
            this.queryCart();
        });
    };
    onChange = (field, value) => {
        this.setState({
            [field]: value
        });
    };
    // 页码改变
    pageChange = page => {
        this.setState(
            {
                pageNum: page
            },
            this.search
        );
    };
    // 搜索
    search = () => {
        const params = {
            page: this.state.pageNum,
            size: this.state.pageSize,
            type: encodeURI('政策'),
            title: encodeURI(this.state.text)
        };

        this.setState({ isLoading: true });
        resource.get(API.policy.search, params).then(res => {
            if (res.code === 200) {
                this.setState({
                    list: res.data.list,
                    pageNum: res.data.pageNum,
                    total: res.data.total,
                    isLoading: false
                });

                if (this.state.text) {
                    // 是搜索的结果
                    this.setState({
                        isSearch: true
                    });
                } else {
                    // 不是搜索的结果
                    this.setState({
                        isSearch: false
                    });
                }
            } else {
                message.info(res.message);
            }
        });
    };
    // 跳转到政策溯源
    toPolicyOrigins = info => {
        sessionStorage.setItem('policyDetail', JSON.stringify(info));
        this.props.history.push(`${'/main/compare/trace/'}${info.policyUniqueId}`);
    };

    //跳转到政策图谱
    toPolicyAtlas = id => {
        this.props.history.push({ pathname: `${'/main/compare/trace/policyGraph'}`, state: { id: id } });
    };

    // 跳转到对比列表
    toSimilarity = () => {
        this.props.history.push({ pathname: `${'/main/compare/similarity'}`, state: { from: 'others' } });
    };
    render() {
        return (
            <div className={style.container}>
                <Box>
                    <div className={style.content}>
                        <div className={style.search}>
                            <span>政策检索</span>
                            <div>
                                <input
                                    type="text"
                                    placeholder="请输入检索内容"
                                    value={this.state.text}
                                    onChange={e => this.onChange('text', e.target.value)}
                                />
                                <img onClick={this.search} src={searchImg} alt="搜索" />
                            </div>
                        </div>
                        <p className={style.title}>{this.state.isSearch ? '搜索结果' : '最新政策文件'}</p>
                        <ul className={style.list}>
                            {this.state.list.map((item, idx) => {
                                let title = '';
                                const searchText = this.state.text;

                                if (searchText && item.title.indexOf(searchText) !== -1) {
                                    // 拆分成数组
                                    const temTitle = item.title.split(searchText);

                                    title =
                                        <span>
                                            {temTitle.map((val, key, arr) => {
                                                console.log(key);
                                                return (
                                                    <span key={key}>
                                                        {val}
                                                        {key === temTitle.length - 1 ?
                                                            '' :
                                                            <span style={{ color: '#00ccff' }}>{searchText}</span>
                                                        }
                                                    </span>
                                                );
                                            })}
                                        </span>
                                    ;
                                } else {
                                    title = item.title;
                                }
                                return (
                                    <li key={idx} className={style.newsList}>
                                        <Link
                                            title={item.title}
                                            to={`${'/main/info/detail/'}${item.bbdXgxxId}`}
                                            className="text-overflow"
                                        >
                                            {title}
                                        </Link>
                                        <div className={style.info}>
                                            <span className={style.time}>
                                                成文日期：
                                                {item.writtenDate ? item.writtenDate : '--'}
                                            </span>
                                            {this.isInbattleList(item.bbdXgxxId) ?
                                                <span
                                                    className={style.bettle}
                                                    onClick={() => this.removeBettleItem(item.bbdXgxxId)}
                                                >
                                                    取消对比
                                                </span> :
                                                <span className={style.btn} onClick={() => this.addBettleItem(item.bbdXgxxId)}>
                                                    文本对比
                                                </span>
                                            }
                                            <span className={style.btn} onClick={() => this.toPolicyOrigins(item)}>
                                                政策溯源
                                            </span>
                                            <span className={style.btn} onClick={() => this.toPolicyAtlas(item.bbdXgxxId)}>
                                                政策图谱
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                            {this.state.list.length === 0 ? '对不起！暂无该相关内容' : ''}
                        </ul>
                        <div className={style.page}>
                            <Pagination
                                blueTheme={true}
                                start={1}
                                size={this.state.pageSize}
                                current={this.state.pageNum}
                                total={this.state.total}
                                onChange={this.pageChange}
                            />
                        </div>
                    </div>
                </Box>
                {this.state.bettleSpill ?
                    <Modal
                        message="对不起，您每次只能选择1-2个关键词。"
                        confirm={this.toSimilarity}
                        cancel={() => this.onChange('bettleSpill', false)}
                        okText="查看对比列表"
                        maskClosable={false}
                    /> :
                    ''
                }
                <div className={style.loading} style={{ display: this.state.isLoading ? 'flex' : 'none' }}>
                    <Spin spinning={this.state.isLoading} size="large" />
                </div>
            </div>
        );
    }
}

export default PolicyTrace;
