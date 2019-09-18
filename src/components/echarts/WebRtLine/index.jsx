/*
 * author: yzsexe
 * date: 18/8/16
 * describe: 指数中心-官网推行-右上-折线图
 */
import React, { Component } from 'react';
import echarts from 'echarts';
import { observable } from 'mobx';
import cls from 'classnames';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import styles from './style.scss';

@immutableRenderDecorator
class WebRtLine extends Component {
    constructor(props) {
        super(props);
        this.myChart = null;
    }

    componentDidMount() {
        this.initOption(this.props.data, this.props.options);
        window.addEventListener('resize', this.myChart.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
            this.initOption(nextProps.data, nextProps.options);
        }
    }

    componentWillUnmount() {
        if (this.myChart) {
            this.myChart.dispose();
        }
    }

    initOption = (data, options) => {
        if (!this.myChart) {
            this.myChart = echarts.init(this.lineElement);
        }

        let option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#57617b'
                    }
                }
            },
            legend: {
                icon: 'circle',
                itemWidth: 8,
                itemHeight: 8,
                itemGap: 13,
                data: [data && data.dataName1, data && data.dataName2],
                top: '5%',
                right: '4%',
                textStyle: {
                    color: '#fff'
                }
            },
            grid: {
                top: options && options.gridTop || '18%',
                left: 0,
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: true,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { color: '#fff' },
                data: data && data.dataX ? observable(data.dataX).slice() : []
            }],
            yAxis: [{
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
            }],
            series: [{
                name: data && data.dataName1,
                type: 'line',
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 2
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(38, 106, 183, 0.8)'
                        }, {
                            offset: 1,
                            color: 'rgba(38, 106, 183, 0)'
                        }], false)
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgb(54, 151, 255)'
                    }
                },
                data: data && data.data1 ? observable(data.data1).slice() : []
                // data: [110, 125, 145, 122, 165, 122]
            }, {
                name: data && data.dataName2,
                type: 'line',
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 2
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(181, 87, 208, 0.7)'
                        }, {
                            offset: 1,
                            color: 'rgba(181, 87, 208, 0)'
                        }], false)
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgb(181, 87, 208)'
                    }
                },
                data: data && data.data2 ? observable(data.data2).slice() : []
                // data: [122, 220, 182, 191, 134, 150]
            }]
        };

        this.myChart.setOption(option);
    };

    render() {
        const { className, style = {} } = this.props;

        return <div className={cls(styles.container, className)} style={style} ref={ele => this.lineElement = ele} />;
    }
}

export default WebRtLine;
