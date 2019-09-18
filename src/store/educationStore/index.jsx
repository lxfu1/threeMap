import React, { Component } from 'react';
import { observable, useStrict, action, runInAction, computed } from 'mobx';
import moment from 'moment';
import resource from 'resource';
import { convertArea, formatProvince } from 'utils';
import { GetAPI } from 'service/OffWebApi';
import { GetEdAPI } from 'service/EducationApi';

useStrict(true);

class MyState {
    @observable years = moment().format('YYYY'); // 动态当前年(全国、省级、城市)
    // @observable years = 2016; // 动态当前年(全国、省级、城市)
    @observable provinceCodeMap = null;
    @observable cityCodeMap = [];

    @observable chinaCode = '0' // 中国-code
    @observable china = 'china'; // 全国-地图map名
    @observable chinaMapData = []; // 全国-地图数据
    @observable chinaRTData = null; // 全国-右上数据
    @observable chinaRMData = []; // 全国-右中数据
    @observable provOrderToggle = 'score-desc'; // 全国-右中数据-排序切换: score-asc(顺序)/score-desc(倒序)
    @observable chinaRBData = []; // 全国-右下数据

    @observable province = ''; // 省-地图map名
    @observable provinceCode = ''; // 省-地图code
    @observable provMapData = []; // 省-地图数据
    @observable provTLData = {}; // 省-左上数据
    @observable provTRData = []; // 省-左下数据
    @observable provBTypeData = null; // 省-下数据-类别
    @observable provBQuatoData = {}; // 省-下数据-指标
    @observable type = '类别';  // 类别、指标
    @observable subType = '义务教育';  // 义务教育、高中教育、农村教育花费、学校数量增长率、专任教师数量增长率、入学增长率

    //切换年月
    @action.bound
    changeYears(years, type) {
        this.years = years;
        if (type === 'china') {
            this.chinaInit();
            return;
        }
        if (type === 'province') {
            this.provinceInit();
            return;
        }
    }

    // 获取全国-各省code Map对象
    @action
    fetchProvinceCodeMap(name) {
        let url = GetAPI('getCode', { parentCode: this.chinaCode });
        let data = {};

        resource.get(url).then(res => {
            if(res.code === 200) {
                let arr = res.data;

                for(let i = 0; i < arr.length; i++) {
                    data[formatProvince(arr[i].region)] = arr[i].regionCode;
                }
            }
            newState.setData('provinceCodeMap', data);
            if(name) {
                this.provinceCode = this.provinceCodeMap[name];
                this.provinceInit();
            }
        }).catch(err => {
            throw new Error(err)
        })
    }

    // 切换到省
    @action
    changeProvince(province) {
        this.province = province;
        this.provTLData = {};
        this.provTRData = [];
        this.provRTData = [];
        this.provRBData = [];
        if(this.provinceCodeMap) {
            this.provinceCode = this.provinceCodeMap[province];
            this.provinceInit();
            return;
        }
        this.fetchProvinceCodeMap(province);
    }

    @action
    clearProv() {
        this.provTLData = {};
        this.provBTypeData = null;
    }

    // 存data
    @action
    setData(name, data) {
        this[name] = data;
    }

    // 切换sort
    @action
    changeSort(key, value, target) {
        if(target === 'china') {
            let type = this.proCityToggle;
            let sort = this.provOrderToggle;

            if (this[key] !== value) {
                let arr = this.chinaRMData.reverse();

                this.chinaRMData = arr;
            }

        }
        this[key] = value;
        let themeId = this.themeId;
        let years = moment(this.years).format('YYYY');

        console.log(this.provOrderToggle)
    }

    @action.bound
    chinaInit() {
        let years = this.years;

        fetchChinaMapData(GetEdAPI('getActive', [years]));
        fetchChinaRTData(GetEdAPI('getCount', [years]));
        fetchChinaRBData(GetEdAPI('getNews'));
        if(!this.provinceCodeMap) {
            this.fetchProvinceCodeMap();
        }
    }

    @action.bound
    provinceInit() {
        let years = this.years;
        let code = this.provinceCode;
        let type = this.subType;

        fetchProvTLData(GetEdAPI('getRatio', [years, code]));
        fetchProvTRData(GetEdAPI('getClassify', [years, code]));
        
        if (this.type === '类别') {
            fetchProvBTypeData(GetEdAPI('getTrendType', [code], { scoreType: type }));
        } else {
            fetchProvBTypeData(GetEdAPI('getTrendQuota', [code], { scoreName: type }));
        }
    }

