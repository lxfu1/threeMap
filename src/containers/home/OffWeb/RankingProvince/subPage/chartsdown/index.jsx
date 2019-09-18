import React, { Component } from 'react';
import style from './style.scss';
import echarts from 'echarts';

class Charts extends React.Component {
    constructor(props) {
        super(props);
        this.myChart = null;
        this.time = null;
        this.state = {};
    }

    componentDidMount() {
        this.myChart = echarts.init(this.refs.chart);
        this.getOption(this.props.datadesc,this.props.options);
        window.addEventListener('resize', this.myChart.resize);
    }

    componentWillReceiveProps(nextProps){
        if(JSON.stringify(nextProps.datadesc) === JSON.stringify(this.props.datadesc)){
            return false;
        }
        this.getOption(nextProps.datadesc,nextProps.options);
        this.myChart.resize()
    }

    componentWillUnmount() {
        this.myChart.dispose();
        window.addEventListener('resize', this.myChart.resize);
    }

    getOption = (data,options) => {
        let dataRang = []
        let dataS=[];
        let dataM=[];

        for(let i=0;i<data.length;i++){
            dataRang.push(i+1)
        }

        if (options && options.noRank && typeof options.noRank === 'boolean') {
            data.map((ite, index) => {
                dataM.push(`${ite.region}`);
                dataS.push(`${ite.final_score}`);
            })
        } else if (options && options.noRank && typeof options.noRank !== 'boolean') {
            data.map((ite, index) => {
                dataM.push(`${ite[options.noRank]}        ${ite.region}`);
                dataS.push(`${ite.final_score}`);
            })
        } else {
            data.map((ite, index) => {
                dataM.push(`${index + 1}    ${ite.region}`);
                dataS.push(`${ite.final_score}`);
            })
        }

        let option = {
            backgroundColor: 'transparent',
            grid: [
                {
                    top: '30',
                    left: 165,
                    right: '15%',
                    bottom: '3%',
                    gridIndex: 0
                },
                {
                    top: '30',
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
                    data: dataM,
                    axisLabel: {
                        show: true,
                        margin:  165,
                        color: '#fff',
                        align: 'left',
                        interval: 0
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
                    data: dataS,
                    axisTick: { show: false },
                    axisLabel: {
                        show: true,
                        color: '#fff',
                        interval: 0
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
                    data: dataS,
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
    };

    render() {
        return <div style={{ width: '100%', height: '100%' }} ref="chart" />;
    }
}

export default Charts;
