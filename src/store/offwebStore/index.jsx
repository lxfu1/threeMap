import React, { Component } from 'react';
import { observable, useStrict, action, runInAction, computed } from 'mobx';
import moment from 'moment';
import resource from 'resource';
import { convertArea, formatProvince } from 'utils';
import { GetAPI } from 'service/OffWebApi';

useStrict(true);

class MyState {
    @observable years = moment().subtract(1, 'months'); // 动态当前年月(全国、省级、城市) 默认上个月
    @observable theme = ''; // 主题
    @observable themeId = ''; // 主题ID
    @observable provinceCodeMap = null;
    @observable cityCodeMap = [];

    @observable chinaCode = '0' // 中国-code
    @observable china = 'china'; // 全国-地图map名
    @observable chinaMapData = []; // 全国-地图数据
    @observable chinaRTData = null; // 全国-右上数据
    @observable chinaRMData = []; // 全国-右中数据
    @observable proCityToggle = '0'; // 全国-右中数据-省市切换: 0(省)/1(市)
    @observable provOrderToggle = 'score-desc'; // 全国-右中数据-排序切换: score-asc(顺序)/score-desc(倒序)
    @observable chinaRBData = []; // 全国-右下数据

    @observable province = ''; // 省-地图map名
    @observable provinceCode = ''; // 省-地图code
    @observable provMapData = []; // 省-地图数据
    @observable provLTData = {}; // 省-左上数据
    @observable provLBData = []; // 省-左下数据
    @observable provRTData = []; // 省-右上数据
    @observable cityOrderToggle = 'score-desc'; // 省-右上数据-排序切换: score-asc(顺序)/score-desc(倒序)
    @observable provRBData = null; // 省-右下数据

    @observable city = ''; // 城市-地图map名
    @observable cityCode = ''; // 城市-地图code
    @observable cityMapData = []; // 城市-地图数据
    @observable cityLTData = {}; // 城市-左上数据
    @observable cityLBData = null; // 城市-左下数据
    @observable cityRData = []; // 城市-右边数据