    @action.bound
    changeType(type, subType) {
        this.type = type;
        this.subType = subType;
        this.provBTypeData = null;
        let code = this.provinceCode;

        if (this.type === '类别') {
            fetchProvBTypeData(GetEdAPI('getTrendType', [code], { scoreType: subType }));
        } else {
            fetchProvBTypeData(GetEdAPI('getTrendQuota', [code], { scoreName: subType }));
        }
    }
}

// 获取china地图数据
function fetchChinaMapData(url, echarts) {
    resource.get(url).then(res => {
        let data = [];

        if (res.code === 200) {
            let arr = res.data;

            arr.map((ite, index) => {
                data.push({
                    name: formatProvince(ite.region),
                    value: Number(ite.score.toFixed(2)),
                    rank: index + 1
                })
            })
        }
        if(!echarts) {
            newState.setData('chinaMapData', data);
        }
        // newState.setData('chinaMapData', data);
        if (newState.provOrderToggle === 'score-desc') {
            newState.setData('chinaRMData', data);
        } else {
            newState.setData('chinaRMData', data.reverse());
        }
    }).catch(err => {
        throw new Error(err);
    })
}

// 获取省地图数据
function fetchProvMapData(url, echarts) {
    resource.get(url).then(res => {
        let data = [];

        if (res.code === 200) {
            let arr = res.data;

            arr.map(ite => {
                data.push({
                    name: ite.region,
                    value: Number(ite.final_score.toFixed(2))
                })
            })
        }
        if(!echarts) {
            newState.setData('provMapData', data);
        }
        newState.setData('provRTData', data.slice(0, 10));
    }).catch(err => {
        throw new Error(err);
    })
}

// 获取china-右上数据
function fetchChinaRTData(url) {
    resource.get(url).then(res => {
        let data = {
            dataX: [],
            data1: [],
            data2: [],
            dataName1: '总量',
            dataName2: '增量'
        };

        if(res.code === 200) {
            let arr = res.data && res.data.slice(-6) || [];

            arr.map(ite => {
                data.dataX.push(`${ite.years.toString().slice(0, 4)}-${ite.years.toString().slice(4)}`);
                data.data1.push(ite.total);
                data.data2.push(ite.increment);
            })
        }
        newState.setData('chinaRTData', data);
    }).catch(err => {
        throw new Error(err);
    })
}

// 获取china-右下数据
function fetchChinaRBData(url) {
    resource.get(url).then(res => {
        let data = [];

        if(res.code === 200) {
            data = res.data.slice(0, 5);
        }
        newState.setData('chinaRBData', data);
    }).catch(err => {
        throw new Error(err);
    })
}

// 获取省上左数据
function fetchProvTLData(url) {
    resource.get(url).then(res => {
        let data = {};

        if (res.code === 200) {
            data = res.data;
        }
        newState.setData('provTLData', data);
    }).catch(err => {
        throw new Error(err);
    })
}

// 获取省上右数据
function fetchProvTRData(url) {
    resource.get(url).then(res => {
        let data = [];

        if (res.code === 200) {
            let arr = res.data;

            arr.map(ite => {
                data.push({
                    name: ite.score_name,
                    value: Number(ite.score.toFixed(1))
                })
            })
        }
        newState.setData('provTRData', data);
    }).catch(err => {
        throw new Error(err);
    })
}

// 获取省-下数据
function fetchProvBTypeData(url) {
    resource.get(url).then(res => {
        let data = null;

        if(res.code === 200) {
            let arr = res.data || [];

            data = filterMapName(arr);
        }
        newState.setData('provBTypeData', data);
    }).catch(err => {
        throw new Error(err);
    })
}

// 组装省级地图折线图数据
function filterMapName(data) {
    let res = [];
    let hash = {};

    for (let i = 0; i < data.length; i++) {
        let ite = data[i];

        if (hash[ite.score_name] !== 1) {
            res.push(ite.score_name);
            hash[ite.score_name] = 1;
        }
    }

    return packData(res, data);
}

function packData(map, data) {
    let hash = {};
    let res = [];
    let years = [];

    for (let i = 0; i < map.length; i++) {
        let ite = map[i];
        let arr = data
                    .filter(v => v.score_name === ite)
                    .sort((a, b) => a.years - b.years);

        let iteScores = [];

        arr.map(ite => {
            iteScores.push(ite.score);
        })
        res.push({
            name: ite,
            data: iteScores,
            arr: arr
        })
    }

    hash.data = res.sort((a, b) => b.data.length - a.data.length);
    hash.data[0] && hash.data[0].arr.map(ite => {
        years.push(ite.years)
    })
    hash.years = years;

    return hash;
}

const newState = new MyState();

export default newState;
