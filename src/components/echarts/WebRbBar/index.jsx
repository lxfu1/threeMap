/*
 * author: yzsexe
 * date: 18/8/20
 * describe: 指数中心-官网推行-发文频数统计-柱状图
 */
import React, { Component } from 'react';
import echarts from 'echarts';
import { observable } from 'mobx';
import cls from 'classnames';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import ICON1 from './images/icon1.png';
import ICON2 from './images/icon2.png';
import styles from './style.scss';

@immutableRenderDecorator
class BarChart extends Component {
    constructor(props) {
        super(props);
        this.myChart = null;
    }

    componentDidMount() {
        this.initOption(this.props.data);
        window.addEventListener('resize', this.myChart.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            this.initOption(nextProps.data);
        }
    }

    componentWillUnmount() {
        if (this.myChart) {
            this.myChart.dispose();
        }
    }

    initOption = data => {
        if (!this.myChart) {
            this.myChart = echarts.init(this.barElement);
        }

        const LEGEND = [
            {
                name: data && data.dataName1,
                icon: `image://${ICON1}`,
                textStyle: {
                    color: '#fff'
                }
            },
            {
                name: data && data.dataName2,
                icon: `image://${ICON2}`,
                textStyle: {
                    color: '#fff'
                }
            }
        ]

        let option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {
                    type : 'shadow'
                }
            },
            legend: {
                data: LEGEND,
                top: '2%',
                right: '3%',
                itemWidth: 15,
                itemHeight: 15
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type: 'category',
                    axisLine: {
                        lineStyle: {
                            color: '#999'
                        }
                    },
                    axisTick: { show: false },
                    axisLabel: { color: '#fff' },
                    data: data && data.dataX ? observable(data.dataX).slice() : []
                    // data : ['深圳','上海','北京','广州','长沙','武汉','成都']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: { color: '#fff' },
                    splitLine: {
                        lineStyle: {
                            color: '#999'
                        }
                    }
                }
            ],
            series : [
                {
                    name: data && data.dataName1,
                    type:'bar',
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(42, 115, 205, .7)'
                            }, {
                                offset: 1,
                                color: 'rgba(7, 39, 93, .9)'
                            }])
                        }
                    },
                    data: data && data.data1 ? observable(data.data1).slice() : []
                },
                {
                    name: data && data.dataName2,
                    type:'bar',
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(146, 75, 176, .7)'
                            }, {
                                offset: 1,
                                color: 'rgba(51, 37, 86, .9)'
                            }])
                        }
                    },
                    data: data && data.data2 ? observable(data.data2).slice() : []
                }
            ]
        };

        this.myChart.setOption(option);
    };

    render() {
        const { className, style = {} } = this.props;

        return <div className={cls(styles.container, className)} style={style} ref={ele => this.barElement = ele} />;
    }
}

export default BarChart;
