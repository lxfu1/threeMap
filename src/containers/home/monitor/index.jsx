/*
 *author: yzsexe
 * date: 18/8/8
 * describe: 官网推行-容器
 */
import React, { Component } from 'react';
import { DatePicker, message } from 'antd';
import moment from 'moment';
import resource from 'resource';
import styles from './style.scss';
import LX from './images/liuxings.png';
import d3 from 'd3';
import Circle from './sub/circle';
import Compare from './sub/compare';

const ItemHeight = 120 + 55;
const Height = 170;
const {MonthPicker} = DatePicker;

class Monitor extends Component {

    constructor(props) {
        super(props);
        this.svg = null;
        this.animate = null;
        this.themeId = sessionStorage.getItem('themeID');
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();

        if (month < 1) {
            year -= 1;
            month = 11;
        }

        month = month > 9 ? month : '0' + month;
        this.state = {
            listProvince: [],
            listCity: [],
            choice: false,
            choiceCity: false,
            choiceCode: [],
            data: [],
            year: (year + month) * 1,
            themeCodes: [],
            themeData: [],
            closeCode: []
        }
    }

    componentDidMount() {
        this.svg = d3.select('#tree');
        this.animate = this.svg.append('svg').attr('class', 'animate');
        this.getProvince();
        this.getDefaultData();
    }

    getDefaultData = () => {
        resource.get(`/govacademy-server/monitor/policyFlowMonitor?themeId=${this.themeId}&years=${this.state.year}&isFirst=true`).then(res => {
            if (res.code === 200) {
                let {choiceCode} = this.state,
                    region,
                    children,
                    _res = res.data,
                    shi;

                for (let i = 0; i < _res.length; i++) {
                    region = _res[i].sheng.provinceRegionCode;
                    shi = _res[i].shi.splice(0, 4);
                    _res[i].shi = shi;
                    children = [];
                    for (let j = 0; j < shi.length; j++) {
                        children.push(shi[j].cityRegionCode);
                    }
                    choiceCode.push({region, children})
                }
                this.setState({
                    data: _res,
                    choiceCode
                }, ()=> {
                    this.drawLine();
                })
            }
        })
    }

    getDealData = () => {
        let {choiceCode, year} = this.state,
            code = '';

        choiceCode.map((item, index) => {
            code += index !== choiceCode.length - 1 ? item.region + ',' : item.region;
        })

        resource.get(`/govacademy-server/monitor/policyFlowMonitor?themeId=${this.themeId}&years=${year}&regionCodes=${code}&isFirst=false`).then(res => {
            if (res.code === 200) {
                let _res = res.data;

                for (let i = 0; i < _res.length; i++) {
                    _res[i].shi = _res[i].shi.filter(items => {
                        return JSON.stringify(choiceCode).indexOf(items.cityRegionCode) !== -1;
                    })
                }
                this.setState({
                    data: _res
                }, ()=> {
                    this.drawLine();
                })
            }
        })
    }

    getThemeData = () => {
        let {themeCodes, year} = this.state,
            code = '';

        if (!themeCodes.length) {
            return;
        }

        themeCodes.map((item, index) => {
            code += index !== themeCodes.length - 1 ? item + ',' : item;
        })

        resource.get(`/govacademy-server/monitor/livenessRanking?themeId=${this.themeId}&years=${year}&regionCodes=${code}`).then(res => {
            if (res.code === 200) {
                let {themeData} = this.state,
                    result = res.data,
                    splice;

                splice = result.splice(result.findIndex(item => item.regionCode === themeCodes[0]), 1)[0];
                result.unshift(splice);
                themeData = result;
                this.setState({themeData});
            }
        })
    }

    changYear = (m, ms) => {
        this.setState({
            year: ms.replace(/-/g, '') * 1
        }, ()=> {
            this.getDealData();
            this.getThemeData();
        })
    }

    dbClickCity = (code) => {
        let {themeCodes} = this.state;

        if (themeCodes.indexOf(code) !== -1) {
            return;
        }

        if (themeCodes.length > 4) {
            message.warning('对不起，最多只能有5个省份或城市进行PK');
            return;
        }

        themeCodes.push(code);

        this.setState({themeCodes}, ()=> {
            this.getThemeData();
        })
    }

