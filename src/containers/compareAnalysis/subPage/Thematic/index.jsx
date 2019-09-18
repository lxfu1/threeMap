import React, { Component } from 'react';
import s from './style.scss';
import Box from 'components/Box'
import { Select, Button } from '../../components'
import ChartLine from '../../components/ChartLine'
import thematicService from 'service/Thematic';
import commonService from 'service/CommonApi'
import { message } from 'antd'
import _ from 'lodash'
import provincesData from './provincesData'

// 将数据解析成图表需要用的结构
// Example: { id: '123', name: '脱贫', dataX: ['2017-06', '2017-08', '2017-10', '2017-12'], data: [11, 15, 20, 13] }
const parseData = (d, name) => {
    return _.isEmpty(d) ? [] : {
        id: d.wordId || d.code, name: name, dataX: d.array.map(val => val.time), data: d.array.map(val => val.amount)
    }
}

const calcMonthRange = (arr, flag) => {
    const r = flag ? arr.slice(arr.length / 2) : arr

    return [r[0], r[r.length - 1]]
}

// 检测数组中是否包含指定对象
const hasObj = (arr, obj) => {
    return arr.filter(val => _.isEqual(val, obj)).length > 0
}

// 第一个下拉框 Options
const selectType = [{ label: '按关键词', value: 'keyword' }, { label: '按地域', value: 'area' }]

const Item = props => {
    return (
        <Button noWidth={true} size='large' onClick={props.change}>
            {props.val.label}<b>×</b>
        </Button>
    )
}

