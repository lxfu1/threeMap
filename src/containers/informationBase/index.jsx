/**
 * @author yaowei
 */
import React, { Component } from 'react';
import style from './style.scss';
import Title from 'components/Title';
import { Select } from 'antd';
import { DatePicker } from 'antd';
import 'rc-select/assets/index.css';
import Pagination from 'components/PaginationNoEnd';
import API from 'api';
import { message, Spin } from 'antd';
import resource from 'resource';
import { Link, withRouter } from 'react-router-dom';
import commonService from 'service/CommonApi';
import { searchParmToJson } from 'utils';

const Option = Select.Option;

class InformationBase extends Component {
    state = {
        pageSize: 9, //每页数量
        pageNum: 1, //当前页数
        total: 0, //总数
        startValue: null,
        endValue: null,
        searchText: '',
        searchTitle: '',
        searchTag: null,
        searchProvince: null,
        searchNum: '',
        searchParams: '',
        isSearch: false, //是否是查询结果
        searchOrder: 'desc',
        news: [],
        provinces: [],
        isLoading: false,
        searchType: ''
    };
    componentDidMount() {
        this.getProvinces();
        // 如果路由上有search 就搜索政策
        if (this.props.location.search) {
            // const searchJson = searchParmToJson(this.props.location.search);

            //     this.setState(
            //         {
            //             searchProvince: searchJson.province
            //         },
            //         this.search
            //     );
            // } else {
            //     this.search();

            this.setState(
                {
                    searchParams: {
                        type: '政策'
                    }
                },
                this.search
            );
        } else {
            this.search();
        }
    }
    //开始日期的选择范围
    disabledStartDate = startValue => {
        //当前选择的结束如期
        const endValue = this.state.endValue;

        //有任何一个日期未选择
        if (!startValue || !endValue) {
            return false;
        }
        //开始日期大于结束日期的不可选择 或者结束时间3个月之前的天数不能选
        return (
            startValue.valueOf() > endValue.valueOf() || startValue.valueOf() < endValue.valueOf() - 1000 * 60 * 60 * 24 * 30 * 3
        );
    };
    //结束日期的选择范围
    disabledEndDate = endValue => {
        //当前选择的开始日期
        const startValue = this.state.startValue;

        //有任何一个日期未选择
        if (!endValue || !startValue) {
            return false;
        }
        //开始日期大于结束日期的不可选择  大于开始时间3个月的时间不可选
        return (
            endValue.valueOf() <= startValue.valueOf() || endValue.valueOf() > startValue.valueOf() + 1000 * 60 * 60 * 24 * 30 * 3
        );
    };

    onChange = (field, value) => {
        this.setState({
            [field]: value
        });
    };

    // 排序
    orderSearch = order => {
        if (this.state.searchOrder === order) {
            return;
        }
        this.setState(
            {
                searchOrder: order,
                pageNum: 1
            },
            this.search
        );
    };
    clickSearch = () => {
        this.setState(
            {
                pageNum: 1,
                searchParams: {
                    searchType: '',
                    time: this.state.startValue ? this.state.startValue.format('YYYY-MM-DD') : '', //发布时间 起
                    timeEnd: this.state.endValue ? this.state.endValue.format('YYYY-MM-DD') : '', //发布时间 止
                    text: encodeURI(this.state.searchText), //正文
                    title: encodeURI(this.state.searchTitle), //标题
                    tag: this.state.searchTag,
                    countyCode: this.state.searchProvince, //省份
                    issued: encodeURI(this.state.searchNum), //字号
                    type: encodeURI(this.state.searchType)
                    // keyWord: encodeURI(sessionStorage.getItem('themeName')) 不发送该字段
                }
            },
            this.search
        );
    };
    pageChange = pageNum => {
        if (this.state.pageNum === pageNum) {
            return;
        }
        this.setState(
            {
                pageNum
            },
            this.search
        );
    };
    //搜索
    search = () => {
        let isSearch = this.getSearchType();
        let searchParams = {
            ...this.state.searchParams,
            page: this.state.pageNum,
            sort: 'time-' + this.state.searchOrder,
            size: this.state.pageSize
        };

        // searchParams.page = data.page ? data.page : 1;
        // searchParams.sort = 'time-' + this.state.searchOrder;

        this.setState({
            isLoading: true
        });
        resource.get(API.policy.search, searchParams).then(res => {
            if (res.code === 200) {
                this.setState({
                    news: res.data.list,
                    total: res.data.total,
                    pageNum: res.data.pageNum,
                    isSearch,
                    isLoading: false
                });
            } else {
                message.info(res.message);
            }
        });
    };
    getSearchType = () => {
        if (this.state.searchParams) {
            //开始时间
            return true;
        }
        return false;
    };
    //清空搜索
    resetSearch = () => {
        this.setState({
            startValue: null, //开始日期
            endValue: null, //结束日期
            searchText: '', //正文检索
            searchTitle: '', //标题检索
            searchTag: null, //部门检索
            searchProvince: null, //省份检索
            searchNum: '', //字号检索
            titleText: '' //检索结果标题
        });
    };

    //获取区域列表
    getProvinces = () => {
        commonService.getProvinces().then(provinces => {
            this.setState({ provinces });
        });
    };

