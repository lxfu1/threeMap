import React, { Component } from 'react';
import s from './style.scss';
import Box from 'components/Box';
import { Select, Search, Button, CheckBox, Modal } from '../../components'
// import Pagination from 'components/Pagination'
import Pagination from 'components/PaginationNoEnd'
import commonService from 'service/CommonApi'
import similarityService from 'service/Similarity'
import _ from 'lodash'
import { Icon, Cascader } from 'antd';
import { observer } from 'mobx-react';
import qs from 'qs'
import { toUnicode } from 'utils'
import policy from './policyCategory'

// 临时 Loading 方案，axios 拦截器不能满足所有情况
const Loading = () => {
    return <div className={s.LoadingContainer}>
        <div className={s.blurDiv} />
        <Icon type="loading" style={{ fontSize: 45 }} spin />
    </div>
}

const CustomerSelect = props => {
    return (
        <div className={s.selectContainer}>
            <span>{props.label}</span>
            {
                props.label !== '政策分类' ?
                    <Select {...props} /> :
                    <Cascader
                        onChange={props.change}
                        placeholder={'请选择'}
                        options={props.data} changeOnSelect defaultValue={['']}
                    />
            }
        </div>
    )
}

const parseSameStr = (match, str) => {
    let uni = toUnicode(match),
        reg = new RegExp(uni, 'gmi')

    return _.replace(str, reg, '<span>' + match + '</span>')
}

// 这个组件这么复杂的原因是因为需求变了，无力优化，在原有基础上修改，多处冗余，不忍直视
const Item = props => {
    const { showResult, change, selectedId, bbdXgxxId: id, title, city, province, text, match,
        writtenDate, ids, changeId } = props
    const selected = selectedId ? selectedId.includes(id) : true
    const str = text && text.length > 82 ? text.slice(0, 80) + '...' : text || ''
    const handleChange = val => change({ id, val })

    return (
        <div className={s.itemContainer}>
            {
                showResult ? <div /> : <CheckBox checked={ids.includes(id)} change={(v) => changeId(id, v)} />
            }
            <div className={s.itemContentContainer}>
                <div>
                    <div className={s.itemTitleSpan}>
                    <span dangerouslySetInnerHTML={{ __html: parseSameStr(match, title) }} />
                        <Button noWidth={true}>{city || province}</Button>
                    </div>
                    <span>成文日期：{writtenDate || '--'}</span>
                </div>
                <div className={s.itemTextContainer}>
                    <span>{str}</span>
                    {/* <span dangerouslySetInnerHTML={{ __html: parseSameStr(match, str) }} /> */}
                </div>
            </div>
            {
                showResult ?
                    <div>
                        {
                            selected ?
                                <Button size="large" type="ghost" onClick={() => handleChange(false)}>已添加</Button> :
                                <Button size="large" onClick={() => handleChange(true)}>+添加</Button>
                        }
                    </div> :
                    <div>
                        <i>×</i>
                        <span onClick={() => handleChange(false)}>移除</span>
                    </div>
            }
        </div>
    )
}

@observer
class Similarity extends Component {
    constructor(props) {
        super(props)
        this.state = {
            total: 1,
            size: 7,
            page: 1,  // 相似分析
            total2: 1,
            size2: 7,
            page2: 1, // 添加政策

            showResult: true, // 查看添加结果
            showModal: false,
            modalMsg: '对不起，您只能选择1-2条政策进行对比。',
            loading: false,
            data: [],
            addedData: [],  // 已添加的数据 后端没法提供是否已添加状态，每次查询所有再进行比对
            data2: [],
            selectedId: [],

            provinces: [],  // 省
            citys: [],      // 市
            keywords: [],   // 关键词

            inputContent: '',  // 当前选中值
            searchContent: '',  // 上一次搜索的内容
            selectedProvince: null,
            selectedCity: null,
            selectedCategory: null
        }
    }

    componentWillMount() {
        // 判断是否由别处跳转
        if (qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).from === 'others') {
            this.queryCart(1)
            this.setState({ showResult: false })
        }else{
            this.queryCart(1, true)
        }
        this.searchPolicy()

        commonService.getProvinces().then(d => {
            const newData = d.map(val => {
                return { label: val.province, value: val.regionCode }
            })

            this.setState({ provinces: newData })
        })

