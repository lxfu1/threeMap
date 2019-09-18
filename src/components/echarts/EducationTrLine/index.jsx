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
import ICON1 from './images/icon1.png';
import ICON2 from './images/icon2.png';
import ICON3 from './images/icon3.png';
import ICON4 from './images/icon4.png';
import ICON5 from './images/icon5.svg';
import styles from './style.scss';

@immutableRenderDecorator
class EducationTrLine extends Component {
    constructor(props) {
        super(props);
        this.myChart = null;
    }

    componentDidMount() {
        this.initOption(this.props.data, this.props.years, this.props.options);
        window.addEventListener('resize', this.myChart.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            this.initOption(nextProps.data, nextProps.years, nextProps.options);
        }
    }

    componentWillUnmount() {
        if (this.myChart) {
            this.myChart.dispose();
        }
    }

    initOption = (data, years, options) => {
        if (!this.myChart) {
            this.myChart = echarts.init(this.lineElement);
        }
        this.myChart.clear();

        let colors = [
            { icon: ICON1, color: '#4099ff' },
            { icon: ICON2, color: '#3ae3ff' },
            { icon: ICON3, color: '#b557d0' },
            { icon: ICON4, color: '#ff763a' },
            { icon: ICON5, color: '#1ea757' }
        ]
        // let colors = ['#2dbeff', '#ff62a3', '#23ca55', '#f94427', '#da9b29']

        let seriesData = [];
        let legendData = [];

        data.map((ite, index) =>{
            seriesData.push({
                name: ite.name,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                itemStyle: {
                    normal: {
                        color: colors[index].color
                    }
                },
                data: ite.data ? observable(ite.data).slice() : []
            });

            legendData.push({
                name: ite.name,
                icon: `image://${colors[index].icon}`,
                textStyle: {
                    color: '#fff'
                }
            })
        })

        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    animation: true
                }
            },
            legend: {
                data: legendData,
                top: 20,
                right: 40,
                itemWidth: 15,
                itemHeight: 15
            },
            axisPointer: {
                link: {
                    xAxisIndex: 'all'
                }
            },
            dataZoom: {
                show: true,
                realtime: true,
                // start: 40,
                // end: 60,
                bottom: 0,
                z: 0,
                backgroundColor: 'rgba(153,153,153)',
                borderColor: 'rgba(0, 0, 0, 0)',
                textStyle:{
                    color: '#fff'
                }
            },
            grid: [{
                top: 50,
                left: 40,
                right: 40,
                bottom: 35
            }],
            xAxis: [{
                type: 'category',
                boundaryGap: true,
                axisTick: { show: false },
                axisLabel: {
                    margin: 13,
                    color: '#fff'
                },
                axisLine: {
                    show: false,
                    onZero: true
                },
                splitLine: {
                    show: false
                },
                data: observable(years).slice()
            }],
            yAxis: [{
                type: 'value',
                // max: 70,
                name: '',
                min: 0,
                // interval: 10,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#ccc',
                        width: 1
                    }
                },
                axisLabel: {
                    color: '#fff'
                },
                axisTick: { show: false },
                axisLine: { show: false,
                    lineStyle: {
                        color: '#ccc',
                        width: 0
                    }
                }
            }],
            series: seriesData
        };

        this.myChart.setOption(option);
    };

    render() {
        const { className, style = {} } = this.props;

        return <div className={cls(styles.container, className)} style={style} ref={ele => this.lineElement = ele} />;
    }
}

export default EducationTrLine;