class Thematic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            halfYear: true,    // false 一年, true 半年
            currentShow: true,  // true按关键词， false按地域
            themeName: sessionStorage.getItem('themeName') || '--',
            timeRange: [],

            keywords: [],       // 已选中关键词
            selectedCitys: [],  // 已选中城市
            chartData11: [],   // 按关键词 政策发文 图表数据
            chartData12: [],   // 按关键词 政务新闻 图表数据
            chartData2: [],    // 按地域图表数据
            start: 0,         // 关键词时间范围值 Range(start, end)
            end: 100,

            keywordsOption: [],  // 关键词候选词
            provinces: [],      // 省 候选词
            citys: []           // 市 候选词
        }
    }

    componentWillMount() {
        const opt = { label: sessionStorage.getItem('keyword'), value: sessionStorage.getItem('keywordId') }

        this.queryData(opt)

        // 关键词上限不超50
        commonService.getAllKeywords({ page: 1, size: 100 }).then(d => {
            const newData = d.list.map(val => {
                return { label: val.keyword, value: val.id }
            })

            this.setState({ keywordsOption: newData })
        }) 

        commonService.getProvinces().then(d => {
            let newData = [], filterRegion = provincesData.data.map(val => val.regionCode)

            for (let i = 0; i < d.length; i++) {
                newData.push({ label: d[i].province, value: d[i].regionCode })
                if (filterRegion.includes(d[i].regionCode)) {
                    newData.push({ label: d[i].province, value: d[i].regionCode, special: true })
                }
            }

            this.setState({ provinces: newData })
        })
    }

    // 获取关键词 & 地域趋势数据
    queryData = (opt) => {
        const { currentShow, keywords, chartData11, chartData12, chartData2, selectedCitys } = this.state
        const id = opt.value
        let data = []

        if (currentShow) {
            thematicService.byKeyword({ keywordId: id }).then(d => {
                data = parseData(d[1], opt.label)  // 关键词 -> 政策发文
                const data2 = parseData(d[0], opt.label)  // 关键词 -> 政务新闻

                if (!(_.isEmpty(data) && _.isEmpty(data2))) {
                    keywords.push(opt)
                    chartData11.push(data)
                    chartData12.push(data2)
                    this.setState({ keywords, chartData11, chartData12 }, () => this.setTimeRange(data))
                }
            })
        } else {
            thematicService.byArea({ regionCode: id }).then(d => {
                data = parseData(d[0], opt.label)

                if (!_.isEmpty(data)) {
                    selectedCitys.push(opt)
                    chartData2.push(data)
                    this.setState({ selectedCitys, chartData2 })
                }
            })
        }
    }

    setTimeRange = (d) => {
        if (_.isEmpty(this.state.timeRange)) {
            this.setState({ timeRange: d.dataX })
        }
    }

    getCitys = (opt, ugly = true) => {
        commonService.getCitys({ regionCode: opt.value }).then(d => {
            const newData = d.map(val => {
                return { label: val.region, value: val.regionCode }
            })

            if (ugly && (opt.special || _.isEmpty(newData))) {
                this.queryData(opt)  // 如果返回为空则确定为直辖市
            }

            if (!_.isEmpty(newData)) {
                this.setState({ citys: newData })
            }
        })
    }

    handleChangeType = opt => {
        this.setState({ currentShow: opt.value === 'keyword' }, () => {
            const { currentShow, selectedCitys, provinces } = this.state

            if (!currentShow && _.isEmpty(selectedCitys)) {
                this.queryData(provinces[0])
            }
        })
    }

    handleChangeTime = flag => {
        this.setState({ halfYear: flag })
    }

    handleAddOption = (opt, isKey = true) => {
        const { keywords, selectedCitys } = this.state
        const tmpPool = isKey ? keywords : selectedCitys,
            name = isKey ? '关键词' : '地域';   // 添加关键词或地域
        let isUgly = true

        if (hasObj(tmpPool, opt)) {
            message.warn(`不能重复添加${name}！`)
            return
        } else if (tmpPool.length > 4) {
            message.warn(`最多只能添加5个${name}！`)
            isUgly = false
        } else if (isKey) {
            this.queryData(opt)
            return
        }
        this.getCitys(opt, isUgly)
    }

    handleRemoveOption = (opt, isKey = true) => {
        const { keywords, chartData11, chartData12, selectedCitys, chartData2 } = this.state

        if (isKey) {
            this.setState({
                chartData11: _.remove(chartData11, val => !_.isEqual(val.id, opt.value)),
                chartData12: _.remove(chartData12, val => !_.isEqual(val.id, opt.value)),
                keywords: _.remove(keywords, val => !_.isEqual(val, opt))
            })
        } else {
            this.setState({
                chartData2: _.remove(chartData2, val => !_.isEqual(val.id, opt.value)),
                selectedCitys: _.remove(selectedCitys, val => !_.isEqual(val, opt))
            })
        }
    }

    handleRangeChange = params => {
        this.setState({ ...params })
    }

    render() {
        const { currentShow, halfYear, keywordsOption, keywords, chartData11, chartData12, start, end,
            selectedCitys, provinces, citys, chartData2, themeName, timeRange } = this.state
        const range = { start, end, halfYear, change: this.handleRangeChange }
        const monthRange = timeRange ? calcMonthRange(timeRange, halfYear) : []

        return <Box>
            <div className={s.container}>
                <div className={s.titleContainer} style={{ width: 184 }}>
                    <span>研究趋势</span>
                </div>
                <div className={s.topPartOne}>
                    <div className={s.topPartOneLeft}>
                        <Select size='small' data={selectType} newDefault={'按关键词'} change={this.handleChangeType} />
                        {
                            currentShow ? keywords.map((val, idx) =>
                                <Item key={idx} change={() => this.handleRemoveOption(val)} val={val} />) :
                                selectedCitys.map((val, idx) =>
                                    <Item key={idx} change={() => this.handleRemoveOption(val, false)} val={val} />)
                        }
                        {
                            currentShow ?
                                <Select data={keywordsOption} newDefault={'添加关键词'} change={this.handleAddOption} /> :
                                <span>
                                    <Select data={provinces} newDefault={'添加省'} change={(o) => this.handleAddOption(o, false)} />
                                    &nbsp;&nbsp;
                                    <Select data={citys} newDefault={'添加市'} change={(o) => this.handleAddOption(o, false)} />
                                </span>
                        }
                    </div>
                </div>

                <div className={s.topPartSecond}>
                    <span>{themeName}</span>
                    <span>{monthRange[0]} 至 {monthRange[1]}</span>
                </div>

                <div className={`${s.topPartOne} ${s.basicPadding}`}>
                    <div className={s.topPartOneLeft}>
                        <Button type={halfYear ? 'primary' : 'ghost'} onClick={() => this.handleChangeTime(true)}>半年</Button>
                        <Button type={halfYear ? 'ghost' : 'primary'} onClick={() => this.handleChangeTime(false)}>一年</Button>
                    </div>
                </div>

                {
                    currentShow ?
                        <div className={s.chartContainer}>
                            <div>
                                <span>政策发文</span>
                                <ChartLine data={chartData11} {...range} />
                            </div>
                            <div>
                                <span>政务新闻</span>
                                <ChartLine data={chartData12} showDataZoom={true} {...range} />
                            </div>
                        </div> :
                        <div className={s.chartAreaContainer}>
                            <ChartLine data={chartData2} showDataZoom={true} halfYear={halfYear} zoomBottom={3.5} />
                        </div>
                }
            </div>
        </Box>
    }
}

export default Thematic;