    // 流量监控跳转省市页面改变时间(for ITL)
    @action
    linkYears(name, years, type, code) {
        if (years) {
            this.years = moment(`${years.slice(0, 4)}/${years.slice(4)}`);
        }
        if (type === 'province') {
            this.changeProvince(name);
        } else {
            this.changeCity(name, code);
        }
    }

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
        this.cityInit();
    }

    // 获取全国-各省code Map对象
    @action.bound
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
            if (name) {
                this.setData('provinceCode', this.provinceCodeMap[name])
                // this.provinceCode = this.provinceCodeMap[name];

                this.provinceInit();
            }
        }).catch(err => {
            throw new Error(err)
        })
    }

    // 获取某省-全市code Map对象
    @action
    fetchCityCodeMap(name, code) {
        const SJS = ['北京', '上海', '重庆', '天津'];
        let url = GetAPI('getCode', { parentCode: this.provinceCode || code });
        let data = [];

        resource.get(url).then(res => {
            if(res.code === 200) {
                let arr = res.data;

                for(let i = 0; i < arr.length; i++) {
                    // data[arr[i].region] = arr[i].regionCode;
                    data.push({
                        name: arr[i].shortregion || arr[i].region,
                        code: arr[i].regionCode
                    })
                }
            }
            newState.setData('cityCodeMap', data);
            if(name) {
                // this.cityCode = this.cityCodeMap[name];
                const SJS = ['北京', '上海', '重庆', '天津'];

                if (SJS.indexOf(name) === -1) {
                    this.cityCode = this.cityCodeMap.find(v => v.name.indexOf(name) !== -1).code;
                } else {
                    this.cityCode = code;
                }
                this.cityInit();
            }
        }).catch(err => {
            throw new Error(err)
        })
    }


    // 切换到省
    @action
    changeProvince(province) {
        this.province = province;
        this.provLTData = {};
        this.provLBData = [];
        this.provRTData = [];
        this.provRBData = [];
        if(this.provinceCodeMap) {
            this.provinceCode = this.provinceCodeMap[province];
            this.provinceInit();
            return;
        }
        this.fetchProvinceCodeMap(province);
    }

    // 切换到市
    @action
    changeCity(city, code) {
        this.city = city;
        this.cityLBData = null;
        this.cityRData = [];
        this.fetchCityCodeMap(city, code);
    }

    @action
    clearProv() {
        this.provLTData = {};
    }

    @action
    clearCity() {
        this.cityLTData = {};
    }

    // 重置
    // @action.bound
    // resetData() {
    //     this.Province = '贵州省';
    //     this.code = 520000000000;
    //     this.year = '';
    //     this.total = 0;
    // }

    // 存data
    @action
    setData(name, data) {
        this[name] = data;
    }

    // 切换sort
    @action
    changeSort(key, value, target) {
        this[key] = value;
        let themeId = this.themeId;
        let years = moment(this.years).format('YYYYMM');

        if(target === 'china') {
            let type = this.proCityToggle;
            let sort = this.provOrderToggle;

            fetchChinaRMData(GetAPI('getActive', { themeId: themeId, years: years, type: type, sort: sort }));
            // fetchChinaMapData(GetAPI('getActive', { themeId: themeId, years: years, type: type, sort: sort }), true);
        } else if(target === 'province') {
            let code = this.provinceCode;
            let sort = this.cityOrderToggle;
            let type = '1';

            fetchProvRTData(
                GetAPI('getActive', { themeId: themeId, years: years, type: type, sort: sort, parentCode: code })
            );
            // fetchProvMapData(
            //     GetAPI('getActive', { themeId: themeId, years: years, type: type, sort: sort, parentCode: code }), true
            // );
        }
    }

    @action.bound
    chinaInit() {
        let themeId = this.themeId = sessionStorage.getItem('themeID');
        let years = moment(this.years).format('YYYYMM');
        let type = this.proCityToggle;
        let sort = this.provOrderToggle;

        fetchChinaMapData(GetAPI('getActive', { themeId: themeId, years: years, type: 0, sort: 'score-desc' }));
        fetchChinaRTData(GetAPI('getCount', { themeId: themeId }));
        fetchChinaRMData(GetAPI('getActive', { themeId: themeId, years: years, type: type, sort: sort }));
        fetchChinaRBData(GetAPI('getNews', { themeId: themeId }));
        if(!this.provinceCodeMap) {
            this.fetchProvinceCodeMap();
        }
    }

    @action.bound
    provinceInit() {
        let themeId = this.themeId = sessionStorage.getItem('themeID');
        let years = moment(this.years).format('YYYYMM');
        let province = this.province;
        let code = this.provinceCode;
        let sort = this.cityOrderToggle;
        let type = '1';

        fetchProvMapData(GetAPI('getActive', { themeId: themeId, years: years, type: type, sort: 'score-desc', parentCode: code }));
        fetchProvLTData(GetAPI('getRatio', { themeId: themeId, years: years, regionCode: code }));
        fetchProvLBData(GetAPI('getClassify', { themeId: themeId, years: years, regionCode: code, sort: 'score-desc' }));
        fetchProvRBData(GetAPI('getCount', { themeId: themeId, regionCode: code }));
        fetchProvRTData(GetAPI('getActive', { themeId: themeId, years: years, type: type, sort: sort, parentCode: code }));
    }

    @action.bound
    cityInit() {
        let themeId = this.themeId = sessionStorage.getItem('themeID');
        let years = moment(this.years).format('YYYYMM');
        let code = this.cityCode;
        let sort = 'score-asc';
        let type = '1';

        fetchCityMapData(GetAPI('getActive', { themeId: themeId, years: years, type: type, sort: sort, parentCode: code }));
        fetchCityLTData(GetAPI('getRatio', { themeId: themeId, years: years, regionCode: code }));
        fetchCityLBData(GetAPI('getCount', { themeId: themeId, regionCode: code }));
        fetchCityRData(GetAPI('getClassify', { themeId: themeId, years: years, regionCode: code, sort: 'score-desc' }));
    }
}

