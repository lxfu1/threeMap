import React, { Component } from 'react'
import s from './style.scss'
import Box from 'components/Box'
import { Button, Select } from '../components'
import { Link } from 'react-router-dom'
import ChartLine from '../components/ChartLine'
import service from 'service/TrendResearch'
import commonService from 'service/CommonApi'
import moment from 'moment'
import _ from 'lodash'

const UnderlineTitle = props => {
    return (
        <div className={s.titleContainer} style={{ width: props.title.length * 16 + 70 + 'px' }}>
            <span>{props.title}</span>
        </div>
    )
}

const CustomChart = props => {
    const { title = '标题', isLeft = false, data = [], currentMonth, idx } = props
    const scoreColor = { '+': s.positiveScore, '-': s.negativeScore }
    const itemData = data[currentMonth[idx]]
    const posi = itemData ? itemData.ringRatio > 0 : true

    return (
        <div className={`${s.CustomChartContainer} ${isLeft ? s.seperateChart : ''}`}>
            <div>
                <UnderlineTitle title={title} />
            </div>
            <div className={s.chartTextContainer}>
                <aside>
                    <p>当月得分</p>
                    <span>{itemData ? itemData.value : '--'}</span>

                    <p>环比分数</p>
                    <span className={posi ? scoreColor['+'] : scoreColor['-']}>
                        {itemData ? (posi ? '+' : '') + itemData.ringRatio : '--'}%
                    </span>
                </aside>
                <div>
                    <ChartLine {...props} />
                </div>
            </div>
        </div>
    )
}

const parseData = preData => {
    return preData.map(val => {
        return {
            name: val.formatedDate,
            value: val.score && val.score.toFixed(2) || 0,
            ringRatio: val.ringRatio && (val.ringRatio * 100).toFixed(2) || 0
        }
    }).reverse()
}

class TrendResearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentMonth: [null, null, null, null], // 四个小图表‘当月得分’索引
            themeId: sessionStorage.getItem('themeID') || '',
            total: 0,
            policyNews: [],  // 最新政策发文
            activityTrend: [],  // 实时数据统计
            indexTrend: [],     // 四个小图表数据
            start: 0,       // dataZoom 开始值
            end: 100,        // dataZoom 结束值
            selectData: [],

            regionCode: '',  // 区域Id
            regionName: '北京'  // 区域名字
        }
    }

    componentWillMount() {
        commonService.getProvinces().then(d => {
            const newData = d.map(val => {
                return { label: val.province, value: val.regionCode }
            })

            this.setState({ selectData: newData })
        })
    }

    initData = () => {
        const { regionCode = '340000', currentMonth, themeId } = this.state

        service.trendResearch(themeId).then(d => {
            if (d) {
                this.setState({ policyNews: d })
            }
        })

        service.activityTrend({ regionCode, themeId }).then(d => {
            if (d) {
                const formatData = parseData(d),
                    newCurrentMonth = currentMonth.map(() => formatData.length - 1)

                const start = 100 - 5 * 100 / formatData.length

                this.setState({
                    activityTrend: formatData,
                    total: formatData.length,
                    currentMonth: newCurrentMonth,
                    start
                })
            }
        })

        service.indexTrend({ regionCode, themeId }).then(d => {
            let newData = {}

            for (let key in d) {
                newData[key] = parseData(d[key])
            }
            this.setState({ indexTrend: newData })
        })
    }

    // 筛选省份
    handleProvinceChange = args => {
        this.setState({
            regionCode: args.value,
            regionName: args.label
        }, () => this.initData())
    }

    // 大图表的范围条控制
    handleZoomChange = args => {
        const { total, currentMonth } = this.state
        const index = Math.round(args.end * total / 100) - 1
        const newCurrentMonth = currentMonth.map(() => index)

        this.setState({ ...args, currentMonth: newCurrentMonth })
    }

    // 四个小图表的点击事件
    handleChartClick = (val, idx) => {
        let { currentMonth } = this.state

        currentMonth[idx] = val
        this.setState({ currentMonth: [].concat(currentMonth) })
    }

    render() {
        const { policyNews, activityTrend, indexTrend, start, end, currentMonth, selectData, regionName, regionCode } = this.state
        const params = { start, end, currentMonth, handleChartClick: this.handleChartClick, city: regionName }

        return (
            <div className={s.container}>
                <section className={s.leftSide}>
                    <div className={s.topChartContainer}>
                        <UnderlineTitle title={'政府活跃度趋势分析'} />
                        <Select data={selectData} change={this.handleProvinceChange} />
                        <div>
                            <ChartLine
                                data={activityTrend} showDataZoom={true}
                                {...params} handleZoomChange={this.handleZoomChange}
                            />
                        </div>
                    </div>
                    <div className={s.bottomChartsContainer}>
                        <div>
                            <CustomChart title={'政策持续性指标趋势分析'} isLeft={true} idx={0} {...params} data={indexTrend['政策持续性指标']} />
                            <CustomChart title={'政府发文间隔指标趋势分析'} {...params} idx={1} data={indexTrend['政策响应及时性指标']} />
                        </div>
                        <div>
                            <CustomChart title={'政策发文频数指标趋势分析'} isLeft={true} idx={2} {...params} data={indexTrend['政策发文频数指标']} />
                            <CustomChart title={'政策新闻频数指标趋势分析'} {...params} idx={3} data={indexTrend['政策新闻频数指标']} />
                        </div>
                    </div>
                </section>
                <aside className={s.rightSide}>
                    <Box width='100%' warpStyle={{ padding: '8px 20px' }}>
                        <div className={s.topRightTitle}>
                            <UnderlineTitle title={'最新政策发文'} />
                            <Link to={'/main/info' + '?province=' + regionCode}>
                                <Button>更多</Button>
                            </Link>
                        </div>
                        <ul>
                            {
                                policyNews.length > 0 ?
                                    policyNews.map((val, inx) =>
                                        <Link key={inx} to={'/main/info/detail/' + val.articleId}>
                                            <li>
                                                <span>{val.title}</span>
                                                <time>{moment(val.createTime).format('YYYY-MM-DD')}</time>
                                            </li>
                                        </Link>
                                    ) : '新闻加载中...'
                            }
                        </ul>
                    </Box>
                </aside>
            </div>
        )
    }
}

export default TrendResearch