        // 关键词上限不超50
        commonService.getAllKeywords({ page: 1, size: 100 }).then(d => {
            const newData = d.list.map(val => {
                return { label: val.keyword, value: val.keyword }
            })

            this.setState({ keywords: newData })
        })
    }

    searchPolicy = (p = null) => {
        this.setState({ loading: true, showResult: true }, () => {
            const { inputContent, selectedProvince, selectedCity, selectedCategory, size } = this.state
            const params = {
                countyCode: selectedCity || selectedProvince,
                category: selectedCategory, title: inputContent, page: p || 1, size
            }

            similarityService.searchPolicy(params).then(d => {
                const { pageNum, total, list } = d

                this.setState({
                    page: pageNum, total, data: list, loading: false, searchContent: inputContent
                })
            })
        })
    }

    handleSelectChange = (args, name) => {
        if (Array.isArray(args)) {
            args = { selectedCategory: args[args.length - 1] }
        }
        this.setState({ ...args }, () => {
            if (name === 'selectedProvince') {
                this.getCitys()
            }
        })
    }

    queryCart = (p = null, all = false) => {
        const { size2 } = this.state
        const params = all === true ? { size: 100, page: 1 } : { size: size2, page: p || 1 }

        this.setState({ loading: true }, () => {
            similarityService.myList(params).then(d => {
                if (all === true) {
                    this.setState({ addedData: d.list.map(val => val.bbdXgxxId), loading: false })
                    return
                }
                const { pageNum, total, list } = d

                this.setState({ data2: list, page2: pageNum, total2: total, loading: false })
            })
        })
    }

    addPolicy = id => {
        similarityService.addPolicy(id).then(d => {
            this.queryCart(1, true)
        })
    }

    delPolicy = id => {
        similarityService.delPolicy(id).then(d => {
            this.queryCart(1)
            this.queryCart(1, true)
        })
    }

    getCitys = () => {
        const { selectedProvince } = this.state

        commonService.getCitys({ regionCode: selectedProvince }).then(d => {
            const newData = d.map(val => {
                return { label: val.region, value: val.regionCode }
            })

            this.setState({ citys: newData })
        })
    }

    clearAll = () => {
        this.setState({ selectedId: [] })
    }

    handleModal = (isShow = false, str = '对不起，您只能选择1-2条政策进行对比。') => {
        this.setState({ showModal: isShow, modalMsg: str })
    }

    handleShowResult = () => {
        this.queryCart(1)
        this.setState({ showResult: !this.state.showResult })
    }

    handleGoToCompare = () => {
        const { selectedId: ids } = this.state

        if (ids.length === 0) {
            this.handleModal(true, '对不起，您需要选择1-2条政策进行对比。')
            return
        }
        this.props.history.push({ pathname: '/main/compare/similarity/imports', params: ids })
    }

    handleChangeCheck = val => {
        if (val.val) {
            this.addPolicy(val.id)
            return
        }
        this.delPolicy(val.id)
    }

    handleSelect = (id, flag = true) => {
        const { selectedId: ids } = this.state

        if (flag) {
            if (ids.length > 1) {
                this.handleModal(true, '对不起，您只能选择1-2条政策进行对比。')
            } else {
                ids.push(id)
                this.setState({
                    selectedId: ids
                })
            }
        } else {
            this.setState({ selectedId: _.remove(ids, n => n !== id) })
        }
    }

    render() {
        const { total, page, showResult, data, showModal, provinces, citys, inputContent, loading,
            searchContent, modalMsg, addedData, total2, page2, data2, selectedId, size, size2 } = this.state
        const selectParams = { change: this.handleSelectChange }

        return <Box>
            <div className={s.container}>
                <div className={s.topPartContainer}>
                    <div className={s.topPartSubOne}>
                        <div>
                            <CustomerSelect label={'省份'} data={provinces} name={'selectedProvince'} {...selectParams} />
                            <CustomerSelect label={'城市'} data={citys} name={'selectedCity'} {...selectParams} />
                        </div>
                        <div>
                            <CustomerSelect label={'政策分类'} data={policy.options} {...selectParams} />
                        </div>
                    </div>
                    <div className={s.topPartSubSecond}>
                        <span>政策检索</span>
                        <Search change={this.handleSelectChange} name={'inputContent'} value={inputContent} search={this.searchPolicy} />
                    </div>
                    <div className={s.topPartSubThird}>
                        <div className={s.addResult}>
                            <span>{showResult ? '搜索结果' : '添加结果'}</span>
                        </div>
                        {
                            showResult ?
                                <div className={s.buttonGroupContainer}>
                                    <Button size={'mega'} onClick={this.handleShowResult}>查看添加结果</Button>
                                </div> :
                                <div className={s.buttonGroupContainer}>
                                    <Button size={'large'} type={'ghost'} onClick={this.clearAll}>清空</Button>
                                    <Button size={'large'} onClick={this.handleGoToCompare}>开始对比</Button>
                                </div>
                        }
                    </div>
                </div>
                {
                    showResult ?
                        <div className={s.BottomPartContainer}>
                            {
                                data.map((val, inx) =>
                                    <Item
                                        key={inx} showResult={showResult} {...val} match={searchContent}
                                        change={this.handleChangeCheck} selectedId={addedData} size={size}
                                    />
                                )
                            }
                            {
                                total ?
                                    <div className={s.paginationContainer}>
                                        <Pagination
                                            blueTheme={true} total={total} current={page}
                                            start={1} onChange={this.searchPolicy}
                                        />
                                    </div> : ''
                            }
                        </div> :
                        <div className={s.BottomPartContainer}>
                            {
                                data2.map((val, inx) =>
                                    <Item
                                        key={inx} showResult={showResult} {...val} match={searchContent}
                                        change={this.handleChangeCheck} ids={selectedId} changeId={this.handleSelect}
                                    />
                                )
                            }
                            {
                                total ?
                                    <div className={s.paginationContainer}>
                                        <Pagination
                                            blueTheme={true} total={total2} current={page2}
                                            start={1} onChange={this.queryCart} size={size2}
                                        />
                                    </div> : ''
                            }
                        </div>
                }
            </div>
            {_.isEmpty(data) ? <div className={s.emptyResult}>{'对不起，您暂无历史搜索文件，谢谢！'}</div> : ''}
            {
                showModal ?
                    <Modal message={modalMsg} confirm={this.handleModal} cancel={this.handleModal} /> : ''
            }
            {
                loading ? <Loading /> : ''
            }
        </Box>
    }
}
export default Similarity;