// 获取china地图数据
function fetchChinaMapData(url) {
    resource.get(url).then(res => {
        let data = [];

        if (res.code === 200) {
            let arr = res.data;

            arr.map((ite, index) => {
                data.push({
                    name: formatProvince(ite.region),
                    value: Number(ite.final_score.toFixed(2)),
                    rank: index + 1
                })
            })
        }
        newState.setData('chinaMapData', data);
    }).catch(err => {
        throw new Error(err);
    })
}

// 获取省地图数据
function fetchProvMapData(url) {
    resource.get(url).then(res => {
        let data = [];

        if (res.code === 200) {
            let arr = res.data;

            arr.map((ite, index) => {
                data.push({
                    name: ite.shortregion || ite.region,
                    value: Number(ite.final_score.toFixed(2)),
                    rank: index + 1
                })
            })
        }

        newState.setData('provMapData', data);
    }).catch(err => {
        throw new Error(err);
    })
}

// 获取市地图数据
function fetchCityMapData(url){
    resource.get(url).then(res => {
        let data = [];

        if (res.code === 200) {
            let arr = res.data;

            arr.map((ite, index) => {
                data.push({
                    name: ite.region,
                    value: Number(ite.final_score.toFixed(2)),
                    rank: index + 1
                })
            })
        }
        newState.setData('cityMapData', data);
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
                data.dataX.push(ite.years);
                data.data1.push(ite.total);
                data.data2.push(ite.increment);
            })
        }
        newState.setData('chinaRTData', data);
    }).catch(err => {
        throw new Error(err);
    })
}

