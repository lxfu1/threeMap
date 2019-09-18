/*
 * author: yzsexe
 * date: 18/7/26
 * describe: 中部echarts地图
 */
import React, { Component } from 'react';
import echarts from 'echarts';
import { observable } from 'mobx';
import cls from 'classnames';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import resource from 'resource';
import { convertScatterData } from 'utils';
import styles from './style.scss';

@immutableRenderDecorator
class Map extends Component {
    constructor(props) {
        super(props);
        this.myChart = null;
        this.mapJson = null;
        this.scatterData = [];
    }

    componentDidMount() {
        this.getMapJson(this.props.data, this.props.mapName, this.props.prov, this.props.visualMap);
        // this.draw(this.props.data, this.props.mapName, this.props.prov, this.props.visualMap);
        window.addEventListener('resize', this.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mapName) {
            this.getMapJson(nextProps.data, nextProps.mapName, this.props.prov, nextProps.visualMap);
        }
    }

    resize = () => {
        if(this.myChart) {
            this.myChart.dispose();
        }
        this.myChart = null;
        this.draw(this.props.data, this.props.mapName, this.props.prov, this.props.visualMap);
    }

    getMapJson = (data, mapName, prov, visualMap) => {
        let geoJson = !prov ? `json/${mapName}.json` : `json/${prov}/${mapName}.json`;

        if (!this.mapJson) {
            resource.get(geoJson).then(res => {
                this.mapJson = res;
                this.draw(data, mapName, prov, visualMap)
            })
        } else {
            this.draw(data, mapName, prov, visualMap);
        }
    }

    /**
     * 对象数组按指定key值排序
     */
    findMin2Max = (data, key, only) => {
        let min2max = [];
        let arr = [];

        if (!key) {
            return arr = data.sort((a, b) => a - b);
        }
        arr = data && data.sort((a, b) => a[key] - b[key]);
        if (arr && only) {
            for (let i = 0; i < arr.length; i++) {
                min2max.push(arr[i][key]);
            }
            return min2max;
        }
        return arr;
    };

    draw = (data, mapName, prov, visualMap) => {
        if (this.myChart) {
            this.myChart.clear();
            this.myChart.off('click', this.clickMap);
            // window.addEventListener('resize', this.myChart.resize);
        }
        if (!this.myChart) {
            this.myChart = echarts.init(this.mapElement);
        }
        // let geoJson = !prov ?
        //     require(`../../../static/json/${mapName}.json`) : require(`../../../static/json/${prov}/${mapName}.json`);
        let min2max = this.findMin2Max(data, 'value', true);

        // this.scatterData = convertScatterData(geoJson); // 描点打开
        echarts.registerMap(name, this.mapJson);
        this.myChart.setOption(this.getOption(data, min2max, visualMap));
        // this.myChart.setOption(this.getOption(data, min2max, this.scatterData)); // 描点替换
        this.myChart.on('click', this.clickMap);
    };

    getOption = (data, min2max = [], visualMap) => {
        let option = {
            tooltip: {
                show: true,
                backgroundColor: '#2a273a',
                formatter: function (params) {
                    // return `${params.name}: ${params.value || 0}`
                    return `<div>
                                <div style="border-bottom: 1px solid #95939d">${params.name}</div>
                                <div>
                                    <div>
                                        分数：${!params.value && params.data.value !== 0 ? '暂无数据' : params.data.value}
                                    </div>
                                    <div>
                                        排名：${!params.value && params.data.value !== 0 ? '暂无数据' : params.data.rank}
                                    </>
                                </div>
                            </div>`
                }
            },
            geo: {
                map: name,
                roam: false,
                selectedMode: false,
                label: {
                    show: false
                },
                itemStyle: {
                    normal: {
                        areaColor: '#061b2b',
                        shadowBlur: 50,
                        shadowColor: '#061b2b'
                    }
                }
            },
            visualMap: {
                show: visualMap || false,
                min: min2max.length ? min2max[0] : 0,
                max: min2max.length ? min2max[min2max.length - 1] : 0,
                right: '0%',
                bottom: '0%',
                orient: 'horizontal',
                itemWidth: 14,
                text: ['高', '低'], // 文本，默认为数值文本
                seriesIndex: [0],
                inRange: {
                    color: ['#03255f', '#00eaff'] // #01bdd4
                },
                textStyle: {
                    color: '#fff'
                },
                calculable: true
            },
            series: [
                {
                    name: '',
                    type: 'map',
                    mapType: name,
                    label: {
                        normal: {
                            show: false,
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        emphasis: {
                            show: false,
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: '#0e0b21',
                            borderColor: '#007bff',
                            borderWidth: 2
                        },
                        emphasis: {
                            areaColor: '#3a4c90',
                            borderWidth: 0
                        }
                    },
                    animation: true,
                    data: data && observable(data).slice() || []
                }
                // { // 描点打开，上面加逗号
                //     name: '区域名',
                //     type: 'effectScatter',
                //     coordinateSystem: 'geo',
                //     tooltip: { show: false },
                //     data: scData || [],
                //     showEffectOn: 'render',
                //     rippleEffect: {
                //         brushType: 'stroke'
                //     },
                //     hoverAnimation: true,
                //     label: {
                //         normal: {
                //             formatter: '{b}',
                //             position: 'right',
                //             color: '#fff',
                //             show: true
                //         },
                //         emphasis: {
                //             color: '#fff',
                //             position: 'top'
                //         }
                //     },
                //     itemStyle: {
                //         normal: {
                //             color: '#efba0a'
                //         }
                //     },
                //     zlevel: 1
                // }
            ]
        };

        return option;
    };

    // 单击事件
    clickMap = params => {
        if(params.data && !params.data.value) {
            return false;
        }
        let flag = params.name !== '香港' && params.name !== '台湾' && params.name !== '澳门';

        if (flag && this.props.clickMap) {
            this.props.clickMap(params.data);
        }
    };

    componentWillUnmount() {
        if (this.myChart) {
            this.myChart.dispose();
            this.myChart.off('click', this.clickMap);
            window.removeEventListener('resize', this.myChart.resize);
        }
    }

    render() {
        return <div className={styles.container} ref={ele => this.mapElement = ele} style={{ opacity: '0.9' }} />;
    }
}
export default Map;