    deleteTheme = region => {
        let {themeData, themeCodes} = this.state,
            indexCode,
            indexRegion;

        indexCode = themeCodes.indexOf(region);
        indexRegion = themeData.findIndex(item => item.regionCode === region);
        themeCodes.splice(indexCode, 1);
        themeData.splice(indexRegion, 1);

        this.setState({themeCodes, themeData});
    }

    getProvince = () => {
        resource.get('/govacademy-server/area/getAllRegionData').then(res => {
            if (res.code === 200) {
                this.setState({
                    listProvince: res.data
                })
            }
        })
    }

    //隐藏
    handleHide = (event) => {
        if (event.target.tagName === 'SPAN' || event.target.tagName === 'B') {
            return;
        }
        this.setState({
            choice: false,
            choiceCity: false
        })
    }

    //显示添加城市
    handleExchange = () => {
        this.setState({
            choice: true
        })
    }

    handleAdd = (event, level, item, ext) => {
        event.stopPropagation();
        if(item.region !== '全选'){
            let {choiceCode} = this.state,
                exist,
                region,
                children;

            exist = this.exist(item.regionCode);

            if (exist.flag) {
                // 点击省级并且存在
                choiceCode.splice(exist.index, 1);
                this.setState({choiceCode}, ()=> {
                    this.getDealData();
                });
            } else {
                if (level === '省级') {
                    if (choiceCode.length > 4) {
                        message.warning('对不起，政策流向监控只展示五个省份，若需新增监控省份，请先移除当前某一省再进行添加，谢谢！');
                        return;
                    }
                    // 点击省级-不存在
                    region = item.regionCode;
                    children = [];
                    choiceCode.push({region, children});
                } else {
                    exist = this.exist(item.parentCode);
                    if (exist.flag) {
                        // 点击市级
                        let ex = choiceCode[exist.index].children.indexOf(item.regionCode);

                        if (ex === -1) {
                            // 不存在
                            choiceCode[exist.index].children.push(item.regionCode);
                        } else {
                            choiceCode[exist.index].children.splice(ex, 1);
                        }
                    } else {
                        // 点击市级-不存在
                        if (choiceCode.length > 4) {
                            message.warning('对不起，政策流向监控只展示五个省份，若需新增监控省份，请先移除当前某一省再进行添加，谢谢！');
                            return;
                        }
                        region = item.parentCode;
                        children = [item.regionCode];
                        choiceCode.push({region, children});
                    }
                }
                this.setState({choiceCode}, ()=> {
                    this.getDealData()
                });
            }
        }else{
           // 特殊处理
            let {choiceCode, listProvince} = this.state,
                exist,
                region,
                children,
                realyCode,
                _index,
                _prevince;

            realyCode = item.regionCode.replace(/-/g, '')*1;
            exist = this.exist(realyCode);

            if (exist.flag) {
                //存在
                _index = choiceCode.findIndex(itm => itm.region === realyCode);
                choiceCode[_index].children = [];

                if(!ext){
                    _prevince = listProvince.find(itm => itm.regionCode === realyCode);
                    choiceCode[_index].children.push(item.regionCode);
                    for(let k = 0; k < _prevince.regions .length; k++){
                        choiceCode[_index].children.push(_prevince.regions[k].regionCode);
                    }
                }
            } else {
                // 不存在
                if (choiceCode.length > 4) {
                    message.warning('对不起，政策流向监控只展示五个省份，若需新增监控省份，请先移除当前某一省再进行添加，谢谢！');
                    return;
                }
                // 点击省级-不存在
                region = realyCode;
                children = [];

                _prevince = listProvince.find(itm => itm.regionCode === realyCode);
                children.push(item.regionCode);
                for(let k = 0; k < _prevince.regions .length; k++){
                    children.push(_prevince.regions[k].regionCode);
                }
                choiceCode.push({region, children});
            }
            this.setState({choiceCode}, ()=> {
                this.getDealData()
            });
        }
    }