// 获取china-右中数据
function fetchChinaRMData(url) {
    resource.get(url).then(res => {
        let data = [];

        if (res.code === 200) {
            let arr = res.data;

            arr.map((ite, index) => {
                data.push({
                    name: formatProvince(ite.region),
                    value: Number(ite.final_score.toFixed(2)),
                    rank: index + 1
                })
            })
        }
        newState.setData('chinaRMData', data.slice(0, 5));
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

// 获取省左上数据
function fetchProvLTData(url) {
    resource.get(url).then(res => {
        let data = {
            current: 0,
            yearRatio: '0%',
            ringRatio: '0%'
        };

        if (res.code === 200) {
            let DATA = res.data;

            if (!DATA[2] || !DATA[2].final_score) {
                data.yearRatio = '0%';
                data.ringRatio = '0%';
            } else {
                data.current = DATA[2].final_score;
                if (!DATA[0] || !DATA[0].final_score) {
                    data.yearRatio = '100%';
                } else {
                    let quo = Number(((DATA[2].final_score - DATA[0].final_score) / DATA[0].final_score).toFixed(2));

                    data.yearRatio = quo > 0 ? `+${quo}%` : quo < 0 ? `${quo}%` : '0%';
                }
                if (!DATA[1] || !DATA[1].final_score) {
                    data.ringRatio = '100%';
                } else {
                    let quo = Number(((DATA[2].final_score - DATA[1].final_score) / DATA[1].final_score).toFixed(2));

                    data.ringRatio = quo > 0 ? `+${quo}%` : quo < 0 ? `${quo}%` : '0%';
                }
            }
        }
        newState.setData('provLTData', data);
    }).catch(err => {
        throw new Error(err);
    })
}

// 获取省左下数据
function fetchProvLBData(url) {
    resource.get(url).then(res => {
        let data = [];

        if (res.code === 200) {
            let arr = res.data;

            arr.map(ite => {
                data.push({
                    name: ite.name,
                    value: Number(ite.score.toFixed(1)),
                    feature: ite.feature
                })
            })
        }
        newState.setData('provLBData', data);
    }).catch(err => {
        throw new Error(err);
    })
}

// 获取省右上数据
function fetchProvRTData(url) {
    resource.get(url).then(res => {
        let data = [];

        if (res.code === 200) {
            let arr = res.data;

            arr.map((ite, index) => {
                data.push({
                    name: ite.shortregion || ite.region,
                    value: Number(ite.final_score.toFixed(2)),
                    rank: index + 1
                })
            })
        }
        newState.setData('provRTData', data.slice(0, 10));
    }).catch(err => {
        throw new Error(err);
    })
}

// 获取省-右下数据
function fetchProvRBData(url) {
    resource.get(url).then(res => {
        let data = {
            dataX: [],
            data1: [],
            data2: [],
            dataName1: '新闻发布频数',
            dataName2: '执行文件频数'
        };

        if(res.code === 200) {
            let arr = res.data || [];
            let data1 = arr.filter(v => v.article_type === '新闻').slice(-6);
            let data2 = arr.filter(v => v.article_type === '政策').slice(-6);
            // let arr = res.data && res.data.slice(-6) || [];

            data1.map(ite => {
                data.dataX.push(ite.years);
                data.data1.push(ite.increment);
            })

            data2.map(ite => {
                data.data2.push(ite.increment);
            })
        }
        newState.setData('provRBData', data);
    }).catch(err => {
        throw new Error(err);
    })
}

// 获取市左上数据
function fetchCityLTData(url) {
    resource.get(url).then(res => {
        let data = {
            current: 0,
            yearRatio: 0,
            ringRatio: 0
        };

        if (res.code === 200) {
            let DATA = res.data;

            if (!DATA[2] || !DATA[2].final_score) {
                data.yearRatio = 0;
                data.ringRatio = 0;
            } else {
                data.current = DATA[2].final_score;
                if (!DATA[0] || !DATA[0].final_score) {
                    data.yearRatio = '100%';
                } else {
                    let quo = Number(((DATA[2].final_score - DATA[0].final_score) / DATA[0].final_score).toFixed(2));

                    data.yearRatio = quo > 0 ? `+${quo}%` : quo < 0 ? `${quo}%` : '0%';
                }
                if (!DATA[1] || !DATA[1].final_score) {
                    data.ringRatio = '100%';
                } else {
                    let quo = Number(((DATA[2].final_score - DATA[1].final_score) / DATA[1].final_score).toFixed(2));

                    data.ringRatio = quo > 0 ? `+${quo}%` : quo < 0 ? `${quo}%` : '0%';
                }
            }
        }
        newState.setData('cityLTData', data);
    }).catch(err => {
        throw new Error(err);
    })
}

// 获取市左下方数据
function fetchCityLBData(url) {
    resource.get(url).then(res => {
        let data = {
            dataX: [],
            data1: [],
            data2: [],
            dataName1: '新闻发布频数',
            dataName2: '执行文件频数'
        };

        if(res.code === 200) {
            let arr = res.data || [];
            let data1 = arr.filter(v => v.article_type === '新闻').slice(-6);
            let data2 = arr.filter(v => v.article_type === '政策').slice(-6);
            // let arr = res.data && res.data.slice(-6) || [];

            data1.map(ite => {
                data.dataX.push(ite.years);
                data.data1.push(ite.increment);
            })

            data2.map(ite => {
                data.data2.push(ite.increment);
            })
        }
        newState.setData('cityLBData', data);
    }).catch(err => {
        throw new Error(err);
    })
}

// 获取市左边
function fetchCityRData(url) {
    resource.get(url).then(res => {
        let data = [];

        if (res.code === 200) {
            let arr = res.data;

            arr.map(ite => {
                data.push({
                    name: ite.name,
                    value: Number(ite.score.toFixed(1)),
                    feature: ite.feature
                })
            })
        }
        newState.setData('cityRData', data);
    }).catch(err => {
        throw new Error(err);
    })
}

const newState = new MyState();

export default newState;