    render() {
        return (
            <div className={style.container}>
                <div>
                    <Title text="高级检索" />
                </div>
                <div className={style.selector}>
                    <div>
                        正文检索
                        <div className={style.text}>
                            <input
                                type="text"
                                placeholder="请输入检索内容"
                                value={this.state.searchText}
                                onChange={e => {
                                    this.setState({ searchText: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        标题检索
                        <div className={style.text}>
                            <input
                                type="text"
                                placeholder="请输入检索内容"
                                value={this.state.searchTitle}
                                onChange={e => this.onChange('searchTitle', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        政策等级
                        <div className={`${style.text} ${style.slc}`}>
                            <Select
                                optionFilterProp="children"
                                allowClear
                                showSearch
                                className={style.select}
                                onChange={value => this.onChange('searchTag', value)}
                            >
                                <Option value="central">中央</Option>
                                <Option value="provincial">省级</Option>
                                <Option value="municipal">市级</Option>
                                <Option value="county">县级</Option>
                            </Select>
                        </div>
                    </div>
                    <div>
                        省份筛选
                        <div className={`${style.text} ${style.slc}`}>
                            <Select
                                optionFilterProp="children"
                                allowClear
                                showSearch
                                className={style.select}
                                // value={this.state.searchProvince ? parseInt(this.state.searchProvince) : null}
                                onChange={value => {
                                    this.onChange('searchProvince', value);
                                }}
                            >
                                {this.state.provinces.map((item, key) => {
                                    return (
                                        <Option key={key} value={item.regionCode}>
                                            {item.province}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </div>
                    </div>
                    <div>
                        发文字号
                        <div className={style.text}>
                            <input
                                type="text"
                                placeholder="请输入检索内容"
                                value={this.state.searchNum}
                                onChange={e => this.onChange('searchNum', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        发布日期
                        <div className={style.date}>
                            <DatePicker
                                className={style.divSelect}
                                disabledDate={this.disabledStartDate}
                                value={this.state.startValue}
                                placeholder="请选择开始日期"
                                onChange={value => this.onChange('startValue', value)}
                            />
                            至
                            <DatePicker
                                className={style.divSelect}
                                disabledDate={this.disabledEndDate}
                                value={this.state.endValue}
                                placeholder="请选择结束日期"
                                onChange={value => this.onChange('endValue', value)}
                            />
                        </div>
                    </div>
                    <div style={{ visibility: this.state.isSearch ? 'visible' : 'hidden' }}>
                        找到
                        <span className={style.searchNum}>{this.state.total}</span>
                        条结果
                    </div>
                    <div>
                        <div className={style.button}>
                            <span onClick={this.resetSearch}>重置</span>
                            <span onClick={this.clickSearch}>搜索</span>
                        </div>
                    </div>
                </div>
                <div className={style.list}>
                    <Title text={this.state.isSearch ? '搜索结果' : '最新政策导读'} />
                    <div style={{ visibility: this.state.isSearch ? 'visible' : 'hidden' }} className={style.order}>
                        排序方式：发布日期
                        <span
                            className={`${style.button} ${this.state.searchOrder === 'asc' ? style.active : ''}`}
                            onClick={() => this.orderSearch('asc')}
                        >
                            升序
                        </span>
                        <span
                            className={`${style.button} ${this.state.searchOrder === 'asc' ? '' : style.active}`}
                            onClick={() => this.orderSearch('desc')}
                        >
                            降序
                        </span>
                    </div>
                    <News
                        data={this.state.news}
                        isSearch={this.state.isSearch}
                        pageNum={this.state.pageNum}
                        total={this.state.total}
                        pageSize={this.state.pageSize}
                        onChange={this.pageChange}
                        searchTitle={this.state.searchTitle}
                    />
                </div>
                <div className={style.loading} style={{ display: this.state.isLoading ? 'flex' : 'none' }}>
                    <Spin spinning={this.state.isLoading} size="large" />
                </div>
            </div>
        );
    }
}

const News = ({ data, isSearch, pageNum, total, pageSize, onChange, searchTitle }) => {
    let list = [];

    if (isSearch) {
        data.map((item, idx) => {
            let title = '';

            if (searchTitle && item.title.indexOf(searchTitle) !== -1) {
                // 拆分成数组
                let temTitle = item.title.split(searchTitle);

                title =
                    <span>
                        {temTitle.map((val, key, arr) => {
                            console.log(key);
                            return (
                                <span key={key}>
                                    {val}
                                    {key === temTitle.length - 1 ? '' : <span style={{ color: '#00ccff' }}>{searchTitle}</span>}
                                </span>
                            );
                        })}
                    </span>
                ;
            } else {
                title = item.title;
            }

            list.push(
                <li key={idx} className={style.newsList}>
                    <Link title={item.title} to={`${'/main/info/detail/'}${item.bbdXgxxId}`} className="text-overflow">
                        {title}
                    </Link>
                    <div className={style.searchInfo}>
                        <span className={style.searchNo}>{item.issued ? '发文字号：' + item.issued : ''}</span>
                        <span className={style.searchSendDate}>
                            网站发布日期：
                            {item.time}
                        </span>
                        <span className={style.searchMakeDate}>{item.writtenDate ? '成文日期：' + item.writtenDate : ''}</span>
                    </div>
                </li>
            );
        });
    } else {
        data.map((item, idx) =>
            list.push(
                <li key={idx} className={style.newsList}>
                    <Link title={item.title} to={`${'/main/info/detail/'}${item.bbdXgxxId}`} className="text-overflow">
                        {item.title}
                    </Link>
                    <span>{item.time}</span>
                </li>
            )
        );
    }
    return (
        <div className={style.news}>
            <ul>{list}</ul>
            <div className={style.page}>
                <Pagination
                    blueTheme={true}
                    start={1}
                    size={pageSize}
                    current={pageNum}
                    total={total}
                    onChange={onChange}
                    showQuickJump={false}
                />
            </div>
        </div>
    );
};

export default withRouter(InformationBase);