    deleteCode = (code, type, parentCode) => {
        let {choiceCode} = this.state,
            _index,
            _innerIndex;

        if (type === '省') {
            _index = choiceCode.findIndex(item => item.region === code);
            choiceCode.splice(_index, 1);
        } else {
            _index = choiceCode.findIndex(item => item.region === parentCode);
            _innerIndex = choiceCode[_index].children.findIndex(item => item === code);
            choiceCode[_index].children.splice(_innerIndex, 1);
        }
        this.setState({
            choiceCode
        }, ()=> {
            this.getDealData();
        })
    }

    exist = region => {
        let {choiceCode} = this.state,
            flag = false,
            index;

        choiceCode.map((item, i) => {
            if (item.region === region) {
                flag = true;
                index = i;
            }
        })

        return {flag, index};
    }

    //市级数据
    spreadArea = (rg) => {
        let {listProvince} = this.state,
            listCity,
            deepCopy;

        listCity = listProvince.filter(item => {
            return item.regionCode === rg;
        })[0];

        deepCopy = JSON.parse(JSON.stringify(listCity.regions));

        if(deepCopy.length){
            // 手动添加全选
            let regionCode = (rg + '').split('').join('-'),
                region = '全选';

            deepCopy.unshift({regionCode, region});
        }

        this.setState({
            listCity: deepCopy,
            choiceCity: true
        })
    };

    // 绘制线条
    drawLine = () => {
        let {data} = this.state,
            path,
            circle,
            startX,
            startY,
            endX,
            endY;

        //document.querySelector('#tree').innerHTML = '';
        d3.selectAll('path').remove();
        d3.selectAll('circle').remove();
        d3.selectAll('image').remove();
        startX = 150;
        startY = (data.length - 1) / 2 * ItemHeight + Height / 2;
        endX = 260 - 5; //减5表示right: 5px
        for (let i = 0; i < data.length; i++) {
            endY = i * ItemHeight + Height / 2;
            path = `M${startX} ${startY} L${(startX + endX) / 2} ${startY} L${(startX + endX) / 2} ${endY} L${endX} ${endY}`;
            this.svg.append('path').attr(
                {
                    d: path,
                    stroke: '#36caf6',
                    strokeWidth: 1,
                    fill: 'none'
                }
            );
            this.svg.append('circle').attr(
                {
                    cx: endX,
                    cy: endY,
                    r: 5,
                    fill: '#36caf6'
                }
            );
            this.animate.append('image')
                .attr({
                    'width': '16',
                    'height': '7',
                    "xlink:href": LX,
                    'x': -8,
                    'y': -3.5
                }).append('animateMotion').attr('path', path).attr({
                'begin': '0s',
                'dur': '3s',
                'repeatCount': 'indefinite',
                'rotate': 'auto'
            });
            if (i === 0) {
                this.svg.append('circle').attr(
                    {
                        cx: startX,
                        cy: startY,
                        r: 5,
                        fill: '#36caf6'
                    }
                );
            }
        }
    }

    disabledEndDate = (endValue) => {
        const startValue = moment();

        if (!endValue || !startValue) {
            return false;
        }

        return endValue.valueOf() >= startValue.valueOf();
    }

    //展开收起
    spread = code => {
        let {closeCode} =  this.state;

        if(closeCode.indexOf(code) !== -1){
            closeCode.splice(closeCode.indexOf(code), 1);
        }else{
            closeCode.push(code);
        }
        this.setState({closeCode});
    }

