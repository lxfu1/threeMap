import React, { Component } from 'react';
import echarts from 'echarts';
import styles from './style.scss';
import cls from 'classnames';

class ChartLine extends Component {
    constructor(props) {
        super(props);
        this.myChart = null;
    }

    componentDidMount() {
        const { handleZoomChange, handleChartClick, idx = 'joke' } = this.props

        this.initOption(this.props);
        if (handleZoomChange) {
            this.myChart.on('dataZoom', function (params) {
                handleZoomChange({ start: params.start, end: params.end })
            });
        }

        if (handleChartClick && idx !== 'joke') {
            this.myChart.on('click', function (e) {
                handleChartClick(e.dataIndex, idx);
            });
        }

        window.addEventListener('resize', this.myChart.resize);
    }

    componentWillReceiveProps(nextProps) {
        this.initOption(nextProps);
    }

    componentWillUnmount() {
        if (this.myChart) {
            this.myChart.dispose();
        }
    }

    initOption = (props) => {
        const { showDataZoom = false, start = 0, end = 100, city = '北京', data = [] } = props

        if (!this.myChart) {
            this.myChart = echarts.init(this.lineElement);
        }

        let xData = [];
        let yData = [];

        for (let i = 0; i < data.length; i++) {
            xData.push(data[i].name);
            yData.push(data[i].value);
        }

        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#57617B'
                    }
                },
                formatter: `{b0} <br />${city} {c0}`
            },
            grid: {
                top: '5%',
                left: '3%',
                right: showDataZoom ? '4%' : '8%',
                bottom: showDataZoom ? '15%' : '5%',
                containLabel: true
            },
            // dataZoom: {
            //     show: showDataZoom,
            //     start: start,
            //     end: end
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
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: true,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#7d99ae',
                            width: 2
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#7d99ae'
                        }
                    },
                    data: xData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#265490',
                            width: 2
                        }
                    },
                    axisLabel: {
                        margin: 10,
                        textStyle: {
                            fontSize: '1rem',
                            color: '#7d99ae'
                        }
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],
            series: [
                {
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            width: 3,
                            color: '#60c1f7',
                            shadowBlur: 20,
                            shadowColor: 'rgba(93, 189, 242, 1)',
                            shadowOffsetY: 6
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    {
                                        offset: 0,
                                        color: 'rgba(136, 213, 255, .3)'
                                    },
                                    {
                                        offset: 0.8,
                                        color: 'rgba(136, 213, 255, .1)'
                                    }
                                ],
                                false
                            ),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 10
                        }
                    },
                    itemStyle: {
                        normal: {
                            show: true,
                            borderWidth: 3,
                            color: 'rgb(255, 255, 255)'
                        },
                        emphasis: {
                            color: 'rgb(255, 255, 255)',
                            borderColor: 'rgba(28, 174, 255, .8)',
                            borderWidth: 3
                        }
                    },
                    data: yData
                }
            ]
        };

        this.myChart.setOption(option);
    };

    render() {
        const { className, style = {} } = this.props;

        return <div className={cls(styles.container, className)} style={style} ref={ele => this.lineElement = ele} />;
    }
}

export default ChartLine;
