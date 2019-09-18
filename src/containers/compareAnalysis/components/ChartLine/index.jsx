import React, { Component } from 'react';
import echarts from 'echarts';
import styles from './style.scss';
import cls from 'classnames';
import _ from 'lodash'

const colors = ['#9E39C1', '#60c1f7', '#3382FF', '#1EAE57', '#FB5F2D']

class ChartLine extends Component {
    constructor(props) {
        super(props);
        this.myChart = null;
    }

    componentDidMount() {
        const { change } = this.props

        this.initOption();
        this.myChart.on('dataZoom', function (params) {
            change(params)
        });
        window.addEventListener('resize', this.myChart.resize);
    }

    componentDidUpdate() {
        this.initOption()
    }

    componentWillUnmount() {
        if (this.myChart) {
            this.myChart.dispose();
        }
    }

    initOption = () => {
        if (!this.myChart) {
            this.myChart = echarts.init(this.lineElement);
        }

        const { showDataZoom = false, halfYear, data, start, end, zoomBottom = 2 } = this.props
        const legend = data && data.map(val => {
            return { name: val.name, icon: 'circle' }
        })
        let dataX = data[0] && data[0].dataX ? data[0].dataX : []

        dataX = halfYear ? dataX.slice(dataX.length / 2) : dataX

        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#57617B'
                    }
                }
            },
            legend: {
                icon: 'circle',
                itemWidth: 8,
                itemHeight: 8,
                itemGap: 13,
                data: legend,
                right: '4%',
                textStyle: {
                    color: '#fff'
                }
            },
            grid: {
                top: '13%',
                left: '3%',
                right: showDataZoom ? '4%' : '8%',
                bottom: showDataZoom ? '9%' : '5%',
                containLabel: true
            },
            // dataZoom: {
            //     show: showDataZoom,
            //     start: start,
            //     end: end,
            //     bottom: zoomBottom + '%',
            //     textStyle: {
            //         color: '#fff'
            //     },
            // },
            dataZoom: [{
                'show': showDataZoom,
                'height': 20,
                'xAxisIndex': [0],
                bottom: 10,
                'start': start,
                'end': end,
                handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                handleSize: '110%',
                handleStyle: {
                    color: '#d3dee5',

                },
                textStyle: {
                    color: '#fff'
                },
                borderColor: '#90979c'
            }, {
                'type': 'inside',
                'show': true,
                'height': 15,
                'start': 1,
                'end': 35
            }],
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { color: '#fff', margin: 5 },
                data: dataX
            }],
            yAxis: [
                {
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#57617b'
                        }
                    }
                }
            ],
            series: data ? data.map((val, idx) => {
                return {
                    name: val.name,
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            width: 3,
                            color: colors[idx]
                        }
                    },
                    itemStyle: {
                        normal: {
                            show: true,
                            borderWidth: 3,
                            color: colors[idx]
                        }
                    },
                    data: halfYear ? val.data.slice(val.data.length / 2) : val.data
                }
            }) : []
        };

        this.myChart.clear()
        this.myChart.setOption(option);
    };

    render() {
        const { className, style = {} } = this.props;

        return <div className={cls(styles.container, className)} style={style} ref={ele => this.lineElement = ele} />;
    }
}

export default ChartLine;
