/*
 * author: yzsexe
 * date: 18/8/17
 * describe: 指数中心-官网推行-右中-柱状图
 */
import React, { Component } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import echarts from 'echarts';
import cls from 'classnames';
import styles from './style.scss';

@immutableRenderDecorator
class WebRmBar extends Component {
    constructor(props) {
        super(props);
        this.myChart = null;
        this.timer = null;
    }

    componentDidMount() {
        this.initOption(this.props.data, this.props.options);
        window.addEventListener('resize', this.myChart.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data && JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
            if (!this.timer) {
                this.timer = setTimeout(() => {
                    this.initOption(nextProps.data, nextProps.options);
                    clearTimeout(this.timer);
                    this.timer = null;
                })
            }
        }
    }

    componentWillUnmount() {
        if (this.myChart) {
            this.myChart.dispose();
        }
        window.removeEventListener('resize', this.myChart.resize);
    }

    /**
     * @param: data: 数据[{ name: name, value: value }]
     *         options: echarts图的一些自定义配置
     *                  noRank: 默认false, 带序号;
     *                          为Boolean true时, 取消序号;
     *                          为String, 取data各元素对应该key值拼接;
     */
    initOption = (data, options) => {
        if (!this.myChart) {
            this.myChart = echarts.init(this.barElement);
        }

        let dataY = [];
        let dataV = [];

        if (options && options.noRank && typeof options.noRank === 'boolean') {
            data.map((ite, index) => {
                dataY.push(`${ite.name}`);
                dataV.push(`${ite.value}`);
            })
        } else if (options && options.noRank && typeof options.noRank !== 'boolean') {
            data.map((ite, index) => {
                dataY.push(`${ite[options.noRank]}        ${ite.name}`);
                dataV.push(`${ite.value}`);
            })
        } else {
            data.map((ite, index) => {
                dataY.push(`${index + 1}    ${ite.name}`);
                dataV.push(`${ite.value}`);
            })
        }

        let option = {
            backgroundColor: 'transparent',
            grid: options && options.grid || [
                {
                    top: '3%',
                    left: 80,
                    right: '15%',
                    bottom: '3%',
                    gridIndex: 0
                },
                {
                    top: '3%',
                    left: '85%',
                    bottom: '3%',
                    width: '0%',
                    gridIndex: 1
                }
            ],
            xAxis: [
                {
                    type: 'value',
                    axisTick: { show: false },
                    splitLine: { show: false }, //数线
                    axisLine: { show: false }, //x轴线
                    axisLabel: { show: false } //x刻度值
                },
                {
                    type: 'value',
                    min: 0,
                    max: 0,
                    gridIndex: 1,
                    axisTick: { show: false },
                    axisLabel: { show: false },
                    splitLine: { show: false }
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    gridIndex: 0,
                    inverse: true,
                    data: dataY,
                    axisLabel: {
                        show: true,
                        margin: options && options.YaxisLabel || 80,
                        color: '#fff',
                        align: 'left'
                    },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisLine: { show: false }
                },
                {
                    type: 'category',
                    gridIndex: 1,
                    position: 'right',
                    inverse: true,
                    data: dataV,
                    axisTick: { show: false },
                    axisLabel: {
                        show: true,
                        color: '#fff'
                    },
                    axisLine: { show: false }
                }
            ],
            series: [
                {
                    barWidth: 14,
                    animation: true,
                    animationEasing: 'linear',
                    animationDuration: 300,
                    type: 'bar',
                    data: dataV,
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                {
                                    offset: 0,
                                    color: '#25599b'
                                },
                                {
                                    offset: 1,
                                    color: '#3ae4ff'
                                }
                            ])
                        }
                    }
                }
            ],
            color: ['#25b8f0'],
            calculable: true
        };

        this.myChart.setOption(option);
        this.myChart.resize();
    };

    render() {
        const { className, style = {} } = this.props;

        return <div className={cls(styles.container, className)} style={style} ref={ele => this.barElement = ele} />;
    }
}

export default WebRmBar;