    render() {
        let {data, listProvince, listCity, choiceCity, choice, choiceCode, themeData, year, closeCode} = this.state;

        // 此处有瑕疵，低概率事件不用考虑！
        choiceCode = JSON.stringify(choiceCode);

        return <div className={styles.container}>
            <div className={styles.filter}>
                <div className={styles.area}>
                    <div className={styles.add} onMouseOver={this.handleExchange} onMouseLeave={this.handleHide}>
                        <span className={styles.chooseBtn}>请选择 - &or;</span>
                        <ul className={styles.saveArea} style={{display: choice ? 'block':'none'}}>
                            {
                                listProvince.map((item, index) => {
                                    return <li
                                        className={choiceCode.indexOf(item.regionCode) !== -1 ? styles.checked :''}
                                        onMouseEnter={() => {this.spreadArea(item.regionCode)}}
                                        key={index}>
                                        <b onClick={(event) => {this.handleAdd(event, '省级',item)}}></b>
                                            <span onClick={(event) => {this.handleAdd(event, '省级',item)}}>
                                               {
                                                   item.region
                                               }
                                            </span>
                                    </li>
                                })
                            }
                        </ul>
                        <ul className={styles.spreadArea}
                            style={{display: choiceCity && listCity.length ? 'block':'none'}}>
                            {
                                listCity.map((item, index)=> {
                                    return <li
                                        className={choiceCode.indexOf(item.regionCode) !== -1 ? styles.checked :''}
                                        key={item.regionCode}>
                                        <b onClick={(event)=>{this.handleAdd(event, '市级',item, choiceCode.indexOf(item.regionCode) !== -1)}}></b>
                                            <span onClick={(event)=>{this.handleAdd(event, '市级',item, choiceCode.indexOf(item.regionCode) !== -1)}}>
                                                {
                                                    item.region
                                                }
                                            </span>
                                    </li>
                                })
                            }
                        </ul>
                        <div className={styles.leave} style={{display: choice ? 'block':'none'}}></div>
                    </div>
                </div>
                <div className={styles.dateBox}>
                    <MonthPicker onChange={this.changYear}
                                 allowClear={false}
                                 disabledDate={this.disabledEndDate}
                                 defaultValue={moment(year, 'YYYY-MM')}
                                 format='YYYY-MM'/>
                </div>
            </div>
            <h5 className={styles.title}>政策流向监控</h5>
            <div className={styles.treebox} style={{height: data.length * ItemHeight + 50 + 'px'}}>
                <svg className={styles.tree} id="tree"></svg>
                <div className={styles.gwy}
                     style={{top: data.length ? (data.length - 1) / 2 * ItemHeight + 37 + 'px' : '100px'}}>
                    <Circle number='国务院' root={true} only='gwy'/>
                </div>
                <div className={styles.items_box}>
                    {
                        data.length ? data.map((item, index) => {
                            return <div className={styles.common} key={item.sheng.provinceRegionCode}
                                        style={{top: ItemHeight * index + 'px'}}>
                                <div className={styles.inner}>
                                    <div className={styles.left}>
                                        <Circle number={item.sheng.provinceScore} only={'province' + index}/>
                                        <p className={styles.province}
                                           title="双击加入PK"
                                           onDoubleClick={()=>{this.dbClickCity(item.sheng.provinceRegionCode)}}>{item.sheng.provinceRegion}</p>
                                    </div>
                                    <div className={styles.right} style={{display: item.shi.length && closeCode.indexOf(item.sheng.provinceRegionCode) === -1 ? 'flex' : 'none'}}>
                                        {
                                            item.shi.map((itemInner, i) => {
                                                return <div className={styles.cities} key={itemInner.cityRegion + i}>
                                                    <span className={styles.control}
                                                          title="双击加入PK"
                                                          onDoubleClick={()=>{this.dbClickCity(itemInner.cityRegionCode)}}>{itemInner.cityRegion}</span>
                                                    <span>{itemInner.cityScore}</span>
                                                    <span className={styles.control}
                                                          onClick={()=>{this.deleteCode(itemInner.cityRegionCode, '市', item.sheng.provinceRegionCode)}}>x</span>
                                                </div>
                                            })
                                        }
                                    </div>
                                    <span className={styles.close}
                                          onClick={()=>{this.deleteCode(item.sheng.provinceRegionCode, '省')}}>x</span>
                                    <span
                                        className={styles.spread}
                                        onClick={()=>{this.spread(item.sheng.provinceRegionCode)}}
                                    >
                                        {
                                            closeCode.indexOf(item.sheng.provinceRegionCode) === -1 ?  <i className="iconfont">&#xe64b;</i> : <i id={styles.fuck} className="iconfont">&#xe62b;</i>
                                        }
                                    </span>
                                </div>
                            </div>
                        }) : null
                    }
                </div>
            </div>
            <h5 className={styles.title}>政府活跃度PK榜</h5>
            <Compare data={themeData} province={listProvince} year={year} click={this.deleteTheme}/>
        </div>;
    }
}
export default Monitor;
